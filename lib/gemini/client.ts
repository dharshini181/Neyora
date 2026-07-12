/**
 * Minimal Gemini API wrapper (server-only — never import from a client component).
 * Model is configurable via GEMINI_MODEL since Google ships new model names
 * frequently; defaults to a current, cost-effective flash model.
 *
 * Returns null (never throws) when no API key is set or the request fails,
 * so callers can fall back to the static/rule-based content instead.
 */
/**
 * Multimodal variant — sends an inline base64 image alongside a text prompt.
 * Used by AI Dress Detection. Same graceful-null-on-failure contract as
 * generateGeminiText.
 */
export async function generateGeminiVision(
  prompt: string,
  imageBase64: string,
  mimeType: string
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: imageBase64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch {
    return null;
  }
}

export type ChatTurn = { role: "user" | "model"; text: string };

const SYSTEM_CONTEXT =
  "You are the Neyora AI Assistant, built into a tailoring business app used by Indian tailors, boutique owners, and fashion design students. " +
  "Answer questions about stitching techniques, garment construction, fabric requirements, and measurements clearly and practically. " +
  "Keep answers concise (under 150 words) and use plain text, no markdown headers. When a question needs exact numbers you don't have (like a specific customer's measurements), give a typical range and say it depends on the actual measurements.";

/** Multi-turn chat — send the full prior history plus the newest user message. */
export async function generateGeminiChat(history: ChatTurn[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_CONTEXT }] },
        contents: history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch {
    return null;
  }
}

export async function generateGeminiText(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
      }),
      // Keep this call snappy — fall back to static content rather than hang the page.
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch {
    return null;
  }
}
