"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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
          className={`rounded-2xl border border-border/70 p-5 sm:p-6 ${meta.tint}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm"
                aria-hidden
              >
                {meta.emoji}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{meta.label}</h1>
                <p className="text-xs text-muted-foreground">{createdDate}</p>
              </div>
            </div>
          </div>
          {entry.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 bg-white/60 px-2.5 py-0.5 text-xs text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
            {entry.note}
          </p>
        </div>

        {entry.ai_response && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
              Vibe check
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
              {entry.ai_response}
            </p>
          </div>
        )}

        <div className="safe-bottom fixed inset-x-0 bottom-0 flex gap-2 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur md:static md:inset-auto md:border-0 md:bg-transparent md:p-0">
          <Button
            variant="outline"
            className="flex-1 md:flex-initial"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" className="flex-1 md:flex-initial" />
              }
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. Your reflection will be permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={pending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
    <div className="space-y-6 pb-24 md:pb-0">
      <section>
        <h2 className="mb-2 text-sm font-semibold">Mood</h2>
        <MoodSelector value={mood} onChange={setMood} />
      </section>
      <section>
        <h2 className="mb-2 text-sm font-semibold">Tags</h2>
        <TagChips value={tags} onChange={setTags} />
      </section>
      <section>
        <Label htmlFor="note" className="text-sm font-semibold">
          Note
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          className="mt-2 min-h-[140px] text-base leading-relaxed"
        />
      </section>
      <div className="safe-bottom fixed inset-x-0 bottom-0 flex gap-2 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur md:static md:inset-auto md:border-0 md:bg-transparent md:p-0">
        <Button
          variant="outline"
          className="flex-1 md:flex-initial"
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
          className="flex-1 md:flex-initial"
          onClick={save}
          disabled={pending || note.trim().length < 1}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
