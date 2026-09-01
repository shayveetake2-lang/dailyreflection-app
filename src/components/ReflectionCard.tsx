import { useState } from "react";
import { OVERALL_FEELING_OPTIONS, type OverallFeeling, type Reflection } from "../types";
import { copyReflectionForSlack, downloadReflection, mailtoReflection } from "../lib/share";

interface ReflectionCardProps {
  reflection: Reflection;
}

const FEELING_ACCENT: Record<OverallFeeling, string> = {
  great: "border-l-emerald-400",
  good: "border-l-brand-400",
  okay: "border-l-amber-400",
  bad: "border-l-accent-600",
};

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  const [copied, setCopied] = useState(false);
  const feeling = OVERALL_FEELING_OPTIONS.find((o) => o.value === reflection.overallFeeling);

  const handleCopy = async () => {
    await copyReflectionForSlack(reflection);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={`animate-fade-in flex flex-col gap-3 rounded-2xl border border-l-4 border-brand-100 bg-white/80 p-5 shadow-md shadow-brand-900/5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-brand-800 dark:bg-brand-900/80 ${FEELING_ACCENT[reflection.overallFeeling]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-brand-950 dark:text-brand-50">{reflection.date}</h3>
          {reflection.name && (
            <p className="text-xs text-brand-400 dark:text-brand-400">by {reflection.name}</p>
          )}
        </div>
        <span className="text-lg">{feeling?.label}</span>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-300">What did you do today?</p>
        <p className="whitespace-pre-wrap text-brand-900 dark:text-brand-100">{reflection.whatDidYouDo}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-300">How did you feel about it?</p>
        <p className="whitespace-pre-wrap text-brand-900 dark:text-brand-100">{reflection.howDidYouFeel}</p>
      </div>

      {reflection.notes && (
        <div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-300">Notes</p>
          <p className="whitespace-pre-wrap text-brand-900 dark:text-brand-100">{reflection.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => downloadReflection(reflection)}
          className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-800"
        >
          ⬇️ Download
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-800"
        >
          {copied ? "✅ Copied" : "💬 Slack"}
        </button>
        <a
          href={mailtoReflection(reflection)}
          className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:scale-105 hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-800"
        >
          ✉️ Email
        </a>
      </div>
    </article>
  );
}
