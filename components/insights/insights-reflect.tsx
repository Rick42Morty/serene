"use client";

import { useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type MoodItem = { label: string; count: number };
type TagItem = { tag: string; count: number };

type Props = {
  total: number;
  topMood: string;
  topTag: string;
  moodBreakdown: MoodItem[];
  topTags: TagItem[];
};

export function InsightsReflect({
  total,
  topMood,
  topTag,
  moodBreakdown,
  topTags,
}: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "waiting" | "streaming" | "done" | "error"
  >("idle");
  const abortRef = useRef<AbortController | null>(null);

  async function handleClick() {
    if (status === "waiting" || status === "streaming") return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setText("");
    setStatus("waiting");

    try {
      const res = await fetch("/api/insights-reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total, topMood, topTag, moodBreakdown, topTags }),
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
  }

  if (status === "idle") {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Reflect with AI
      </button>
    );
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        AI Reflection
      </div>
      {status === "waiting" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Reflecting on your week...
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      ) : status === "error" ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t fetch a reflection right now — try again in a moment.
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
