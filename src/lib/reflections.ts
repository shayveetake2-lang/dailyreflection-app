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
  whatILearntToday: string;
  howIFeltAboutToday: string;
  oneGoalForTomorrow: string;
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
    whatILearntToday: data.whatILearntToday ?? data.whatDidYouDo ?? "",
    howIFeltAboutToday: data.howIFeltAboutToday ?? data.howDidYouFeel ?? "",
    oneGoalForTomorrow: data.oneGoalForTomorrow ?? "",
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
