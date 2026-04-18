import { subDays, startOfDay } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { MOODS } from "@/lib/constants/moods";
import { WeeklyMoodChart, type MoodCount } from "@/components/charts/weekly-mood-chart";
import type { Entry } from "@/lib/supabase/types";

export default async function InsightsPage() {
  const supabase = await createClient();
  const since = startOfDay(subDays(new Date(), 7)).toISOString();
  const { data: entries } = await supabase
    .from("entries")
    .select("mood, created_at, tags")
    .gte("created_at", since)
    .returns<Pick<Entry, "mood" | "created_at" | "tags">[]>();

  const counts = new Map<string, number>();
  for (const e of entries ?? []) {
    counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1);
  }

  const data: MoodCount[] = MOODS.map((m) => ({
    mood: m.value,
    label: m.label,
    count: counts.get(m.value) ?? 0,
    color: m.chart,
  }));

  const total = entries?.length ?? 0;
  const topMood = [...data].sort((a, b) => b.count - a.count)[0];

  // Top tags
  const tagCounts = new Map<string, number>();
  for (const e of entries ?? []) {
    for (const t of e.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-tight">
          Your week
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A gentle look at the last seven days.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Entries" value={total.toString()} />
        <Stat
          label="Most common"
          value={total > 0 && topMood ? topMood.label : "—"}
        />
        <Stat
          label="Top context"
          value={topTags[0]?.[0] ?? "—"}
        />
      </section>

      <section className="rounded-3xl border border-border/50 bg-card p-6 sm:p-8">
        <h2 className="font-display text-lg">Mood distribution</h2>
        <p className="mb-5 text-xs text-muted-foreground">Last 7 days</p>
        {total === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No entries yet — check back after a few days of journaling.
          </div>
        ) : (
          <WeeklyMoodChart data={data} />
        )}
      </section>

      {topTags.length > 0 && (
        <section className="rounded-3xl border border-border/50 bg-card p-6 sm:p-8">
          <h2 className="font-display text-lg">Top tags</h2>
          <p className="mb-5 text-xs text-muted-foreground">
            What came up most this week
          </p>
          <ul className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <li
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 text-sm"
              >
                <span className="font-medium">{tag}</span>
                <span className="text-muted-foreground">· {count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-light tracking-tight">
        {value}
      </div>
    </div>
  );
}
