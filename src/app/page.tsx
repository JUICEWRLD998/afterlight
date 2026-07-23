import { AiComposePanel } from "@/components/ai-compose-panel"

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf7ef_0%,#f4eddc_100%)] text-stone-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 lg:px-10 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
              Afterlight
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              Letters that arrive when you can’t.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-700">
              One letter tree, rendered as an email, a living page, and a keepsake PDF.
              The AI compose panel is the supporting feature that makes the first draft feel effortless.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_1px_2px_rgba(43,39,35,0.06),0_24px_48px_-24px_rgba(43,39,35,0.32)] backdrop-blur">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">The loop</p>
              <div className="rounded-2xl bg-stone-900 px-4 py-3 text-sm text-stone-50">
                AI writes words → letter body becomes the same Elements source of truth → all three surfaces render.
              </div>
              <p className="text-sm leading-6 text-stone-600">
                If no OpenRouter key is configured, the demo still renders beautifully with a graceful fallback body.
              </p>
            </div>
          </div>
        </div>

        <AiComposePanel />
      </section>
    </main>
  )
}
