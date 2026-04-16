import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MOOD_MAP } from "@/lib/constants/moods";
import type { Entry } from "@/lib/supabase/types";

export function EntryCard({ entry }: { entry: Entry }) {
  const meta = MOOD_MAP[entry.mood];
  const preview =
    entry.note.length > 160 ? entry.note.slice(0, 160).trimEnd() + "…" : entry.note;

  return (
    <Link
      href={`/journal/${entry.id}`}
      className={cn(
        "group block rounded-xl border border-border/70 p-4 transition-all",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        meta.tint,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm"
          aria-hidden
        >
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {meta.label}
            </h3>
            <time className="text-xs text-muted-foreground">
              {format(new Date(entry.created_at), "h:mm a")}
            </time>
          </div>
          {entry.tags.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {entry.tags.join(" · ")}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-foreground/90 line-clamp-3">
            {preview}
          </p>
        </div>
      </div>
    </Link>
  );
}
