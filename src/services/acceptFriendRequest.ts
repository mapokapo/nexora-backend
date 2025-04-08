import { UserRecord } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "../config/firebase";

export const acceptFriendRequest = async (
  user: UserRecord,
  otherUserId: string
): Promise<void> => {
  const friendRequests = await firestore
    .doc(`friendRequests/${user.uid}`)
    .get();

  const receivedRequests = friendRequests.get("receivedRequests") as string[];
  if (!receivedRequests.includes(otherUserId)) {
    throw new Error("No friend request received from this user");
  }

  await firestore.doc(`friendRequests/${user.uid}`).update({
    receivedRequests: FieldValue.arrayRemove(otherUserId),
    allFriends: FieldValue.arrayUnion(otherUserId),
  });
  await firestore.doc(`friendRequests/${otherUserId}`).update({
    sentRequests: FieldValue.arrayRemove(user.uid),
    allFriends: FieldValue.arrayUnion(user.uid),
  });
};
