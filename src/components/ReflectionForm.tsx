import { useState } from "react";
import type { FormEvent } from "react";
import { OVERALL_FEELING_OPTIONS, type OverallFeeling, type NewReflection } from "../types";

interface ReflectionFormProps {
  defaultName: string;
  onSubmit: (reflection: NewReflection) => void;
}

const FEELING_STYLES: Record<OverallFeeling, string> = {
  great: "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900",
  good: "border-blue-400 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-950/40 dark:ring-blue-900",
  okay: "border-amber-400 bg-amber-50 ring-2 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900",
  bad: "border-rose-400 bg-rose-50 ring-2 ring-rose-200 dark:bg-rose-950/40 dark:ring-rose-900",
  awful: "border-accent-600 bg-accent-50 ring-2 ring-accent-100 dark:bg-accent-950/40 dark:ring-accent-900",
};

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const inputClasses =
  "rounded-lg border border-brand-200 bg-brand-50/40 px-3 py-2 text-brand-950 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none dark:border-brand-700 dark:bg-brand-900 dark:text-brand-50 dark:focus:ring-brand-900/40";

export function ReflectionForm({ defaultName, onSubmit }: ReflectionFormProps) {
  const [name, setName] = useState(defaultName);
  const [syncedDefaultName, setSyncedDefaultName] = useState(defaultName);
  const [date, setDate] = useState(todayISODate);
  const [whatILearntToday, setWhatILearntToday] = useState("");
  const [howIFeltAboutToday, setHowIFeltAboutToday] = useState("");
  const [oneGoalForTomorrow, setOneGoalForTomorrow] = useState("");
  const [overallFeeling, setOverallFeeling] = useState<OverallFeeling>("okay");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  if (defaultName !== syncedDefaultName) {
    setSyncedDefaultName(defaultName);
    setName(defaultName);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatILearntToday.trim() || !howIFeltAboutToday.trim()) return;

    setSubmitting(true);
    try {
      onSubmit({
        name: name.trim(),
        date,
        whatILearntToday,
        howIFeltAboutToday,
        oneGoalForTomorrow,
        overallFeeling,
        notes,
      });
      setWhatILearntToday("");
      setHowIFeltAboutToday("");
      setOneGoalForTomorrow("");
      setOverallFeeling("okay");
      setNotes("");
      setDate(todayISODate());
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in flex flex-col gap-4 rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-lg shadow-brand-900/5 backdrop-blur-sm transition hover:shadow-xl dark:border-brand-800 dark:bg-brand-900/80"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Alex"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium text-brand-700 dark:text-brand-200">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-brand-700 dark:text-brand-200">Overall feeling</span>
          <div className="grid grid-cols-5 gap-1.5">
            {OVERALL_FEELING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-xl transition hover:scale-105 hover:shadow-sm dark:border-brand-700 dark:bg-brand-900 ${overallFeeling === option.value ? FEELING_STYLES[option.value] : "border-brand-200 bg-brand-50/40"}`}
              >
                <input
                  type="radio"
                  name="overallFeeling"
                  value={option.value}
                  checked={overallFeeling === option.value}
                  onChange={() => setOverallFeeling(option.value)}
                  className="peer sr-only"
                />
                <span className="pointer-events-none" title={option.label}>{option.label.split(" ")[0]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="whatILearntToday" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          What I learnt today
        </label>
        <textarea
          id="whatILearntToday"
          value={whatILearntToday}
          onChange={(e) => setWhatILearntToday(e.target.value)}
          required
          rows={3}
          placeholder="What I learnt today"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="howIFeltAboutToday" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          How I felt about today
        </label>
        <textarea
          id="howIFeltAboutToday"
          value={howIFeltAboutToday}
          onChange={(e) => setHowIFeltAboutToday(e.target.value)}
          required
          rows={3}
          placeholder="How I felt about today"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="oneGoalForTomorrow" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          One goal for tomorrow
        </label>
        <textarea
          id="oneGoalForTomorrow"
          value={oneGoalForTomorrow}
          onChange={(e) => setOneGoalForTomorrow(e.target.value)}
          rows={2}
          placeholder="One goal for tomorrow"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          Optional notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Preparing…" : justSaved ? "✅ Added locally" : "Add reflection"}
      </button>
    </form>
  );
}

