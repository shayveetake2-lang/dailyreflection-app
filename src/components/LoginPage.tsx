import { useState } from "react";
import type { FormEvent } from "react";
import { requestPasswordReset, signIn, signUp } from "../lib/auth";

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

const inputClasses =
  "rounded-xl border border-brand-200 bg-white/80 px-3 py-2.5 text-brand-950 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none dark:border-brand-700 dark:bg-brand-900/60 dark:text-brand-50 dark:focus:ring-brand-800/60";

export function LoginPage() {
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgotPassword">("signIn");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signIn") {
        await signIn(identifier, password);
      } else if (mode === "signUp") {
        await signUp(username, email, password);
        // updateProfile doesn't re-emit onAuthStateChanged, so reload to pick up the display name.
        window.location.reload();
      } else {
        // Always show the generic message here, even on failure (e.g. unknown username),
        // so the response can't be used to enumerate which accounts exist.
        try {
          await requestPasswordReset(identifier);
        } catch (err) {
          console.error("Password reset request failed", err);
        }
        setMessage("If that account exists, a password reset email has been sent.");
      }
    } catch (err) {
      console.error("Authentication failed", err);
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-100/60 dark:bg-brand-950 sm:flex sm:items-center sm:justify-center sm:py-6">
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4 dark:from-brand-950 dark:via-brand-950 dark:to-brand-900 sm:min-h-[850px] sm:max-w-[430px] sm:rounded-[2.5rem] sm:border sm:border-brand-200 sm:shadow-2xl sm:shadow-brand-900/10 dark:sm:border-brand-800"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent-100/50 blur-3xl dark:bg-accent-900/20" />

        <div className="animate-fade-in relative w-full max-w-sm rounded-3xl border border-brand-100 bg-white/80 p-7 shadow-xl shadow-brand-900/5 backdrop-blur-sm transition dark:border-brand-800 dark:bg-brand-900/80">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl dark:bg-brand-800">
            🌿
          </div>
          <h1 className="mt-3 text-center text-xl font-semibold text-brand-950 dark:text-brand-50">Daily Reflection</h1>
          <p className="mt-1 text-center text-sm text-brand-600 dark:text-brand-300">
            A calm, private space to jot down what you did each day, how it felt, and look back on past entries.
          </p>

        <div className="mt-4 rounded-xl bg-brand-50/80 px-3 py-2.5 text-xs leading-relaxed text-brand-700 dark:bg-brand-950/60 dark:text-brand-200">
          <p>
            <strong>Already have an account?</strong> Sign in below with either your email or your username.
          </p>
          <p className="mt-1">
            <strong>New here?</strong> Tap "Need an account? Sign up" to pick a username, add your email, and set a
            password.
          </p>
        </div>

        <p className="mt-4 text-sm font-medium text-brand-700 dark:text-brand-200">
          {mode === "signIn" && "Sign in to continue"}
          {mode === "signUp" && "Create an account to get started"}
          {mode === "forgotPassword" && "Enter your email or username to reset your password"}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          {mode === "signUp" ? (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-medium text-brand-700 dark:text-brand-200">
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
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-brand-700 dark:text-brand-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <label htmlFor="identifier" className="text-sm font-medium text-brand-700 dark:text-brand-200">
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
          )}

          {mode !== "forgotPassword" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-brand-700 dark:text-brand-200">
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
                className={inputClasses}
              />
            </div>
          )}

          {mode === "signIn" && (
            <button
              type="button"
              onClick={() => {
                setMode("forgotPassword");
                setError(null);
                setMessage(null);
              }}
              className="self-end text-xs font-medium text-brand-600 transition hover:text-brand-800 hover:underline dark:text-brand-300 dark:hover:text-brand-100"
            >
              Forgot password?
            </button>
          )}

          {error && (
            <p className="animate-fade-in rounded-xl bg-accent-50 px-3 py-2 text-sm text-accent-700 dark:bg-accent-950 dark:text-accent-100">
              {error}
            </p>
          )}
          {message && (
            <p className="animate-fade-in rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900 dark:text-brand-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 font-medium text-white shadow-md shadow-brand-900/10 transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting
              ? "Please wait…"
              : mode === "signIn"
                ? "Sign in"
                : mode === "signUp"
                  ? "Sign up"
                  : "Send reset email"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signUp" ? "signIn" : m === "signIn" ? "signUp" : "signIn"))
            setError(null)
            setMessage(null)
          }}
          className="mt-4 w-full text-center text-sm font-medium text-brand-600 transition hover:text-brand-800 hover:underline dark:text-brand-300 dark:hover:text-brand-100"
        >
          {mode === "signUp" ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
        </div>
      </div>
    </div>
  );
}


