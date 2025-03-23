import { Hono } from "hono";

import { getForYouPosts } from "../services/getForYouPosts";

export const forYou = new Hono().get("/", async c => {
  return c.json(await getForYouPosts(c.get("user")));
});
