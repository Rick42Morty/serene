"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoodSelector } from "@/components/mood/mood-selector";
import { TagChips } from "@/components/mood/tag-chips";
import { VibeCheckStream } from "@/components/mood/vibe-check-stream";
import { createEntry } from "@/app/(app)/journal/actions";
import type { Mood } from "@/lib/supabase/types";

const VIBE_CHECK_MIN_NOTE = 50;

type Saved = { id: string; mood: Mood; tags: string[]; note: string };

export function EntryComposer() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<Saved | null>(null);
  const [pending, startTransition] = useTransition();

  const locked = saved !== null;
  const noteLen = note.trim().length;
  const noteValid = noteLen >= VIBE_CHECK_MIN_NOTE;
  const canSave = mood !== null && noteValid && !locked;

  function handleSave() {
    if (!mood || !canSave) return;
    startTransition(async () => {
      const res = await createEntry({ mood, tags, note });
      if (res.error || !("id" in res)) {
        toast.error(res.error ?? "Couldn't save your entry.");
        return;
      }
      setSaved({ id: res.id, mood, tags, note });
      toast.success("Saved to your journal.");
    });
  }

  function reset() {
    setMood(null);
    setTags([]);
    setNote("");
    setSaved(null);
  }

  return (
    <div className={`space-y-8 ${locked ? "md:pb-8" : "pb-32 md:pb-8"}`}>
      <section className={locked ? "pointer-events-none opacity-70" : undefined}>
        <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          How are you feeling?
        </h2>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Pick the word that fits best right now — it doesn&apos;t have to be
          perfect.
        </p>
        <MoodSelector value={mood} onChange={setMood} />
      </section>

      <section className={locked ? "pointer-events-none opacity-70" : undefined}>
        <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          What&apos;s going on? <span className="font-normal">(optional)</span>
        </h2>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Add any context that feels relevant.
        </p>
        <TagChips value={tags} onChange={setTags} />
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="note" className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
            A note to yourself
          </Label>
          {!locked && (
            <span
              className={`text-xs ${
                noteValid ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {noteLen} / {VIBE_CHECK_MIN_NOTE}
            </span>
          )}
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          placeholder="What's on your mind? A few sentences about today, a worry, a small win — whatever feels true."
          className="mt-3 min-h-[140px] rounded-2xl text-base leading-relaxed"
          disabled={locked}
        />
        {!locked && (
          <p className="mt-2 text-xs text-muted-foreground">
            At least {VIBE_CHECK_MIN_NOTE} characters — enough for an AI vibe
            check on your entry.
          </p>
        )}
      </section>

      {saved && saved.note.trim().length >= VIBE_CHECK_MIN_NOTE && (
        <VibeCheckStream
          mood={saved.mood}
          tags={saved.tags}
          note={saved.note}
          entryId={saved.id}
        />
      )}

      {saved ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="sm:flex-1 rounded-full"
            onClick={() => router.push("/dashboard")}
          >
            Back to journal
          </Button>
          <Button className="sm:flex-1 rounded-full" onClick={reset}>
            Write another
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Button
              onClick={handleSave}
              disabled={!canSave || pending}
              size="lg"
              className="w-full sm:w-auto rounded-full"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Saving…" : "Save & reflect"}
            </Button>
            {!canSave && (
              <p className="mt-2 text-xs text-muted-foreground">
                Pick a mood & write your note and write at least {VIBE_CHECK_MIN_NOTE} characters to continue.
              </p>
            )}
          </div>
          <div className="safe-bottom fixed inset-x-0 bottom-0 border-t border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
            <Button
              onClick={handleSave}
              disabled={!canSave || pending}
              className="w-full rounded-full"
              size="lg"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Saving…" : "Save & reflect"}
            </Button>
            {!canSave && (
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                Pick a mood & write your note
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
