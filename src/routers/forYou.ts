import { getForYouPosts } from "@/services/getForYouPosts";
import { Hono } from "hono";

export const forYou = new Hono().get("/", async c => {
  return c.json(await getForYouPosts(c.get("user")));
});
