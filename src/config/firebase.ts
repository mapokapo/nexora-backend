import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp({
  credential: credential.cert("nexora_service_account_key.json"),
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);
