export type OverallFeeling = "great" | "good" | "okay" | "bad";

export const OVERALL_FEELING_OPTIONS: { value: OverallFeeling; label: string }[] = [
  { value: "great", label: "🤩 Great" },
  { value: "good", label: "🙂 Good" },
  { value: "okay", label: "😐 Okay" },
  { value: "bad", label: "😔 Bad" },
];

export interface Reflection {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  whatDidYouDo: string;
  howDidYouFeel: string;
  overallFeeling: OverallFeeling;
  notes: string;
  createdAt: number;
}
