// scripts/build-pdf.ts — renders the Document HTML to a real PDF via Playwright
import { readFileSync } from "fs"
import { join } from "path"
import { renderPdf } from "../src/render"

async function main() {
  const outDir = join(process.cwd(), "out")
  const slug = process.argv[2] ?? "to-my-daughter"
  const docHtml = readFileSync(join(outDir, `${slug}.document.html`), "utf-8")
  const pdfPath = join(outDir, `${slug}.pdf`)
  await renderPdf(docHtml, pdfPath)
  console.log(`✓ PDF written: ${pdfPath}`)
}

main().catch(e => { console.error(e); process.exit(1) })
