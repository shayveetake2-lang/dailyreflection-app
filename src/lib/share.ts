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
    "What I learnt today",
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
  await navigator.clipboard.writeText(formatReflection(reflection));
}

export function mailtoReflection(reflection: Reflection): string {
  const subject = encodeURIComponent(`Daily Reflection — ${formatReflectionDate(reflection.date)}`);
  const body = encodeURIComponent(formatReflection(reflection));
  return `mailto:?subject=${subject}&body=${body}`;
}
