"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoodSelector } from "@/components/mood/mood-selector";
import { TagChips } from "@/components/mood/tag-chips";
import { MOOD_MAP } from "@/lib/constants/moods";
import { updateEntry, deleteEntry } from "@/app/(app)/journal/actions";
import type { Entry, Mood } from "@/lib/supabase/types";

export function EntryEditor({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [mood, setMood] = useState<Mood>(entry.mood);
  const [tags, setTags] = useState<string[]>(entry.tags);
  const [note, setNote] = useState(entry.note);
  const [pending, startTransition] = useTransition();

  const NOTE_MIN = 50;
  const noteLen = note.trim().length;
  const noteValid = noteLen >= NOTE_MIN;
  const meta = MOOD_MAP[entry.mood];
  const createdDate = format(new Date(entry.created_at), "PPpp");

  function save() {
    startTransition(async () => {
      const res = await updateEntry(entry.id, { mood, tags, note });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Entry updated.");
      setEditing(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteEntry(entry.id);
    });
  }

  if (!editing) {
    return (
      <div className="space-y-6 pb-24 md:pb-0">
        <div
          className={`rounded-3xl border border-border/50 p-6 sm:p-8 ${meta.tint}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl shadow-sm"
                aria-hidden
              >
                {meta.emoji}
              </div>
              <div>
                <h1 className="font-display text-2xl font-light">{meta.label}</h1>
                <p className="text-xs text-muted-foreground">{createdDate}</p>
              </div>
            </div>
          </div>
          {entry.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/50 bg-white/60 px-3 py-0.5 text-xs text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
            {entry.note}
          </p>
        </div>

        {entry.ai_response && (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Vibe check
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
              {entry.ai_response}
            </p>
          </div>
        )}

        <div className="safe-bottom fixed inset-x-0 bottom-0 flex gap-2 border-t border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md md:static md:inset-auto md:border-0 md:bg-transparent md:p-0">
          <Button
            variant="outline"
            className="flex-1 md:flex-initial rounded-full"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" className="flex-1 md:flex-initial rounded-full" />
              }
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-xl font-light">
                  Delete this entry?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. Your reflection will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={pending} className="rounded-full">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={pending}
                  className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Mood
        </h2>
        <MoodSelector value={mood} onChange={setMood} />
      </section>
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Tags
        </h2>
        <TagChips value={tags} onChange={setTags} />
      </section>
      <section>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="note" className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
            Note
          </Label>
          <span className={`text-xs ${noteValid ? "text-primary" : "text-muted-foreground"}`}>
            {noteLen} / {NOTE_MIN}
          </span>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          className="mt-3 min-h-[140px] rounded-2xl text-base leading-relaxed"
        />
      </section>
      <div className="safe-bottom fixed inset-x-0 bottom-0 flex gap-2 border-t border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md md:static md:inset-auto md:border-0 md:bg-transparent md:p-0">
        <Button
          variant="outline"
          className="flex-1 md:flex-initial rounded-full"
          onClick={() => {
            setEditing(false);
            setMood(entry.mood);
            setTags(entry.tags);
            setNote(entry.note);
          }}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 md:flex-initial rounded-full"
          onClick={save}
          disabled={pending || !noteValid}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
