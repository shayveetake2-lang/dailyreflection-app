import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { OverallFeeling, Reflection } from "../types";

export interface NewReflection {
  name: string;
  date: string;
  whatDidYouDo: string;
  howDidYouFeel: string;
  overallFeeling: OverallFeeling;
  notes: string;
}

export function reflectionsQuery(userId: string) {
  return query(
    collection(db, "users", userId, "reflections"),
    orderBy("createdAt", "desc"),
  );
}

export function reflectionFromDoc(doc: QueryDocumentSnapshot): Reflection {
  const data = doc.data();
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
  return {
    id: doc.id,
    name: data.name ?? "",
    date: data.date ?? "",
    whatDidYouDo: data.whatDidYouDo ?? "",
    howDidYouFeel: data.howDidYouFeel ?? "",
    overallFeeling: data.overallFeeling ?? "okay",
    notes: data.notes ?? "",
    createdAt,
  };
}

export async function addReflection(userId: string, reflection: NewReflection) {
  await addDoc(collection(db, "users", userId, "reflections"), {
    ...reflection,
    createdAt: serverTimestamp(),
  });
}
