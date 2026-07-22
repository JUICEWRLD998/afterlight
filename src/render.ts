import React from "react"
import { renderToHtml, renderToJson, renderToPlainText } from "@unlayer/react-elements"
import type { DesignJSON } from "@unlayer/react-elements"

export { renderToHtml, renderToJson, renderToPlainText }

export async function renderPdf(documentHtml: string, outputPath: string): Promise<void> {
  const { chromium } = await import("playwright")
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(documentHtml, { waitUntil: "networkidle" })
  await page.pdf({ path: outputPath, format: "A4", printBackground: true })
  await browser.close()
}
