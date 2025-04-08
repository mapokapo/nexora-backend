import { UserRecord } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "../config/firebase";

export const createFriendRequest = async (
  user: UserRecord,
  otherUserId: string
): Promise<void> => {
  const friendRequests = await firestore
    .doc(`friendRequests/${user.uid}`)
    .get();
  const sentRequests = friendRequests.get("sentRequests") as string[];

  if (sentRequests.includes(otherUserId)) {
    throw new Error("Friend request already sent");
  }

  await firestore.doc(`friendRequests/${user.uid}`).update({
    sentRequests: FieldValue.arrayUnion(otherUserId),
  });
  await firestore.doc(`friendRequests/${otherUserId}`).update({
    receivedRequests: FieldValue.arrayUnion(user.uid),
  });
};
