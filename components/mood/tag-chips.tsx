"use client";

import { cn } from "@/lib/utils";
import { TAGS } from "@/lib/constants/moods";

export function TagChips({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(tag: string) {
    if (value.includes(tag)) onChange(value.filter((t) => t !== tag));
    else onChange([...value, tag]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => {
        const active = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={active}
            className={cn(
              "min-h-[36px] rounded-full border px-3.5 py-1.5 text-sm cursor-pointer transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted",
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
