import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useIsAdmin(uid: string | null) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, "admins", uid),
      (snapshot) => setIsAdmin(snapshot.exists()),
      (error) => console.error("Failed to check admin status", error),
    );
  }, [uid]);

  return uid ? isAdmin : false;
}
