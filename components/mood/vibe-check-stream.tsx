"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  mood: string;
  tags: string[];
  note: string;
  entryId?: string;
};

export function VibeCheckStream({ mood, tags, note, entryId }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "waiting" | "streaming" | "done" | "error"
  >("waiting");
  const abortRef = useRef<AbortController | null>(null);
  const tagsKey = tags.join("|");

  useEffect(() => {
    if (!mood || !note || note.trim().length < 1) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setText("");
    setStatus("waiting");

    (async () => {
      try {
        const res = await fetch("/api/vibe-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, tags, note, entryId }),
          signal: ac.signal,
        });

        if (!res.ok || !res.body) {
          setStatus("error");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        let started = false;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          acc += chunk;
          if (!started && acc.length > 0) {
            started = true;
            setStatus("streaming");
          }
          setText(acc);
        }
        setStatus("done");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setStatus("error");
      }
    })();

    return () => ac.abort();
    // tagsKey is the stable derivation of `tags`; tags itself is a new array each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, note, tagsKey, entryId]);

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Vibe check
      </div>
      {status === "waiting" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Reflecting on your entry…
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      ) : status === "error" ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t fetch a reflection right now — your entry is still saved.
        </p>
      ) : (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {text}
          {status === "streaming" && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary/70"
            />
          )}
        </p>
      )}
    </div>
  );
}
