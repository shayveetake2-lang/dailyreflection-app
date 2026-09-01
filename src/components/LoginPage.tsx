// @ts-nocheck
import { useState } from "react";
import type { FormEvent } from "react";
import { signIn, signUp } from "../lib/auth";

function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/username-taken":
      return "That username is already taken.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email/username or password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function LoginPage() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "signIn") {
        await signIn(identifier, password);
      } else {
        await signUp(username, email, password);
        // updateProfile doesn't re-emit onAuthStateChanged, so reload to pick up the display name.
        window.location.reload();
      }
    } catch (err) {
      console.error("Authentication failed", err);
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Daily Reflection</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {mode === "signIn" ? "Sign in to continue" : "Create an account to get started"}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          {mode === "signIn" ? (
            <div className="flex flex-col gap-1">
              <label htmlFor="identifier" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  pattern="[a-zA-Z0-9_.]{3,20}"
                  title="3-20 characters: letters, numbers, underscores, or periods"
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Please wait…" : mode === "signIn" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signIn" ? "signUp" : "signIn"))
            setError(null)
          }}
          className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {mode === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

