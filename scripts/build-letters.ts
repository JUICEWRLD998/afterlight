// scripts/build-letters.ts
// Produces email.html, page.html, document.html, design.json, plain.txt for every letter
import { createElement } from "react"
import {
  Email, Page, Document,
  Row, Column, ColumnLayouts,
  Heading, Paragraph, Divider, Html,
  renderToHtml, renderToJson, renderToPlainText,
} from "@unlayer/react-elements"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import type { LetterData } from "../src/letters/types"
import { colors, fonts, fontSize, contentWidth } from "../src/elements/theme"

// ── letter tree (mode-agnostic body) ─────────────────────────────────────────
function LetterTree(data: LetterData, Root: typeof Email | typeof Page | typeof Document) {
  return createElement(Root,
    {
      backgroundColor: colors.night,
      contentWidth: contentWidth.email,
      previewText: data.occasion,
    },
    // outer padding row
    createElement(Row, { layout: ColumnLayouts.OneColumn, padding: "40px 20px", backgroundColor: colors.night },
      createElement(Column, null,
        // paper card
        createElement(Html, {
          html: `<div style="background:${colors.paper};border-radius:2px;padding:48px 56px;box-shadow:0 1px 2px rgba(43,39,35,.06),0 24px 48px -24px rgba(43,39,35,.35);font-family:${fonts.serif};color:${colors.ink};">
            <p style="font-size:${fontSize.sm};color:${colors.inkSoft};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 32px;">${data.occasion}</p>
            <h1 style="font-size:${fontSize.xl};font-weight:400;margin:0 0 20px;line-height:1.3;">${data.salutation}</h1>
            <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.5;margin:0 0 28px;" />
            <div style="font-size:19px;line-height:1.75;margin:0 0 40px;">${data.body}</div>
            <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.5;margin:0 0 28px;" />
            <p style="font-family:${fonts.script};font-size:${fontSize["2xl"]};color:${colors.ink};margin:0 0 8px;">${data.from}</p>
            <p style="font-size:${fontSize.xs};color:${colors.inkSoft};letter-spacing:0.06em;margin:0;">Deliver on: ${data.deliverOn}</p>
          </div>`,
        })
      )
    )
  )
}

// ── build ─────────────────────────────────────────────────────────────────────
async function build() {
  const outDir = join(process.cwd(), "out")
  mkdirSync(outDir, { recursive: true })

  const letters: LetterData[] = [
    (await import("../src/letters/data/to-my-daughter")).default,
  ]

  for (const letter of letters) {
    const emailHtml = renderToHtml(LetterTree(letter, Email))
    const pageHtml  = renderToHtml(LetterTree(letter, Page))
    const docHtml   = renderToHtml(LetterTree(letter, Document))
    const json      = renderToJson(LetterTree(letter, Email))
    const plain     = renderToPlainText(LetterTree(letter, Email))

    writeFileSync(join(outDir, `${letter.slug}.email.html`),   emailHtml)
    writeFileSync(join(outDir, `${letter.slug}.page.html`),    pageHtml)
    writeFileSync(join(outDir, `${letter.slug}.document.html`),docHtml)
    writeFileSync(join(outDir, `${letter.slug}.design.json`),  JSON.stringify(json, null, 2))
    writeFileSync(join(outDir, `${letter.slug}.plain.txt`),    plain)

    console.log(`✓ ${letter.slug}: email(${emailHtml.length}) page(${pageHtml.length}) doc(${docHtml.length}) json(${Object.keys(json).join(",")}) plain(${plain.length})`)
  }

  console.log("\nPhase 1 PASSED — all artifacts written to out/")
}

build().catch(e => { console.error(e); process.exit(1) })
