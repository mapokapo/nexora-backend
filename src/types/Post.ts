import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { firestoreTimestampSchema } from "../utils";

export const postSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string().min(1, "Tag is required")),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z
    .union([firestoreTimestampSchema, z.string()])
    .transform(data =>
      data instanceof Timestamp ? data.toDate() : new Date(data)
    ),
  updatedAt: z
    .union([firestoreTimestampSchema, z.string()])
    .transform(data =>
      data instanceof Timestamp ? data.toDate() : new Date(data)
    ),
});

export type Post = z.infer<typeof postSchema>;
