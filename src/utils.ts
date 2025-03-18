import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const firestoreTimestampSchema = z.custom<Timestamp>(data => {
  return data instanceof Timestamp;
});
