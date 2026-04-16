import type { Mood } from "@/lib/supabase/types";

export type MoodMeta = {
  value: Mood;
  label: string;
  emoji: string;
  /** background tint (light) */
  tint: string;
  /** accent border/ring */
  accent: string;
  /** chart color */
  chart: string;
};

export const MOODS: MoodMeta[] = [
  {
    value: "happy",
    label: "Happy",
    emoji: "🌻",
    tint: "bg-amber-50",
    accent: "ring-amber-300",
    chart: "#F5C26B",
  },
  {
    value: "calm",
    label: "Calm",
    emoji: "🌿",
    tint: "bg-emerald-50",
    accent: "ring-emerald-300",
    chart: "#A8C5A0",
  },
  {
    value: "neutral",
    label: "Neutral",
    emoji: "🌾",
    tint: "bg-stone-50",
    accent: "ring-stone-300",
    chart: "#D6CFC4",
  },
  {
    value: "anxious",
    label: "Anxious",
    emoji: "🌊",
    tint: "bg-sky-50",
    accent: "ring-sky-300",
    chart: "#90B8D6",
  },
  {
    value: "overwhelmed",
    label: "Overwhelmed",
    emoji: "🌀",
    tint: "bg-violet-50",
    accent: "ring-violet-300",
    chart: "#C9B8E0",
  },
  {
    value: "sad",
    label: "Sad",
    emoji: "🌧️",
    tint: "bg-indigo-50",
    accent: "ring-indigo-300",
    chart: "#9AA6D0",
  },
  {
    value: "angry",
    label: "Angry",
    emoji: "🔥",
    tint: "bg-rose-50",
    accent: "ring-rose-300",
    chart: "#E29B9B",
  },
];

export const MOOD_MAP: Record<Mood, MoodMeta> = Object.fromEntries(
  MOODS.map((m) => [m.value, m]),
) as Record<Mood, MoodMeta>;

export const TAGS = [
  "Work",
  "Sleep",
  "Relationships",
  "Fitness",
  "Hobbies",
  "Family",
  "Food",
  "Money",
  "Travel",
  "Health",
] as const;

export type Tag = (typeof TAGS)[number];
