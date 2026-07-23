"use client"

import { useState } from "react"
import letterData from "@/letters/data/to-my-daughter"

type ComposeResponse = {
  body: string
  source: "ai" | "fallback"
  model?: string
  reason?: string
  enabled?: boolean
}

const initialForm = {
  recipient: "my daughter Amara",
  occasion: "her 18th birthday",
  memories: "teaching her to ride a bike; she never gave up even when she fell",
  tone: "warm and proud, a little bittersweet",
}

export function AiComposePanel() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ComposeResponse | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const result = await fetch("/api/compose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const payload = (await result.json()) as ComposeResponse
      setResponse(payload)
    } finally {
      setLoading(false)
    }
  }

  const previewBody = response?.body ?? letterData.body
  const statusTone = response?.source === "ai" ? "text-emerald-700" : "text-amber-700"
  const statusText = response?.source === "ai"
    ? `Drafted with ${response.model ?? "AI"}`
    : response?.reason ?? "No OpenRouter key configured — graceful fallback is active"

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-sm backdrop-blur"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Compose with AI
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-900">
              Draft the letter in one minute
            </h2>
          </div>
          <div className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
            secondary feature
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-sm text-stone-700">
            Recipient
            <input
              value={form.recipient}
              onChange={(event) => setForm((current) => ({ ...current, recipient: event.target.value }))}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 outline-none ring-0 transition focus:border-stone-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-stone-700">
            Occasion
            <input
              value={form.occasion}
              onChange={(event) => setForm((current) => ({ ...current, occasion: event.target.value }))}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 outline-none ring-0 transition focus:border-stone-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-stone-700">
            Memory or detail
            <textarea
              value={form.memories}
              onChange={(event) => setForm((current) => ({ ...current, memories: event.target.value }))}
              rows={3}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 outline-none transition focus:border-stone-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-stone-700">
            Tone
            <input
              value={form.tone}
              onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))}
              className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 outline-none transition focus:border-stone-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Drafting…" : "Draft with AI"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-stone-200 bg-[#fbf7ef] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Letter preview
            </p>
            <h3 className="mt-1 text-xl font-semibold text-stone-900">
              {letterData.occasion}
            </h3>
          </div>
          <span className={`text-xs font-medium ${statusTone}`}>{statusText}</span>
        </div>

        <div className="rounded-[2px] bg-[#fbf7ef] p-7 shadow-[0_1px_2px_rgba(43,39,35,0.06),0_24px_48px_-24px_rgba(43,39,35,0.32)]">
          <p className="mb-6 text-[11px] uppercase tracking-[0.24em] text-stone-500">
            {letterData.salutation}
          </p>
          <div
            className="space-y-4 text-[19px] leading-8 text-stone-800"
            dangerouslySetInnerHTML={{ __html: previewBody }}
          />
          <div className="mt-6 border-t border-amber-300/70 pt-4 text-sm text-stone-600">
            With love,<br />
            <span className="font-serif text-3xl text-stone-900">{letterData.from}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
