// scripts/screenshot.ts — render an out/ HTML file to PNG for visual QA
import { readFileSync } from "fs"
import { join } from "path"

async function main() {
  const { chromium } = await import("playwright")
  const outDir = join(process.cwd(), "out")
  const slug = process.argv[2] ?? "to-my-daughter"
  const variant = process.argv[3] ?? "page" // page | email | document
  const html = readFileSync(join(outDir, `${slug}.${variant}.html`), "utf-8")
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 760, height: 1200 }, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: "networkidle" })
  const path = join(outDir, `${slug}.${variant}.png`)
  await page.screenshot({ path, fullPage: true })
  await browser.close()
  console.log(`✓ Screenshot: ${path}`)
}

main().catch(e => { console.error(e); process.exit(1) })
