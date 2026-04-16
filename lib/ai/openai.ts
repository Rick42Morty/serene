import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const vibeCheckModel = openai(
  process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
);
