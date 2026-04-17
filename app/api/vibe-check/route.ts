import { NextResponse } from "next/server";
import { streamText } from "ai";
import { z } from "zod";
import { vibeCheckModel } from "@/lib/ai/openai";
import { VIBE_CHECK_SYSTEM_PROMPT, buildUserMessage } from "@/lib/ai/prompt";
import { runSafetyChecks, CRISIS_DISCLAIMER } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const requestSchema = z.object({
  mood: z.string().min(1).max(32),
  tags: z.array(z.string().min(1).max(64)).max(12),
  note: z.string().min(1).max(4000),
  entryId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { mood, tags, note, entryId } = parsed.data;
  const safety = runSafetyChecks(note);

  if (safety.kind === "empty" || safety.kind === "gibberish") {
    return new Response(safety.message, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const result = streamText({
    model: vibeCheckModel,
    system: VIBE_CHECK_SYSTEM_PROMPT,
    prompt: buildUserMessage({ mood, tags, note }),
    temperature: 0.7,
    maxOutputTokens: 120,
    onError: ({ error }) => {
      console.error("[vibe-check] stream error", error);
    },
  });

  const textStream = result.textStream;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let acc = "";
        for await (const delta of textStream) {
          acc += delta;
          controller.enqueue(encoder.encode(delta));
        }
        if (safety.kind === "sensitive") {
          acc += CRISIS_DISCLAIMER;
          controller.enqueue(encoder.encode(CRISIS_DISCLAIMER));
        }
        controller.close();

        if (entryId && acc.trim().length > 0) {
          const { error } = await supabase
            .from("entries")
            .update({ ai_response: acc.trim() })
            .eq("id", entryId)
            .eq("user_id", user.id);
          if (error) console.error("[vibe-check] persist error", error);
        }
      } catch (err) {
        console.error("[vibe-check] pipe error", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
