import { firebaseAuth } from "@/middleware/firebaseAuth";
import { forYou } from "@/routers/forYou";
import { UserRecord } from "firebase-admin/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

declare module "hono" {
  interface ContextVariableMap {
    user: UserRecord;
  }
}

const app = new Hono();

app.use(cors());
app.use(firebaseAuth);

const router = app.route("/for-you", forYou);

export type AppType = typeof router;

export default {
  port: 5000,
  fetch: router.fetch,
};
