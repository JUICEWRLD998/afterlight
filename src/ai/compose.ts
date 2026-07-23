/**
 * AI compose — the supporting feature.
 *
 * Given a few details about a letter (recipient, occasion, memories, tone),
 * drafts the letter *prose* via OpenRouter → Gemini 2.5 Flash and returns it as
 * HTML suitable for `LetterData.body`. Everything downstream is unchanged: the
 * AI only produces the words; Elements still renders them to email/web/PDF.
 *
 * Key is env-only (OPENROUTER_API_KEY). With no key, compose is disabled and a
 * graceful fallback body is returned instead — the project still runs end-to-end.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = "google/gemini-2.5-flash"

export interface ComposeInput {
  recipient: string          // "my daughter Amara"
  occasion: string           // "her 18th birthday"
  memories?: string          // free text: a memory or two to weave in
  tone?: string              // "warm", "playful", "reverent" — defaults to warm
}

export interface ComposeResult {
  body: string               // HTML for LetterData.body (paragraphs joined by <br/><br/>)
  source: "ai" | "fallback"  // whether the model produced it or we fell back
  model?: string             // the model used, when source === "ai"
  reason?: string            // why we fell back, when source === "fallback"
}

/** True when an OpenRouter key is present in the environment. */
export function isComposeEnabled(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim())
}

function buildPrompt(input: ComposeInput): string {
  const tone = input.tone?.trim() || "warm, sincere, and unsentimental"
  const memories = input.memories?.trim()
  return [
    `Write a short, deeply personal letter to ${input.recipient}, for ${input.occasion}.`,
    memories ? `Weave in these details naturally, without listing them: ${memories}` : null,
    `Tone: ${tone}. Restraint over sentimentality — real, not greeting-card.`,
    `3 to 5 short paragraphs. No salutation line (no "Dear ...") and no sign-off (no "Love, ...") — those are added separately.`,
    `Output ONLY the letter body as plain paragraphs separated by a single blank line. No markdown, no headings, no quotation marks around the whole thing.`,
  ]
    .filter(Boolean)
    .join("\n")
}

/** Turn model plain-text paragraphs into the <br/><br/>-joined HTML the letters use. */
function toBodyHtml(text: string): string {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)                        // paragraph breaks
    .map(p => p.replace(/\s*\n\s*/g, " ").trim())  // collapse soft wraps within a paragraph
    .filter(Boolean)

  // The salutation and sign-off are rendered separately by the letter tree, so
  // strip them if the model added them despite the prompt (avoids a duplicate
  // greeting / "Love, ..." in the body).
  const isSalutation = (p: string) =>
    p.length < 40 && /^(dear\b|hi\b|hello\b|hey\b|my dearest\b|dearest\b)/i.test(p) || /^[\w' ]{1,30},$/.test(p)
  const isSignoff = (p: string) =>
    p.length < 40 && /^(love,|with love,|yours,|always,|forever,|xoxo|love always)/i.test(p)

  if (paragraphs.length > 1 && isSalutation(paragraphs[0])) paragraphs.shift()
  if (paragraphs.length > 1 && isSignoff(paragraphs[paragraphs.length - 1])) paragraphs.pop()

  return paragraphs.join("<br/><br/>\n")
}

function fallbackBody(input: ComposeInput, reason: string): ComposeResult {
  const body = [
    `I've been trying to find the words for ${input.occasion}, and the truth is there are too many.`,
    `So let me just say the simple thing: I am thinking of you, ${input.recipient}. Today and always.`,
    `Whatever this day brings, know that you are loved — completely, and without condition.`,
  ].join("<br/><br/>\n")
  return { body, source: "fallback", reason }
}

/**
 * Draft a letter body. Never throws — on any failure (no key, network, bad
 * response) it returns a graceful fallback body so the pipeline keeps working.
 */
export async function composeLetterBody(input: ComposeInput): Promise<ComposeResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) {
    return fallbackBody(input, "OPENROUTER_API_KEY not set — AI compose disabled")
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a gifted letter writer helping someone say what they mean. You write with warmth and restraint. You never use clichés or greeting-card language.",
          },
          { role: "user", content: buildPrompt(input) },
        ],
        temperature: 0.8,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      return fallbackBody(input, `OpenRouter HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`)
    }

    const data = await res.json()
    const text: unknown = data?.choices?.[0]?.message?.content
    if (typeof text !== "string" || !text.trim()) {
      return fallbackBody(input, "OpenRouter returned no letter text")
    }

    return { body: toBodyHtml(text), source: "ai", model }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return fallbackBody(input, `compose failed: ${reason}`)
  }
}
