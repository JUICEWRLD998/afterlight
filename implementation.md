# Afterlight — Implementation Plan

> **Letters that arrive when you can't.**
> One Elements component tree → a scheduled **email**, a living **web page**, and a print-quality **PDF keepsake**. Authored once. Delivered to the future.

**Hackathon:** Unlayer "Build with Elements" Challenge · Deadline **July 31, 2026** · 3 winners × $200
**Goal:** First place. Optimize for *originality, design quality, practical value, effective use of Elements, execution*.

---

## 1. The Concept

Afterlight is a template + tiny toolkit for **time-delayed letters** — messages written now, to be delivered on a future date or occasion:

- To my daughter, on her 18th birthday.
- Open when you're sad. / Open when you miss me.
- A grandmother's recipe, in her own words.
- And the emotional core: a message meant to arrive **after the writer is gone.**

"Afterlight" is the glow that remains after the source is gone. Every letter is written once as a single React/Elements tree and rendered to **three surfaces from that one source of truth**:

| Surface | Elements wrapper | Real-world role |
|---|---|---|
| **Email** | `<Email>` (table HTML) | The message that lands in the inbox on the delivery date |
| **Web** | `<Page>` (responsive) | A permanent, shareable letter page the family revisits |
| **PDF** | `<Document>` (print) | A framed keepsake / memory-box print |

This tri-modal property is Elements' actual superpower and the thing **almost no other submission will exploit** — most entries use exactly one render mode. Afterlight uses all three, plus two advanced APIs (below).

---

## 2. Why This Wins (criteria → move)

| Judging criterion | The move that dominates it |
|---|---|
| **Originality** | A posthumous / to-the-future letter engine. Not a newsletter, not an invoice. Unseen category. |
| **Effective use of Elements** | All three render modes from ONE tree + `registerElementsTool()` custom component + `renderToJson()` round-trip. Deeper than any single-template entry. |
| **Design quality** | Letterpress + candlelight aesthetic. Cream paper, serif body, gold foil, a real wax seal. Museum-grade, not SaaS-blue. |
| **Practical value** | Digital legacy is a genuine, growing market. Shippable, not a toy. |
| **Execution** | Next.js gallery (3 outputs side-by-side), a delivery CLI, committed generated artifacts, and a README that makes judges *feel* it. |

### The two moves no other team will make
1. **Custom Elements component** via `registerElementsTool()` — a typed, reusable `<WaxSeal>` (and `<Signature>`). Proves mastery of the advanced API and gives Afterlight a signature identity.
2. **`renderToJson()` round-trip as narrative** — the letter is authored in code but exports to Unlayer's visual drag-and-drop editor, so **a grieving family member who can't code can still edit their loved one's letter.** Code-authored, human-editable. The most emotionally perfect possible use of the JSON round-trip.

### AI — the supporting feature (not the headline)
A **"Compose with AI"** step helps people who don't know what to write. You give a few details (recipient, occasion, a memory or two, tone) and the model drafts the letter prose. It slots cleanly into the pipeline: **AI writes words → fills `LetterData.body` → the exact same Elements tree renders it to email + web + PDF.** Nothing downstream changes; Elements remains the engine and the headline.

- **Provider:** OpenRouter · **Model:** `google/gemini-2.5-flash` (fast/cheap for drafting; can swap to `gemini-2.5-pro` for quality).
- **Positioning:** deliberately secondary in the demo and README — it must not compete with the tri-modal Elements story for the judges' attention. Elements does all rendering; AI only produces the text Elements renders.
- **Cost/safety:** API key via env only (never committed); graceful fallback so the whole project runs *without* a key (AI compose simply disabled, example letters still render).

---

## 3. Design System — "Candlelight Letterpress"

> Think like a world-class designer: restraint, warmth, and one memorable signature element. The feeling is *a hand-written letter found in a wooden drawer* — not an app. Every choice below is deliberate; do not add UI chrome that breaks the illusion of paper.

### 3.1 Design principles
1. **Paper first.** The letter always looks like a physical object — soft shadow, warm off-white stock, generous margins. The UI recedes; the letter is the hero.
2. **One signature element.** The **wax seal** is the icon of the whole project — it appears in the favicon, the loading state, the seal on the letter, and the GIF. Repetition of one strong motif reads as intentional design, not decoration.
3. **Warmth over contrast.** No pure black, no pure white. Ink on cream. Light that glows rather than shines.
4. **Editorial typography.** Treat the letter like a printed book page: measured line length (~60–68 chars), real leading, no cramped defaults.
5. **Emotion through pacing, not clutter.** Whitespace and a slow reveal carry the feeling. Resist gradients, badges, and "dashboard" energy.

### 3.2 Color tokens
| Token | Hex | Use |
|---|---|---|
| `paper` | `#FBF7EF` | Letter background / page canvas |
| `paper-deep` | `#F3ECDE` | Secondary paper, envelope interior |
| `ink` | `#2B2723` | Primary text (warm near-black) |
| `ink-soft` | `#5B534A` | Secondary text, metadata |
| `gold` | `#C9A24B` | Foil accents, rules, the "afterlight" glow |
| `gold-soft` | `#E9D8A6` | Highlight wash, hover |
| `wax` | `#8C2F2A` | Wax seal, the single accent of true color |
| `wax-deep` | `#6E211D` | Seal shadow/edge |
| `sage` | `#7C8471` | Rare tertiary accent (botanical), optional |
| `night` | `#1C1A17` | Dark "afterlight" background for the demo hero |

**Rule:** `wax` is the *only* saturated color and appears once per view (the seal). Gold does the rest of the accent work.

### 3.3 Typography
- **Display / headings:** **Fraunces** (variable serif, "wonky" optical settings on) — soft, literary, emotional. Weights 400–600.
- **Letter body:** **Fraunces** 400 at generous size, OR **Cormorant Garamond** for an even more intimate, hand-set feel. Pick one during Phase 2 by eye.
- **Signature:** a script face — **"Ephesis"** or **"Homemade Apple"** (Google Fonts) — used *only* for the sign-off name, sized large.
- **UI / metadata:** **Inter** or **Instrument Sans**, small, `ink-soft`, letter-spaced. The UI whispers.
- **Scale (major third, 1.25):** 12.8 / 16 / 20 / 25 / 31 / 39 / 49 px. Body copy 18–20px, line-height 1.7.
- **Measure:** letter body max-width ~34rem so lines stay book-length.

> Email note: web fonts are unreliable in email clients. In `<Email>` mode, specify Fraunces/Cormorant with **robust serif fallbacks** (`Georgia, 'Times New Roman', serif`). The keepsake/web can load the real fonts; the email degrades gracefully.

### 3.4 Spacing & form
- 8px base grid. Section rhythm 32 / 48 / 64.
- Letter card: 48–64px internal padding, `border-radius: 2px` (paper, not app), layered warm shadow (`0 1px 2px rgba(43,39,35,.06), 0 24px 48px -24px rgba(43,39,35,.25)`).
- Subtle **paper grain**: a tiled SVG/noise overlay at ~3% opacity on the letter surface (web + PDF only; omit in email).
- A thin **gold hairline rule** (1px, `gold` at 60%) separates the salutation, body, and sign-off.

### 3.5 The signature element — Wax Seal
- A circular seal in `wax`/`wax-deep` with a subtle radial highlight (top-left) for a waxy sheen, a pressed monogram or a small flame/lantern glyph embossed in the center.
- On web: gentle `box-shadow` + a barely-there entrance animation (settle + tiny rotate) as if just pressed.
- On PDF/email: static, high-quality — rendered as inline SVG so it prints crisp.
- Built as a real Elements component (`registerElementsTool`) so it's reusable and typed.

### 3.6 Motion (web/demo only — never in email/PDF)
- **Letter reveal:** on load, the letter fades up 12px over 700ms `cubic-bezier(.2,.7,.2,1)`; the seal presses in ~150ms later. Slow, reverent.
- **Tri-modal morph (the money GIF):** the same letter visually transitions between an inbox frame → a browser frame → a printed sheet. This is the hero asset for the README.
- Respect `prefers-reduced-motion`: disable all of the above.

---

## 4. Technical Architecture

```
afterlight/
├── implementation.md            ← this file
├── README.md                    ← emotional hero + technical depth + run steps + GIF
├── package.json
├── pnpm-workspace / single app  ← decide Phase 0 (single Next.js app is simplest)
├── src/
│   ├── elements/
│   │   ├── Letter.tsx            ← THE single mode-agnostic tree (the whole product)
│   │   ├── WaxSeal.tsx           ← custom element via registerElementsTool()
│   │   ├── Signature.tsx         ← script sign-off (custom element)
│   │   └── theme.ts             ← the color/type tokens above, one source of truth
│   ├── letters/
│   │   ├── types.ts             ← LetterData interface (data-driven)
│   │   └── data/
│   │       ├── to-my-daughter.ts
│   │       ├── open-when-sad.ts
│   │       └── grandmothers-recipe.ts
│   ├── ai/
│   │   └── compose.ts           ← OpenRouter → Gemini 2.5 draft → LetterData.body (optional)
│   └── render.ts                ← renderEmail / renderPage / renderPdf / renderJson
├── scripts/
│   ├── build-letters.ts         ← writes out/ artifacts for every letter
│   └── deliver.ts               ← CLI demo: "delivers" on a date (email+page+pdf)
├── app/  (Next.js App Router)
│   ├── page.tsx                 ← landing: concept + gallery of letters
│   ├── letter/[slug]/page.tsx   ← a single letter rendered as <Page>
│   └── compare/[slug]/page.tsx  ← 3-up: email | web | pdf side-by-side (demo star)
├── out/                         ← committed: <slug>.email.html, .page.html, .pdf, .json
└── assets/                      ← screenshots + afterlight-morph.gif (README hero)
```

### 4.1 The single source of truth — `Letter.tsx`
`Letter` takes `LetterData` and renders the **same tree** regardless of surface. The root wrapper is chosen by the renderer, not hard-coded:

```tsx
// pseudo — verify exact Elements API against @unlayer/react-elements during Phase 1
function LetterBody({ data }: { data: LetterData }) {
  return (
    <>
      <Row layout={ColumnLayouts.OneColumn} padding="48px">
        <Column>
          <Heading fontSize="31px">{data.salutation}</Heading>
          <Divider /* gold hairline */ />
          <Paragraph html={data.body} fontSize="19px" />
          <Signature name={data.from} />
          <WaxSeal monogram={data.sealMonogram} />
        </Column>
      </Row>
    </>
  )
}
```

### 4.2 The renderer — `render.ts`
```ts
renderEmail(data) → renderToHtml(<Email>…</Email>)      // table HTML, robust fonts
renderPage(data)  → renderToHtml(<Page>…</Page>)        // responsive web
renderPdf(data)   → renderToHtml(<Document>…</Document>)// print HTML → PDF via Playwright/puppeteer
renderJson(data)  → renderToJson(<Email>…</Email>)      // → Unlayer visual editor
```
- PDF: pipe the `<Document>` HTML through **Playwright** `page.pdf()` (A5 or letter, print CSS). Commit the resulting `.pdf` to `out/`.
- Keep `renderText(data) → renderToPlainText(...)` for the multipart email (accessibility + deliverability).

### 4.3 `LetterData` (data-driven, so it scales beyond one hard-coded letter)
```ts
interface LetterData {
  slug: string
  occasion: string          // "On your 18th birthday"
  salutation: string        // "My dearest Amara,"
  body: string              // HTML — the letter itself
  from: string              // "Dad"
  sealMonogram: string      // "A" or a glyph
  deliverOn: string         // ISO date — when it should arrive
  recipientEmail?: string
  photo?: { src: string; caption?: string }
  accent?: 'gold' | 'sage'
}
```

### 4.4 Elements API checklist (verify first thing in Phase 1)
Confirm exact names/props from `@unlayer/react-elements` before writing components:
- Root wrappers: `Email`, `Page`, `Document` (props: `backgroundColor`, `contentWidth`, …).
- `Row` (`layout`, `cells`, `padding`, `backgroundColor`), `Column`, `ColumnLayouts.*`.
- Content: `Heading`, `Paragraph` (`html`), `Button`, `Image`, `Divider`, `Social`, `Html`.
- Renderers: `renderToHtml`, `renderToHtmlParts`, `renderToJson`, `renderToPlainText`.
- Custom: `registerElementsTool(...)` signature + return type (this powers `WaxSeal`/`Signature`).
- If a prop we want (e.g. gold hairline divider, grain) isn't supported, fall back to the `<Html>` passthrough element.

---

## 5. Implementation Phases

> Review gate: **you approve this file before Phase 1 starts.** Each phase ends with a visible, checkable result.

### Phase 0 — Scaffold (foundation)
- [ ] `create-next-app` (TypeScript, App Router) in place; confirm it runs.
- [ ] `npm i @unlayer/react-elements`; confirm it imports and `renderToHtml` returns HTML.
- [ ] Add Playwright for PDF; add Fraunces/Cormorant/script fonts (self-hosted for web/PDF).
- [ ] Commit `theme.ts` tokens. **Exit:** blank app runs, Elements renders a hello-world email.

### Phase 1 — Verify Elements API + core render pipeline
- [ ] Confirm every component/prop in §4.4 against the real package.
- [ ] Implement `render.ts` (email/page/pdf/json/text) against a throwaway letter.
- [ ] `scripts/build-letters.ts` writes all four artifacts to `out/`. **Exit:** one letter produces valid email.html, page.html, .pdf, .json.

### Phase 2 — The letter, designed (the heart)
- [ ] Build `Letter.tsx` mode-agnostic tree with the Candlelight Letterpress system.
- [ ] Build `WaxSeal.tsx` + `Signature.tsx` as **custom Elements** via `registerElementsTool()`.
- [ ] Nail typography, gold hairline, paper grain, spacing — by eye, against §3.
- [ ] Ensure email degrades gracefully (fallback fonts, no grain/animation). **Exit:** all three surfaces look intentional and beautiful; screenshots taken.

### Phase 3 — Content that makes people feel it
- [ ] Write 3 genuinely moving example letters (`to-my-daughter`, `open-when-sad`, `grandmothers-recipe`). Broad "letters to the future" framing; posthumous as one powerful case, not the only one.
- [ ] Real, tasteful copy — this is judged as much as code.

### Phase 3.5 — AI compose (supporting feature)
- [ ] `src/ai/compose.ts`: OpenRouter client → `google/gemini-2.5-flash`, prompt built from (recipient, occasion, memories, tone) → returns letter body HTML for `LetterData.body`.
- [ ] Env-only key (`OPENROUTER_API_KEY`); **graceful no-key fallback** (compose disabled, examples still render).
- [ ] Small, clearly-secondary "Compose with AI" panel in the demo that fills the letter, then hands off to the same Elements render. **Exit:** typing a few details drafts a letter that renders to all three surfaces.

### Phase 4 — The demo site (execution / wow)
- [ ] Landing page: concept + gallery of the letters.
- [ ] `/letter/[slug]`: the `<Page>` render, full-bleed, with the reveal animation.
- [ ] `/compare/[slug]`: **the star** — email / web / PDF shown side-by-side from one source, with an "Edit in Unlayer" button demoing `renderToJson()` round-trip.
- [ ] `prefers-reduced-motion` respected. **Exit:** demo runs locally, feels premium.

### Phase 5 — Delivery story (closes the narrative)
- [ ] `scripts/deliver.ts` CLI: given a letter, on/after `deliverOn` it "delivers" — writes the email (or sends via a stub/console), publishes the page, attaches the PDF. Mocked send is fine; the arc must complete.

### Phase 6 — README + assets (this is 40% of the win)
- [ ] Record the **tri-modal morph GIF** (inbox → browser → print) — the hero.
- [ ] Screenshots of all three outputs + the Unlayer visual editor with the round-tripped letter.
- [ ] README sections: hook → the story → one-tree-three-surfaces diagram → custom component showcase → JSON round-trip → **how to run** → screenshots → credits → `#BuiltWithElements` + link/star to `unlayer/elements`.
- [ ] MIT license.

### Phase 7 — Submit
- [ ] Public GitHub repo, clean history, complete source.
- [ ] **Star / support** `unlayer/elements` (qualification requirement).
- [ ] Submit via the form; post publicly with `#BuiltWithElements`.

---

## 6. README outline (draft)

1. **Hero:** the morph GIF + one line — *"Letters that arrive when you can't."*
2. **Why:** 3 short sentences on time-delayed love / the light that remains.
3. **One tree, three surfaces:** the diagram + a 6-line code snippet.
4. **A signature in wax:** the custom `WaxSeal` Elements component.
5. **So anyone can edit it:** the `renderToJson()` → visual editor round-trip, framed as grief-accessible.
6. **Run it:** `pnpm i && pnpm dev`, `pnpm build:letters`, `pnpm deliver <slug>`.
7. **Gallery:** screenshots of email / web / PDF.
8. **Built with Elements** — link + star, license, credits, `#BuiltWithElements`.

---

## 7. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Elements API differs from my notes | Phase 1 verifies everything before real building; `<Html>` passthrough covers gaps. |
| `registerElementsTool` too limited for the seal | Fall back to an SVG via `<Html>`; still a "custom element," still ships. |
| Web fonts break in email | Serif fallbacks in `<Email>`; real fonts only on web/PDF. |
| Subject matter feels morbid | Broad "letters to the future" framing; warmth, not grief-porn. Restraint in copy. |
| Time | Phases are independently shippable; Phase 2+6 are the minimum for a strong entry. |

---

## 8. Open decisions for your review
1. **Body font:** Fraunces (literary, modern) vs Cormorant Garamond (more intimate/classical). *Default: Fraunces.*
2. **Single Next.js app** (simplest) vs pnpm workspace separating the library from the demo. *Default: single app.*
3. **PDF engine:** Playwright (recommended, high fidelity) vs a lighter HTML-to-PDF lib. *Default: Playwright.*
4. **Scope of Phase 5 delivery:** console-mock vs a real transactional email (e.g. Resend) with a test send. *Default: mock, upgrade if time.*

> Tell me what to change and I'll start at Phase 0.
