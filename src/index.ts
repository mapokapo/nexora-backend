import { UserRecord } from "firebase-admin/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { firebaseAuth } from "./middleware/firebaseAuth";
import { forYou } from "./routers/forYou";
import { friends } from "./routers/friends";

declare module "hono" {
  interface ContextVariableMap {
    user: UserRecord;
  }
}

const app = new Hono();

app.use(cors());
app.use(firebaseAuth);

const router = app
  .route("/for-you", forYou)
  .route("/friends", friends)
  .onError((err, ctx) => {
    console.error(err);

    return ctx.text(
      ctx.error !== undefined ? ctx.error.message : "Internal server error",
      500
    );
  });

export type AppType = typeof router;

export default {
  port: 5000,
  fetch: router.fetch,
};
