import { firestore } from "@/config/firebase";
import { Post, postSchema } from "@/types/Post";
import { UserRecord } from "firebase-admin/auth";
import { z } from "zod";

export const getForYouPosts = async (user: UserRecord): Promise<Post[]> => {
  const tags = new Set<string>();

  const likedPosts = await firestore
    .collection("posts")
    .where("userId", "==", user.uid)
    .get();

  likedPosts.forEach(p => {
    (p.get("tags") as string[]).forEach(t => tags.add(t));
  });

  const recommendedPosts =
    tags.size === 0
      ? await firestore
          .collection("posts")
          .orderBy("updatedAt", "desc")
          .limit(20)
          .get()
      : await firestore
          .collection("posts")
          .where("tags", "array-contains-any", Array.from(tags))
          .limit(20)
          .get();

  const result = z
    .array(postSchema)
    .safeParse(
      recommendedPosts.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );

  if (!result.success) {
    console.error(result.error.issues);
    return [];
  }

  return result.data;
};
