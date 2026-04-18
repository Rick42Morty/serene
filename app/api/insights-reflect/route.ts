import { NextResponse } from "next/server";
import { streamText } from "ai";
import { z } from "zod";
import { vibeCheckModel } from "@/lib/ai/openai";
import {
  INSIGHTS_REFLECT_SYSTEM_PROMPT,
  buildInsightsMessage,
} from "@/lib/ai/prompt";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const moodItemSchema = z.object({
  label: z.string(),
  count: z.number(),
});

const tagItemSchema = z.object({
  tag: z.string(),
  count: z.number(),
});

const requestSchema = z.object({
  total: z.number().int().min(0),
  topMood: z.string(),
  topTag: z.string(),
  moodBreakdown: z.array(moodItemSchema).max(20),
  topTags: z.array(tagItemSchema).max(10),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const result = streamText({
    model: vibeCheckModel,
    system: INSIGHTS_REFLECT_SYSTEM_PROMPT,
    prompt: buildInsightsMessage(parsed.data),
    temperature: 0.7,
    maxOutputTokens: 150,
    onError: ({ error }) => {
      console.error("[insights-reflect] stream error", error);
    },
  });

  const textStream = result.textStream;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of textStream) {
          controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (err) {
        console.error("[insights-reflect] pipe error", err);
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
