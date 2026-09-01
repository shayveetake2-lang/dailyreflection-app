import { useEffect, useState } from "react";
import {
  demoteFromAdmin,
  listAdminUids,
  listUserProfiles,
  promoteToAdmin,
  type UserProfile,
} from "../lib/admin";
import { requestPasswordReset } from "../lib/auth";

interface AdminPanelProps {
  currentUid: string;
  onClose: () => void;
}

export function AdminPanel({ currentUid, onClose }: AdminPanelProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [adminUids, setAdminUids] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const [profiles, admins] = await Promise.all([listUserProfiles(), listAdminUids()]);
      setUsers(profiles);
      setAdminUids(admins);
      setError(null);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (uid: string, makeAdmin: boolean) => {
    setError(null);
    try {
      if (makeAdmin) {
        await promoteToAdmin(uid);
      } else {
        await demoteFromAdmin(uid);
      }
      await refresh();
    } catch (err) {
      console.error("Failed to update admin status", err);
      setError("Could not update admin status.");
    }
  };

  const handleResetPassword = async (email: string) => {
    setError(null);
    setMessage(null);
    try {
      await requestPasswordReset(email);
      setMessage(`Password reset email sent to ${email}.`);
    } catch (err) {
      console.error("Failed to send password reset", err);
      setError("Could not send password reset email.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-brand-50 to-white text-brand-950 dark:from-brand-950 dark:to-brand-900 dark:text-brand-50">
      <header
        className="sticky top-0 z-10 border-b border-brand-100 bg-white/70 backdrop-blur-md dark:border-brand-800 dark:bg-brand-900/70"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 pb-4 sm:px-6">
          <h1 className="text-lg font-semibold text-brand-950 dark:text-brand-50 sm:text-xl">Admin panel</h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800"
          >
            Back to app
          </button>
        </div>
      </header>

      <div
        className="momentum-scroll relative mx-auto flex max-w-4xl flex-col gap-6 px-4 pt-4 sm:px-6"
        style={{ paddingBottom: 'max(2rem, calc(1rem + env(safe-area-inset-bottom)))' }}
      >
        <p className="text-sm text-brand-700 dark:text-brand-200">
          Passwords can't be set directly for security reasons — send a reset email so the user can choose their own.
        </p>

        {error && (
          <p className="rounded-lg bg-accent-50 px-4 py-2 text-sm text-accent-700 dark:bg-accent-950 dark:text-accent-100">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-700 dark:bg-brand-900 dark:text-brand-100">
            {message}
          </p>
        )}

        {loading ? (
          <div className="h-6 w-6 animate-spin self-center rounded-full border-2 border-brand-200 border-t-brand-600" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-sm dark:border-brand-800 dark:bg-brand-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-t border-brand-100 dark:border-brand-800">
                    <td className="px-4 py-2 text-brand-900 dark:text-brand-50">{u.username || "—"}</td>
                    <td className="px-4 py-2 text-brand-700 dark:text-brand-200">{u.email}</td>
                    <td className="px-4 py-2">
                      {adminUids.has(u.uid) ? (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-800 dark:text-brand-100">
                          Admin
                        </span>
                      ) : (
                        <span className="text-xs text-brand-400">Member</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u.email)}
                          className="rounded-lg border border-brand-200 px-2 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-800"
                        >
                          Send reset email
                        </button>
                        {u.uid !== currentUid && (
                          <button
                            type="button"
                            onClick={() => handleToggleAdmin(u.uid, !adminUids.has(u.uid))}
                            className="rounded-lg border border-brand-200 px-2 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-800"
                          >
                            {adminUids.has(u.uid) ? "Remove admin" : "Make admin"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-brand-400">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
