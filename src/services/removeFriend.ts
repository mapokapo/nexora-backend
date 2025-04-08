import { UserRecord } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "../config/firebase";

export const removeFriend = async (
  user: UserRecord,
  otherUserId: string
): Promise<void> => {
  const friendRequests = await firestore
    .doc(`friendRequests/${user.uid}`)
    .get();

  const allFriends = friendRequests.get("allFriends") as string[];
  if (!allFriends.includes(otherUserId)) {
    throw new Error("Not friends with this user");
  }

  await firestore.doc(`friendRequests/${user.uid}`).update({
    allFriends: FieldValue.arrayRemove(otherUserId),
  });
  await firestore.doc(`friendRequests/${otherUserId}`).update({
    allFriends: FieldValue.arrayRemove(user.uid),
  });
};
