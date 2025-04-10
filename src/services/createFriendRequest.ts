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
  const otherFriendRequests = await firestore
    .doc(`friendRequests/${otherUserId}`)
    .get();
  const otherUserProfile = await firestore.doc(`profiles/${otherUserId}`).get();

  const sentRequests = friendRequests.get("sentRequests") as string[];
  if (sentRequests.includes(otherUserId)) {
    throw new Error("Friend request already sent");
  }

  const alreadyFriends = (
    friendRequests.get("allFriends") as string[]
  ).includes(otherUserId);
  if (alreadyFriends) {
    throw new Error("You are already friends with this user");
  }

  const allowFriendRequestsFrom = (
    otherUserProfile.get("settings") as Record<string, string>
  ).allowFriendRequestsFrom;
  const otherUserFriends = otherFriendRequests.get("allFriends") as string[];
  const isMutual = otherUserFriends.some(uid =>
    (friendRequests.get("allFriends") as string[]).includes(uid)
  );
  if (
    allowFriendRequestsFrom === "nobody" ||
    (allowFriendRequestsFrom === "mutuals" && !isMutual)
  ) {
    throw new Error("You cannot befriend this user");
  }

  await firestore.doc(`friendRequests/${user.uid}`).update({
    sentRequests: FieldValue.arrayUnion(otherUserId),
  });
  await firestore.doc(`friendRequests/${otherUserId}`).update({
    receivedRequests: FieldValue.arrayUnion(user.uid),
  });
};
