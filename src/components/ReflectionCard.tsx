// @ts-nocheck
import { useState } from "react";
import { OVERALL_FEELING_OPTIONS, type OverallFeeling, type Reflection } from "../types";
import { copyReflectionForSlack, downloadReflection, mailtoReflection } from "../lib/share";

interface ReflectionCardProps {
  reflection: Reflection;
}

const FEELING_ACCENT: Record<OverallFeeling, string> = {
  great: "border-l-emerald-400",
  good: "border-l-blue-400",
  okay: "border-l-amber-400",
  bad: "border-l-rose-400",
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
      className={`animate-fade-in flex flex-col gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${FEELING_ACCENT[reflection.overallFeeling]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{reflection.date}</h3>
          {reflection.name && (
            <p className="text-xs text-slate-400 dark:text-slate-500">by {reflection.name}</p>
          )}
        </div>
        <span className="text-lg">{feeling?.label}</span>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">What did you do today?</p>
        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">{reflection.whatDidYouDo}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">How did you feel about it?</p>
        <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">{reflection.howDidYouFeel}</p>
      </div>

      {reflection.notes && (
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Notes</p>
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">{reflection.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => downloadReflection(reflection)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ⬇️ Download
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {copied ? "✅ Copied" : "💬 Slack"}
        </button>
        <a
          href={mailtoReflection(reflection)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ✉️ Email
        </a>
      </div>
    </article>
  );
}
