"use client";

import { cn } from "@/lib/utils";
import { MOODS } from "@/lib/constants/moods";
import type { Mood } from "@/lib/supabase/types";

export function MoodSelector({
  value,
  onChange,
}: {
  value: Mood | null;
  onChange: (m: Mood) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
      {MOODS.map((m) => {
        const active = value === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            aria-pressed={active}
            className={cn(
              "group flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border/60 p-3 text-sm font-medium transition-all",
              "hover:border-primary/40 hover:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              m.tint,
              active
                ? `ring-2 ${m.accent} border-transparent shadow-sm`
                : "ring-0",
            )}
          >
            <span className="text-2xl" aria-hidden>
              {m.emoji}
            </span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
