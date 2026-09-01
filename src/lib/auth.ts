import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function usernameDoc(username: string) {
  return doc(db, "usernames", normalizeUsername(username));
}

export async function isUsernameTaken(username: string) {
  const snapshot = await getDoc(usernameDoc(username));
  return snapshot.exists();
}

export async function signUp(username: string, email: string, password: string) {
  if (await isUsernameTaken(username)) {
    throw Object.assign(new Error("Username is already taken."), { code: "auth/username-taken" });
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: username });
  await setDoc(usernameDoc(username), { uid: credential.user.uid, email });
  return credential;
}

export function setDisplayName(user: User, name: string) {
  return updateProfile(user, { displayName: name });
}

async function resolveIdentifierToEmail(identifier: string): Promise<string> {
  if (identifier.includes("@")) return identifier;

  const snapshot = await getDoc(usernameDoc(identifier));
  if (!snapshot.exists()) {
    throw Object.assign(new Error("No account found for that username."), { code: "auth/user-not-found" });
  }
  return snapshot.data().email as string;
}

export async function signIn(identifier: string, password: string) {
  const email = await resolveIdentifierToEmail(identifier);
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return firebaseSignOut(auth);
}

