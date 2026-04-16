"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  mood: string;
  tags: string[];
  note: string;
  onFinish?: (text: string) => void;
};

/**
 * Streams a one-shot vibe check from /api/vibe-check and renders it progressively.
 * Re-fetches whenever the `mood | tags | note` triple changes to a new value.
 */
export function VibeCheckStream({ mood, tags, note, onFinish }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">(
    "idle",
  );
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset and start a new stream for every distinct input.
    if (!mood || !note || note.trim().length < 1) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setText("");
    setStatus("streaming");

    (async () => {
      try {
        const res = await fetch("/api/vibe-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, tags, note }),
          signal: ac.signal,
        });

        if (!res.ok || !res.body) {
          setStatus("error");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          acc += chunk;
          setText(acc);
        }
        setStatus("done");
        onFinish?.(acc.trim());
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setStatus("error");
      }
    })();

    return () => ac.abort();
    // We intentionally ignore onFinish to avoid re-triggering on ref changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, note, tags.join("|")]);

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Vibe check
      </div>
      {status === "streaming" && text === "" ? (
        <div className="space-y-2">
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
