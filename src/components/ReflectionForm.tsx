// @ts-nocheck
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
  great: "peer-checked:border-emerald-400 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-950/40",
  good: "peer-checked:border-blue-400 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-950/40",
  okay: "peer-checked:border-amber-400 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-950/40",
  bad: "peer-checked:border-rose-400 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-950/40",
};

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const inputClasses =
  "rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-900/40";

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
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
          <label htmlFor="date" className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Overall feeling</span>
          <div className="grid grid-cols-4 gap-1.5">
            {OVERALL_FEELING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`peer relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-2 py-2 text-lg transition hover:scale-105 dark:border-slate-600 dark:bg-slate-900 ${FEELING_STYLES[option.value]}`}
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
        <label htmlFor="whatDidYouDo" className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
        <label htmlFor="howDidYouFeel" className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
        <label htmlFor="notes" className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
        className="mt-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : justSaved ? "✅ Saved!" : "Save reflection"}
      </button>
    </form>
  );
}

