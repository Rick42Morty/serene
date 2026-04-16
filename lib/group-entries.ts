import { isToday, isYesterday, isThisWeek, format } from "date-fns";
import type { Entry } from "@/lib/supabase/types";

export type EntryGroup = { label: string; entries: Entry[] };

export function groupEntries(entries: Entry[]): EntryGroup[] {
  const today: Entry[] = [];
  const yesterday: Entry[] = [];
  const thisWeek: Entry[] = [];
  const byMonth = new Map<string, Entry[]>();

  for (const e of entries) {
    const d = new Date(e.created_at);
    if (isToday(d)) today.push(e);
    else if (isYesterday(d)) yesterday.push(e);
    else if (isThisWeek(d, { weekStartsOn: 1 })) thisWeek.push(e);
    else {
      const key = format(d, "MMMM yyyy");
      byMonth.set(key, [...(byMonth.get(key) ?? []), e]);
    }
  }

  const groups: EntryGroup[] = [];
  if (today.length) groups.push({ label: "Today", entries: today });
  if (yesterday.length) groups.push({ label: "Yesterday", entries: yesterday });
  if (thisWeek.length) groups.push({ label: "This week", entries: thisWeek });
  for (const [label, entries_] of byMonth) {
    groups.push({ label, entries: entries_ });
  }
  return groups;
}
