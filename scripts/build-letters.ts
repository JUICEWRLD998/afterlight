import { createElement } from "react"
import { Email, Page, Document, renderToHtml, renderToJson, renderToPlainText } from "@unlayer/react-elements"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { LetterTree } from "../src/elements/Letter"
import type { LetterData } from "../src/letters/types"

async function build() {
  const outDir = join(process.cwd(), "out")
  mkdirSync(outDir, { recursive: true })

  const letters: LetterData[] = [
    (await import("../src/letters/data/to-my-daughter")).default,
    (await import("../src/letters/data/open-when-sad")).default,
    (await import("../src/letters/data/grandmothers-recipe")).default,
  ]

  for (const letter of letters) {
    const emailHtml = renderToHtml(LetterTree(letter, Email))
    const pageHtml  = renderToHtml(LetterTree(letter, Page))
    const docHtml   = renderToHtml(LetterTree(letter, Document))
    const json      = renderToJson(LetterTree(letter, Email))
    const plain     = renderToPlainText(LetterTree(letter, Email))

    writeFileSync(join(outDir, `${letter.slug}.email.html`),    emailHtml)
    writeFileSync(join(outDir, `${letter.slug}.page.html`),     pageHtml)
    writeFileSync(join(outDir, `${letter.slug}.document.html`), docHtml)
    writeFileSync(join(outDir, `${letter.slug}.design.json`),   JSON.stringify(json, null, 2))
    writeFileSync(join(outDir, `${letter.slug}.plain.txt`),     plain)

    console.log(`✓ ${letter.slug}: email(${emailHtml.length}) page(${pageHtml.length}) doc(${docHtml.length}) json(${Object.keys(json).join(",")}) plain(${plain.length})`)
  }

  console.log("\nPhase 3 build PASSED — all artifacts written to out/")
}

build().catch(e => { console.error(e); process.exit(1) })
