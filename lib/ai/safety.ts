const TRIGGER_PATTERNS = [
  /\b(suicide|suicidal|kill\s+myself|end\s+(my\s+)?life|want\s+to\s+die)\b/i,
  /\b(self[\s-]?harm|hurt\s+myself|cut\s+myself)\b/i,
  /\b(overdose|od\b)/i,
];

export const CRISIS_DISCLAIMER =
  "\n\nIf you're in crisis or thinking about harming yourself, please reach out to a trained human now — in the US & Canada call or text 988, in the UK call 111, or visit findahelpline.com for international lines.";

export type SafetyCheck =
  | { kind: "ok" }
  | { kind: "empty"; message: string }
  | { kind: "gibberish"; message: string }
  | { kind: "sensitive"; shouldAppendDisclaimer: true };

export function runSafetyChecks(note: string): SafetyCheck {
  const trimmed = note.trim();

  if (trimmed.length < 10) {
    return {
      kind: "empty",
      message:
        "Share a few more words about how this moment feels, and Serene will reflect back.",
    };
  }

  if (isGibberish(trimmed)) {
    return {
      kind: "gibberish",
      message:
        "It looks like your note got a little jumbled — try writing a sentence or two about what's on your mind.",
    };
  }

  if (TRIGGER_PATTERNS.some((re) => re.test(trimmed))) {
    return { kind: "sensitive", shouldAppendDisclaimer: true };
  }

  return { kind: "ok" };
}

function isGibberish(text: string): boolean {
  const lower = text.toLowerCase();
  const letters = lower.replace(/[^a-z]/g, "");
  if (letters.length < 6) return true;

  const vowels = letters.match(/[aeiouy]/g)?.length ?? 0;
  const vowelRatio = vowels / letters.length;
  if (vowelRatio < 0.15 || vowelRatio > 0.85) return true;

  // long run of identical characters
  if (/(.)\1{5,}/.test(lower)) return true;

  // no spaces at all but very long = likely mashed keys
  if (!/\s/.test(lower) && lower.length > 60) return true;

  return false;
}
