export type OverallFeeling = "great" | "good" | "okay" | "bad" | "awful";

export const OVERALL_FEELING_OPTIONS: { value: OverallFeeling; label: string }[] = [
  { value: "great", label: "🤩 Great" },
  { value: "good", label: "🙂 Good" },
  { value: "okay", label: "😐 Okay" },
  { value: "bad", label: "😔 Bad" },
  { value: "awful", label: "😢 Awful" },
];

export interface Reflection {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  whatILearntToday: string;
  howIFeltAboutToday: string;
  oneGoalForTomorrow: string;
  overallFeeling: OverallFeeling;
  notes: string;
  createdAt: number;
}
