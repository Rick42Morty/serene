import { EntryComposer } from "@/components/mood/entry-composer";

export default function NewEntryPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl md:text-5xl font-light leading-tight">
          How are you?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Take a slow breath. There&apos;s no right way to do this.
        </p>
      </header>
      <EntryComposer />
    </div>
  );
}
