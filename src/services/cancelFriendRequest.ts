import { UserRecord } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "../config/firebase";

export const cancelFriendRequest = async (
  user: UserRecord,
  otherUserId: string
): Promise<void> => {
  const friendRequests = await firestore
    .doc(`friendRequests/${user.uid}`)
    .get();

  const sentRequests = friendRequests.get("sentRequests") as string[];
  if (!sentRequests.includes(otherUserId)) {
    throw new Error("No friend request sent to this user");
  }

  await firestore.doc(`friendRequests/${user.uid}`).update({
    sentRequests: FieldValue.arrayRemove(otherUserId),
  });
  await firestore.doc(`friendRequests/${otherUserId}`).update({
    receivedRequests: FieldValue.arrayRemove(user.uid),
  });
};
