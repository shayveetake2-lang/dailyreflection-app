import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { ReflectionForm } from './components/ReflectionForm'
import { ReflectionCard } from './components/ReflectionCard'
import { HelpModal } from './components/HelpModal'
import type { NewReflection, Reflection } from './types'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [tab, setTab] = useState<'today' | 'history'>('today')
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const handleSubmit = (reflection: NewReflection) => {
    setReflections((current) => [
      { ...reflection, id: crypto.randomUUID(), createdAt: Date.now() },
      ...current,
    ])
    setTab('history')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-brand-50 to-white text-brand-950 dark:from-brand-950 dark:to-brand-900 dark:text-brand-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/15" />
      <div className="pointer-events-none absolute -right-24 top-64 h-72 w-72 rounded-full bg-accent-100/40 blur-3xl dark:bg-accent-900/15" />

      <header className="sticky top-0 z-10 border-b border-brand-100 bg-white/70 backdrop-blur-md dark:border-brand-800 dark:bg-brand-900/70" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 pb-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold leading-tight text-brand-950 dark:text-brand-50 sm:text-xl">Daily Reflection</h1>
            <p className="mt-0.5 text-xs leading-tight text-brand-600 dark:text-brand-300 sm:text-sm">A private space to reflect on your day</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsHelpOpen(true)} aria-label="Help" title="Help" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-base shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800">
              ❓
            </button>
            <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-base shadow-sm transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="momentum-scroll relative mx-auto flex max-w-4xl flex-col">
        <div className="flex flex-col gap-3 px-4 pt-4 sm:px-6 lg:hidden">
          <div className="flex gap-1 rounded-full border border-brand-100 bg-brand-50/60 p-1 dark:border-brand-800 dark:bg-brand-950/60">
            <button type="button" onClick={() => setTab('today')} className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${tab === 'today' ? 'bg-white text-brand-800 shadow-sm dark:bg-brand-900 dark:text-brand-50' : 'text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200'}`}>Today</button>
            <button type="button" onClick={() => setTab('history')} className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${tab === 'history' ? 'bg-white text-brand-800 shadow-sm dark:bg-brand-900 dark:text-brand-50' : 'text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200'}`}>This session {reflections.length > 0 && `(${reflections.length})`}</button>
          </div>
        </div>

        <div className="animate-fade-in grid grid-cols-1 gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-8" style={{ paddingBottom: 'max(2rem, calc(1rem + env(safe-area-inset-bottom)))' }}>
          <div className={tab === 'today' ? 'block' : 'hidden lg:block'}>
            <ReflectionForm defaultName="" onSubmit={handleSubmit} />
          </div>
          <div className={tab === 'history' ? 'block' : 'hidden lg:block'}>
            <section className="flex flex-col gap-4">
              <h2 className="hidden text-lg font-semibold text-brand-800 dark:text-brand-200 lg:block">This session {reflections.length > 0 && `(${reflections.length})`}</h2>
              {reflections.length === 0 && <p className="text-sm text-brand-600 dark:text-brand-300">Your reflections appear here temporarily while this page is open. Nothing is uploaded or saved to a database.</p>}
              {reflections.map((reflection) => <ReflectionCard key={reflection.id} reflection={reflection} />)}
            </section>
          </div>
        </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
