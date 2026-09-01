import { useState } from "react";
import type { FormEvent } from "react";
import { OVERALL_FEELING_OPTIONS, type OverallFeeling } from "../types";
import type { NewReflection } from "../lib/reflections";

interface ReflectionFormProps {
  defaultName: string;
  onSubmit: (reflection: NewReflection) => Promise<void>;
  onNameChange: (name: string) => void;
}

const FEELING_STYLES: Record<OverallFeeling, string> = {
  great: "peer-checked:border-emerald-400 peer-checked:bg-emerald-50 peer-checked:ring-2 peer-checked:ring-emerald-200 dark:peer-checked:bg-emerald-950/40 dark:peer-checked:ring-emerald-900",
  good: "peer-checked:border-blue-400 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-200 dark:peer-checked:bg-blue-950/40 dark:peer-checked:ring-blue-900",
  okay: "peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:ring-2 peer-checked:ring-amber-200 dark:peer-checked:bg-amber-950/40 dark:peer-checked:ring-amber-900",
  bad: "peer-checked:border-rose-400 peer-checked:bg-rose-50 peer-checked:ring-2 peer-checked:ring-rose-200 dark:peer-checked:bg-rose-950/40 dark:peer-checked:ring-rose-900",
  awful: "peer-checked:border-accent-600 peer-checked:bg-accent-50 peer-checked:ring-2 peer-checked:ring-accent-100 dark:peer-checked:bg-accent-950/40 dark:peer-checked:ring-accent-900",
};

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const inputClasses =
  "rounded-lg border border-brand-200 bg-brand-50/40 px-3 py-2 text-brand-950 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none dark:border-brand-700 dark:bg-brand-900 dark:text-brand-50 dark:focus:ring-brand-900/40";

export function ReflectionForm({ defaultName, onSubmit, onNameChange }: ReflectionFormProps) {
  const [name, setName] = useState(defaultName);
  const [syncedDefaultName, setSyncedDefaultName] = useState(defaultName);
  const [date, setDate] = useState(todayISODate);
  const [whatDidYouDo, setWhatDidYouDo] = useState("");
  const [howDidYouFeel, setHowDidYouFeel] = useState("");
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
    if (!name.trim() || !whatDidYouDo.trim() || !howDidYouFeel.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), date, whatDidYouDo, howDidYouFeel, overallFeeling, notes });
      if (name.trim() !== defaultName) {
        onNameChange(name.trim());
      }
      setWhatDidYouDo("");
      setHowDidYouFeel("");
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
                className={`peer relative flex cursor-pointer items-center justify-center rounded-xl border border-brand-200 bg-brand-50/40 px-2 py-2.5 text-xl transition hover:scale-105 hover:shadow-sm dark:border-brand-700 dark:bg-brand-900 ${FEELING_STYLES[option.value]}`}
              >
                <input
                  type="radio"
                  name="overallFeeling"
                  value={option.value}
                  checked={overallFeeling === option.value}
                  onChange={() => setOverallFeeling(option.value)}
                  className="peer sr-only"
                />
                <span title={option.label}>{option.label.split(" ")[0]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="whatDidYouDo" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          What did you do today?
        </label>
        <textarea
          id="whatDidYouDo"
          value={whatDidYouDo}
          onChange={(e) => setWhatDidYouDo(e.target.value)}
          required
          rows={3}
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="howDidYouFeel" className="text-sm font-medium text-brand-700 dark:text-brand-200">
          How did you feel about it?
        </label>
        <textarea
          id="howDidYouFeel"
          value={howDidYouFeel}
          onChange={(e) => setHowDidYouFeel(e.target.value)}
          required
          rows={3}
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
        {submitting ? "Saving…" : justSaved ? "✅ Saved!" : "Save reflection"}
      </button>
    </form>
  );
}

