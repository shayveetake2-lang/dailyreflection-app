import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
}

export async function upsertUserProfile(uid: string, username: string, email: string) {
  await setDoc(doc(db, "users", uid), { username, email }, { merge: true });
}

export async function isAdmin(uid: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "admins", uid));
  return snapshot.exists();
}

export async function isBootstrapAvailable(): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "meta", "adminBootstrap"));
  return !snapshot.exists() || snapshot.data()?.completed !== true;
}

// One-time claim: only succeeds if no admin has been established yet for this project.
export async function claimInitialAdmin(uid: string) {
  const metaRef = doc(db, "meta", "adminBootstrap");
  const adminRef = doc(db, "admins", uid);
  await runTransaction(db, async (tx) => {
    const metaSnap = await tx.get(metaRef);
    if (metaSnap.exists() && metaSnap.data().completed === true) {
      throw new Error("An admin has already been set up for this project.");
    }
    tx.set(metaRef, { completed: true });
    tx.set(adminRef, { createdAt: serverTimestamp() });
  });
}

export async function listUserProfiles(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({
    uid: d.id,
    username: (d.data().username as string) ?? "",
    email: (d.data().email as string) ?? "",
  }));
}

export async function listAdminUids(): Promise<Set<string>> {
  const snapshot = await getDocs(collection(db, "admins"));
  return new Set(snapshot.docs.map((d) => d.id));
}

export async function promoteToAdmin(uid: string) {
  await setDoc(doc(db, "admins", uid), { createdAt: serverTimestamp() });
}

export async function demoteFromAdmin(uid: string) {
  await deleteDoc(doc(db, "admins", uid));
}
