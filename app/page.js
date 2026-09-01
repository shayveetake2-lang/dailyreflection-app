"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, provider, db } from "../firebaseConfig";
import { useDarkMode } from "./DarkModeProvider";
import { Sun, Moon, LogOut, Download, Share2, Mail } from "lucide-react";

const MOODS = [
  { value: "great", label: "🤩 Great" },
  { value: "good", label: "🙂 Good" },
  { value: "okay", label: "😐 Okay" },
  { value: "bad", label: "😔 Bad" },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatReflectionText(r) {
  const mood = MOODS.find((m) => m.value === r.mood)?.label ?? r.mood;
  return [
    `Daily Reflection – ${r.date}`,
    ``,
    `What I did today:`,
    r.activity,
    ``,
    `How I felt about it:`,
    r.feelings,
    ``,
    `Overall feeling: ${mood}`,
    r.notes ? `\nNotes:\n${r.notes}` : "",
  ]
    .join("\n")
    .trim();
}

function downloadReflection(r) {
  const text = formatReflectionText(r);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reflection-${r.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyToClipboard(r) {
  const text = formatReflectionText(r);
  navigator.clipboard.writeText(text).then(() => {
    alert("Reflection copied to clipboard! Paste it into Slack.");
  }).catch(() => {
    alert("Could not copy to clipboard. Please copy the text manually.");
  });
}

function emailReflection(r) {
  const subject = encodeURIComponent(`Daily Reflection – ${r.date}`);
  const body = encodeURIComponent(formatReflectionText(r));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export default function Home() {
  const { dark, toggleDark } = useDarkMode();

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signInError, setSignInError] = useState("");

  // Form state
  const [date] = useState(getTodayDate());
  const [activity, setActivity] = useState("");
  const [feelings, setFeelings] = useState("");
  const [mood, setMood] = useState("good");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  // Reflections list
  const [reflections, setReflections] = useState([]);
  const [reflectionsError, setReflectionsError] = useState("");

  // Auth listener — only subscribe when auth is available (client-side)
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Firestore real-time listener
  useEffect(() => {
    if (!user || !db) {
      setReflections([]);
      return;
    }
    setReflectionsError("");
    const q = query(
      collection(db, "users", user.uid, "reflections"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setReflections(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReflectionsError("");
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setReflectionsError(
          "Could not load reflections. Check your Firestore rules and connection."
        );
      }
    );
    return unsub;
  }, [user]);

  const handleSignIn = useCallback(async () => {
    if (!auth) return;
    setSignInError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setSignInError("Sign-in failed. Please try again.");
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user || !db) return;
      setSubmitting(true);
      setSaveError("");
      try {
        await addDoc(collection(db, "users", user.uid, "reflections"), {
          date,
          activity,
          feelings,
          mood,
          notes,
          createdAt: serverTimestamp(),
        });
        setActivity("");
        setFeelings("");
        setMood("good");
        setNotes("");
        setSuccessMsg("Reflection saved! ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (err) {
        console.error(err);
        setSaveError("Failed to save. Check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [user, date, activity, feelings, mood, notes]
  );

  // ── Styles ──────────────────────────────────────────────────────────────────

  const inputCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
  const labelCls = "block text-sm font-medium mb-1";
  const btnPrimary =
    "px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition disabled:opacity-50";

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-slate-100 dark:bg-slate-800 shadow-sm">
        <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">
          Daily Reflection
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition"
            >
              <LogOut size={16} />
              Sign out
            </button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {authLoading ? (
          <p className="text-center text-slate-400 mt-24">Loading…</p>
        ) : !user ? (
          /* ── Sign-in screen ── */
          <div className="flex flex-col items-center gap-6 mt-24">
            <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              Welcome 👋
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sign in to start tracking your daily reflections.
            </p>
            {signInError && (
              <p className="text-red-500 text-sm">{signInError}</p>
            )}
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow hover:shadow-md transition text-sm font-medium"
            >
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
                unoptimized
              />
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            {/* ── Reflection Form ── */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                Today&apos;s Reflection
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Date */}
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    value={date}
                    readOnly
                    className={inputCls + " cursor-not-allowed opacity-70"}
                  />
                </div>
                {/* Activity */}
                <div>
                  <label className={labelCls}>What did you do today?</label>
                  <textarea
                    required
                    rows={3}
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="Describe your activities…"
                    className={inputCls + " resize-none"}
                  />
                </div>
                {/* Feelings */}
                <div>
                  <label className={labelCls}>
                    How did you feel about it?
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feelings}
                    onChange={(e) => setFeelings(e.target.value)}
                    placeholder="Describe your feelings…"
                    className={inputCls + " resize-none"}
                  />
                </div>
                {/* Mood */}
                <div>
                  <label className={labelCls}>Overall feeling</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className={inputCls}
                  >
                    {MOODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Notes */}
                <div>
                  <label className={labelCls}>Optional Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything else on your mind…"
                    className={inputCls + " resize-none"}
                  />
                </div>
                {successMsg && (
                  <p className="text-green-500 text-sm">{successMsg}</p>
                )}
                {saveError && (
                  <p className="text-red-500 text-sm">{saveError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={btnPrimary + " self-end"}
                >
                  {submitting ? "Saving…" : "Save Reflection"}
                </button>
              </form>
            </section>

            {/* ── Past Reflections ── */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                Past Reflections
              </h2>
              {reflectionsError && (
                <p className="text-red-500 text-sm mb-4">{reflectionsError}</p>
              )}
              {reflections.length === 0 && !reflectionsError ? (
                <p className="text-slate-400 text-sm">
                  No reflections yet. Add your first one above!
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {reflections.map((r) => {
                    const moodLabel =
                      MOODS.find((m) => m.value === r.mood)?.label ?? r.mood;
                    return (
                      <li
                        key={r.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {r.date}
                          </span>
                          <span className="text-sm">{moodLabel}</span>
                        </div>
                        <p className="text-sm font-medium mb-1">What I did:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 whitespace-pre-wrap">
                          {r.activity}
                        </p>
                        <p className="text-sm font-medium mb-1">How I felt:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 whitespace-pre-wrap">
                          {r.feelings}
                        </p>
                        {r.notes && (
                          <>
                            <p className="text-sm font-medium mb-1">Notes:</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 whitespace-pre-wrap">
                              {r.notes}
                            </p>
                          </>
                        )}
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => downloadReflection(r)}
                            title="Download as .txt"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-medium transition"
                          >
                            <Download size={14} />
                            Download
                          </button>
                          <button
                            onClick={() => copyToClipboard(r)}
                            title="Copy for Slack"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 text-xs font-medium transition"
                          >
                            <Share2 size={14} />
                            Slack
                          </button>
                          <button
                            onClick={() => emailReflection(r)}
                            title="Send via Email"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-xs font-medium transition"
                          >
                            <Mail size={14} />
                            Email
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
