"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Mood } from "@/lib/supabase/types";

const MOOD_VALUES = [
  "happy",
  "calm",
  "neutral",
  "anxious",
  "overwhelmed",
  "sad",
  "angry",
] as const;

const entrySchema = z.object({
  mood: z.enum(MOOD_VALUES),
  tags: z.array(z.string().min(1).max(64)).max(12),
  note: z.string().min(1).max(4000),
});

export type EntryInput = z.infer<typeof entrySchema>;

export async function createEntry(input: EntryInput) {
  const parsed = entrySchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid entry." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data, error } = await supabase
    .from("entries")
    .insert({
      user_id: user.id,
      mood: parsed.data.mood as Mood,
      tags: parsed.data.tags,
      note: parsed.data.note,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/insights");
  return { id: data.id, error: null as string | null };
}

export async function saveAiResponse(id: string, aiResponse: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("entries")
    .update({ ai_response: aiResponse })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/journal/${id}`);
  return { error: null };
}

export async function updateEntry(id: string, input: EntryInput) {
  const parsed = entrySchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid entry." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("entries")
    .update({
      mood: parsed.data.mood as Mood,
      tags: parsed.data.tags,
      note: parsed.data.note,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/journal/${id}`);
  revalidatePath("/insights");
  return { error: null };
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("entries").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/insights");
  redirect("/dashboard");
}
