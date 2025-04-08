import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { acceptFriendRequest } from "../services/acceptFriendRequest";
import { cancelFriendRequest } from "../services/cancelFriendRequest";
import { createFriendRequest } from "../services/createFriendRequest";
import { declineFriendRequest } from "../services/declineFriendRequest";
import { removeFriend } from "../services/removeFriend";

export const friends = new Hono()
  .post(
    "/add",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async c => {
      await createFriendRequest(c.get("user"), c.req.valid("json").userId);
      return c.json(null, 201);
    }
  )
  .post(
    "/accept",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async c => {
      await acceptFriendRequest(c.get("user"), c.req.valid("json").userId);
      return c.json(null, 201);
    }
  )
  .post(
    "/decline",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async c => {
      await declineFriendRequest(c.get("user"), c.req.valid("json").userId);
      return c.json(null, 201);
    }
  )
  .delete(
    "/cancel",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async c => {
      await cancelFriendRequest(c.get("user"), c.req.valid("json").userId);
      return c.json(null, 201);
    }
  )
  .delete(
    "/remove",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
      })
    ),
    async c => {
      await removeFriend(c.get("user"), c.req.valid("json").userId);
      return c.json(null, 201);
    }
  );
