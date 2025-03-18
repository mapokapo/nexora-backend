import { auth } from "@/config/firebase";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const firebaseAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader === undefined || authHeader.trim().length === 0) {
    throw new HTTPException(401, {
      message: "Missing Authorization header",
    });
  }

  const parts = authHeader.split("Bearer").map(part => part.trim());
  const token = parts.length === 2 ? parts[1] : undefined;
  if (token === undefined || token.trim().length === 0) {
    throw new HTTPException(401, {
      message: "Missing Bearer token",
    });
  }

  try {
    const payload = await auth.verifyIdToken(token, true);
    const user = await auth.getUser(payload.uid);

    c.set("user", user);
  } catch (e) {
    throw new HTTPException(401, {
      message: "Invalid token",
      cause: e,
    });
  }

  await next();
});
