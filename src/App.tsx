import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { useAuthUser } from './hooks/useAuthUser'
import { useIsAdmin } from './hooks/useIsAdmin'
import { useTheme } from './hooks/useTheme'
import { ReflectionForm } from './components/ReflectionForm'
import { ReflectionCard } from './components/ReflectionCard'
import { LoginPage } from './components/LoginPage'
import { AdminPanel } from './components/AdminPanel'
import { setDisplayName, signOut } from './lib/auth'
import { claimInitialAdmin, isBootstrapAvailable, upsertUserProfile } from './lib/admin'
import { addReflection, reflectionFromDoc, reflectionsQuery, type NewReflection } from './lib/reflections'
import type { Reflection } from './types'

function App() {
  const { user, loading: authLoading } = useAuthUser()
  const { theme, toggleTheme } = useTheme()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayName, setDisplayNameState] = useState('')
  const [syncedUserId, setSyncedUserId] = useState<string | null | undefined>(undefined)
  const [view, setView] = useState<'app' | 'admin'>('app')
  const [tab, setTab] = useState<'today' | 'history'>('today')
  const [bootstrapAvailable, setBootstrapAvailable] = useState(false)

  const userId = user?.uid ?? null
  const isAdmin = useIsAdmin(userId)

  if (syncedUserId !== userId) {
    setSyncedUserId(userId)
    setDisplayNameState(user?.displayName ?? '')
  }

  useEffect(() => {
    if (!user) return
    upsertUserProfile(user.uid, user.displayName ?? '', user.email ?? '').catch((err) =>
      console.error('Failed to sync user profile', err),
    )
    isBootstrapAvailable()
      .then(setBootstrapAvailable)
      .catch((err) => console.error('Failed to check admin bootstrap status', err))
  }, [user])

  useEffect(() => {
    if (!userId) return

    const unsubscribe = onSnapshot(
      reflectionsQuery(userId),
      (snapshot) => {
        setReflections(snapshot.docs.map(reflectionFromDoc))
        setLoading(false)
      },
      (err) => {
        console.error('Failed to load reflections', err)
        setError('Could not load your reflections. Please try again later.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [userId])

  const handleSubmit = async (reflection: NewReflection) => {
    if (!userId) return
    try {
      await addReflection(userId, reflection)
      setError(null)
      setTab('history')
    } catch (err) {
      console.error('Failed to save reflection', err)
      setError('Could not save your reflection. Please try again.')
    }
  }

  const handleNameChange = async (name: string) => {
    if (!user) return
    setDisplayNameState(name)
    try {
      await setDisplayName(user, name)
      await upsertUserProfile(user.uid, name, user.email ?? '')
    } catch (err) {
      console.error('Failed to save your name', err)
    }
  }

  const handleClaimAdmin = async () => {
    if (!user) return
    try {
      await claimInitialAdmin(user.uid)
      setBootstrapAvailable(false)
    } catch (err) {
      console.error('Failed to claim admin', err)
      setError('Could not claim admin access. Please try again.')
      isBootstrapAvailable()
        .then(setBootstrapAvailable)
        .catch((refreshErr) => console.error('Failed to re-check admin bootstrap status', refreshErr))
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50 dark:bg-brand-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-brand-700" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  if (view === 'admin' && isAdmin) {
    return <AdminPanel currentUid={user.uid} onClose={() => setView('app')} />
  }

  return (
    <div className="min-h-screen bg-brand-100/60 dark:bg-brand-950 sm:flex sm:items-center sm:justify-center sm:py-6">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-brand-50 to-white text-brand-950 dark:from-brand-950 dark:to-brand-900 dark:text-brand-50 sm:min-h-[850px] sm:max-w-[430px] sm:rounded-[2.5rem] sm:border sm:border-brand-200 sm:shadow-2xl sm:shadow-brand-900/10 dark:sm:border-brand-800">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/15" />
        <div className="pointer-events-none absolute -right-24 top-64 h-72 w-72 rounded-full bg-accent-100/40 blur-3xl dark:bg-accent-900/15" />

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white/70 px-4 pb-4 backdrop-blur-md dark:border-brand-800 dark:bg-brand-900/70" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-brand-950 dark:text-brand-50">Daily Reflection</h1>
            <p className="mt-0.5 text-xs leading-tight text-brand-600 dark:text-brand-300">
              {displayName ? `Welcome back, ${displayName} 👋` : 'A calm space to reflect on your day'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-base shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setView('admin')}
                aria-label="Admin panel"
                title="Admin panel"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-base shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800"
              >
                🛡️
              </button>
            )}
            <button
              type="button"
              onClick={() => signOut()}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-base shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800"
            >
              ⏻
            </button>
          </div>
        </header>

        <div className="momentum-scroll relative flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-3 px-4 pt-4">
            {bootstrapAvailable && !isAdmin && (
              <button
                type="button"
                onClick={handleClaimAdmin}
                className="animate-fade-in self-start text-xs font-medium text-brand-500 underline-offset-2 transition hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-200"
              >
                Claim admin access (first-time setup)
              </button>
            )}

            {error && (
              <p className="animate-fade-in rounded-lg bg-accent-50 px-4 py-2 text-sm text-accent-700 dark:bg-accent-950 dark:text-accent-100">
                {error}
              </p>
            )}

            <div className="flex gap-1 rounded-full border border-brand-100 bg-brand-50/60 p-1 dark:border-brand-800 dark:bg-brand-950/60">
              <button
                type="button"
                onClick={() => setTab('today')}
                className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  tab === 'today'
                    ? 'bg-white text-brand-800 shadow-sm dark:bg-brand-900 dark:text-brand-50'
                    : 'text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTab('history')}
                className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  tab === 'history'
                    ? 'bg-white text-brand-800 shadow-sm dark:bg-brand-900 dark:text-brand-50'
                    : 'text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200'
                }`}
              >
                History {reflections.length > 0 && `(${reflections.length})`}
              </button>
            </div>
          </div>

          <div className="animate-fade-in flex flex-col gap-6 px-4 pt-4" style={{ paddingBottom: 'max(2rem, calc(1rem + env(safe-area-inset-bottom)))' }}>
            {tab === 'today' && (
              <ReflectionForm defaultName={displayName} onSubmit={handleSubmit} onNameChange={handleNameChange} />
            )}

            {tab === 'history' && (
              <section className="flex flex-col gap-4">
                {loading && (
                  <div className="h-6 w-6 animate-spin self-center rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-brand-700" />
                )}
                {!loading && reflections.length === 0 && (
                  <p className="text-sm text-brand-600 dark:text-brand-300">
                    No reflections yet — switch to Today to write your first one.
                  </p>
                )}
                {reflections.map((reflection) => (
                  <ReflectionCard key={reflection.id} reflection={reflection} />
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App



