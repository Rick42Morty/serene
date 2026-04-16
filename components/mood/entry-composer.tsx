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
import { createEntry, saveAiResponse } from "@/app/(app)/journal/actions";
import type { Mood } from "@/lib/supabase/types";

const MIN_NOTE = 50;

export function EntryComposer() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [entryId, setEntryId] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canSave = mood !== null && note.trim().length >= MIN_NOTE;

  function handleSave() {
    if (!mood || !canSave) return;
    startTransition(async () => {
      const res = await createEntry({ mood, tags, note });
      if (res.error || !("id" in res)) {
        toast.error(res.error ?? "Couldn't save your entry.");
        return;
      }
      setEntryId(res.id);
      setSavedNote(note);
      toast.success("Saved to your journal.");
    });
  }

  async function handleAiFinish(text: string) {
    if (!entryId) return;
    await saveAiResponse(entryId, text);
  }

  return (
    <div className="space-y-8 pb-32 md:pb-8">
      <section>
        <h2 className="text-sm font-semibold text-foreground">
          How are you feeling?
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Pick the word that fits best right now — it doesn&apos;t have to be
          perfect.
        </p>
        <MoodSelector value={mood} onChange={setMood} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground">
          What&apos;s going on? <span className="font-normal text-muted-foreground">(optional)</span>
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Add any context that feels relevant.
        </p>
        <TagChips value={tags} onChange={setTags} />
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="note" className="text-sm font-semibold">
            A note to yourself
          </Label>
          <span
            className={`text-xs ${
              note.trim().length >= MIN_NOTE
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {note.trim().length} / {MIN_NOTE}+ chars
          </span>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          placeholder="What's on your mind? A few sentences about today, a worry, a small win — whatever feels true."
          className="mt-2 min-h-[140px] text-base leading-relaxed"
          disabled={entryId !== null}
        />
      </section>

      {entryId && savedNote && mood && (
        <VibeCheckStream
          mood={mood}
          tags={tags}
          note={savedNote}
          onFinish={handleAiFinish}
        />
      )}

      {entryId ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="sm:flex-1"
            onClick={() => router.push("/dashboard")}
          >
            Back to journal
          </Button>
          <Button
            className="sm:flex-1"
            onClick={() => {
              setMood(null);
              setTags([]);
              setNote("");
              setEntryId(null);
              setSavedNote(null);
            }}
          >
            Write another
          </Button>
        </div>
      ) : (
        // Sticky save bar on mobile, inline on desktop
        <>
          <div className="hidden md:block">
            <Button
              onClick={handleSave}
              disabled={!canSave || pending}
              size="lg"
              className="w-full sm:w-auto"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Saving…" : "Save & reflect"}
            </Button>
            {!canSave && (
              <p className="mt-2 text-xs text-muted-foreground">
                Pick a mood and write at least {MIN_NOTE} characters to continue.
              </p>
            )}
          </div>
          <div className="safe-bottom fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
            <Button
              onClick={handleSave}
              disabled={!canSave || pending}
              className="w-full"
              size="lg"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Saving…" : "Save & reflect"}
            </Button>
            {!canSave && (
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                {!mood
                  ? "Pick a mood"
                  : `${MIN_NOTE - note.trim().length} more chars`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
