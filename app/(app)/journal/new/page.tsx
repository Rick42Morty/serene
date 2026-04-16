import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EntryComposer } from "@/components/mood/entry-composer";

export default function NewEntryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to journal
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          New entry
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Take a slow breath. There&apos;s no right way to do this.
        </p>
      </div>
      <EntryComposer />
    </div>
  );
}
