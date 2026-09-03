import { OVERALL_FEELING_OPTIONS, type Reflection } from "../types";
import { formatReflectionDate } from "./date";

function feelingLabel(reflection: Reflection) {
  return OVERALL_FEELING_OPTIONS.find((o) => o.value === reflection.overallFeeling)?.label ?? reflection.overallFeeling;
}

export function formatReflection(reflection: Reflection): string {
  const formattedDate = formatReflectionDate(reflection.date);
  return [
    `Daily Reflection — ${formattedDate}`,
    ...(reflection.name ? [`By: ${reflection.name}`] : []),
    `Overall feeling: ${feelingLabel(reflection)}`,
    "",
    "What did I learn today?",
    reflection.whatILearntToday,
    "",
    "How I felt about today",
    reflection.howIFeltAboutToday,
    ...(reflection.oneGoalForTomorrow ? ["", "One goal for tomorrow", reflection.oneGoalForTomorrow] : []),
    ...(reflection.notes ? ["", "Notes", reflection.notes] : []),
  ].join("\n");
}

export function downloadReflection(reflection: Reflection) {
  const blob = new Blob([formatReflection(reflection)], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reflection-${formatReflectionDate(reflection.date).replaceAll("/", "-")}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function copyReflectionForSlack(reflection: Reflection) {
  const text = formatReflection(reflection);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Could not copy reflection to the clipboard.");
  }
}

export function mailtoReflection(reflection: Reflection): string {
  const subject = encodeURIComponent(`Daily Reflection — ${formatReflectionDate(reflection.date)}`);
  const body = encodeURIComponent(formatReflection(reflection));
  return `mailto:?subject=${subject}&body=${body}`;
}
