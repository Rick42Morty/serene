import Link from "next/link";
import { PenLine } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { EntryCard } from "@/components/mood/entry-card";
import { groupEntries } from "@/lib/group-entries";
import type { Entry } from "@/lib/supabase/types";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Entry[]>();

  const groups = groupEntries(entries ?? []);
  const isEmpty = groups.length === 0;

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your journal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A gentle record of how you&apos;ve been.
          </p>
        </div>
        <Link
          href="/journal/new"
          className={buttonVariants({ className: "hidden md:inline-flex" })}
        >
          <PenLine className="h-4 w-4" />
          New entry
        </Link>
      </header>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {g.label}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {g.entries.map((e) => (
                  <EntryCard key={e.id} entry={e} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Mobile floating-action bar */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/journal/new" className={buttonVariants({ className: "w-full" })}>
          <PenLine className="h-4 w-4" />
          New entry
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
        🌱
      </div>
      <h2 className="mt-4 text-lg font-semibold">Nothing here yet</h2>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
        Your first entry is the hardest. Start with how you feel in this
        moment — just a sentence is enough.
      </p>
      <Link
        href="/journal/new"
        className={buttonVariants({ className: "mt-6" })}
      >
        <PenLine className="h-4 w-4" />
        Write your first entry
      </Link>
    </div>
  );
}
