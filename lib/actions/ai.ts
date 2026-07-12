"use server";

import { generateGeminiVision, generateGeminiChat, type ChatTurn } from "@/lib/gemini/client";
import { dressLibrary } from "@/lib/content/dress-library";
import { neckStyles, sleeveStyles } from "@/lib/content/design-library";

export type DressDetectionResult = {
  dressType: string;
  sleeveStyle: string;
  neckStyle: string;
  fabricSuggestion: string;
  matchedDressSlug: string | null;
  matchedNeck: string | null;
  matchedSleeve: string | null;
  raw: string;
};

function findMatch(value: string, options: string[]): string | null {
  const v = value.toLowerCase();
  return options.find((o) => v.includes(o.toLowerCase()) || o.toLowerCase().includes(v)) ?? null;
}

export async function detectDressFromImage(
  imageBase64: string,
  mimeType: string
): Promise<{ error?: string; data?: DressDetectionResult }> {
  const prompt = `You are a tailoring AI analyzing a photo of a dress/garment for an Indian tailoring app. Identify it as one of these known garment types where possible: ${dressLibrary.map((d) => d.name).join(", ")}. Also identify the sleeve style and neckline style. Respond with ONLY raw JSON (no markdown fences, no explanation) in exactly this shape: {"dressType": "...", "sleeveStyle": "...", "neckStyle": "...", "fabricSuggestion": "one short sentence recommending a fabric type for this style"}`;

  const raw = await generateGeminiVision(prompt, imageBase64, mimeType);
  if (!raw) {
    return {
      error:
        "AI Dress Detection needs a GEMINI_API_KEY configured in .env.local. Add one from Google AI Studio and try again.",
    };
  }

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const dressNames = dressLibrary.map((d) => d.name);
    const matchedName = findMatch(parsed.dressType ?? "", dressNames);
    const matchedDress = dressLibrary.find((d) => d.name === matchedName);

    return {
      data: {
        dressType: parsed.dressType ?? "Unknown",
        sleeveStyle: parsed.sleeveStyle ?? "Unknown",
        neckStyle: parsed.neckStyle ?? "Unknown",
        fabricSuggestion: parsed.fabricSuggestion ?? "",
        matchedDressSlug: matchedDress?.slug ?? null,
        matchedNeck: findMatch(parsed.neckStyle ?? "", neckStyles.map((n) => n.name)),
        matchedSleeve: findMatch(parsed.sleeveStyle ?? "", sleeveStyles.map((s) => s.name)),
        raw,
      },
    };
  } catch {
    // Model didn't return clean JSON — still show the raw text rather than failing silently.
    return {
      data: {
        dressType: "See notes",
        sleeveStyle: "",
        neckStyle: "",
        fabricSuggestion: "",
        matchedDressSlug: null,
        matchedNeck: null,
        matchedSleeve: null,
        raw,
      },
    };
  }
}

export async function sendChatMessage(
  history: ChatTurn[]
): Promise<{ error?: string; reply?: string }> {
  const reply = await generateGeminiChat(history);
  if (!reply) {
    return {
      error:
        "The AI Chat Assistant needs a GEMINI_API_KEY configured in .env.local. Add one from Google AI Studio to enable live answers.",
    };
  }
  return { reply };
}
