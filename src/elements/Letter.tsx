import { createElement } from "react"
import {
  Email, Page, Document,
  Row, Column, ColumnLayouts, Html,
} from "@unlayer/react-elements"
import WaxSeal from "./WaxSeal"
import Signature from "./Signature"
import { colors, fonts, fontSize, contentWidth } from "./theme"
import type { LetterData } from "../letters/types"

type RootType = typeof Email | typeof Page | typeof Document

const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Ephesis&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">`

function sealSvg(monogram: string, size = 80) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;">
    <defs>
      <radialGradient id="waxSheen" cx="38%" cy="32%" r="60%">
        <stop offset="0%"  stop-color="#C4524D"/>
        <stop offset="60%" stop-color="${colors.wax}"/>
        <stop offset="100%" stop-color="${colors.waxDeep}"/>
      </radialGradient>
      <filter id="waxShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${colors.waxDeep}" flood-opacity="0.45"/>
      </filter>
    </defs>
    <circle cx="40" cy="40" r="38" fill="url(#waxSheen)" filter="url(#waxShadow)"/>
    <circle cx="40" cy="40" r="33" fill="none" stroke="${colors.waxDeep}" stroke-width="1" stroke-opacity="0.3"/>
    <text x="40" y="47" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="600"
      fill="${colors.waxDeep}" fill-opacity="0.55" letter-spacing="1">${monogram}</text>
  </svg>`
}

function paperCard(data: LetterData, includeWebFonts: boolean) {
  return `${includeWebFonts ? fontLink : ""}
<div style="background:${colors.paper};border-radius:2px;padding:52px 60px 48px;
  box-shadow:0 1px 2px rgba(43,39,35,.06),0 24px 48px -24px rgba(43,39,35,.32);
  font-family:${fonts.serif};color:${colors.ink};">

  <p style="font-size:${fontSize.xs};color:${colors.inkSoft};letter-spacing:0.1em;
    text-transform:uppercase;margin:0 0 36px;font-family:${fonts.sans};">${data.occasion}</p>

  <h1 style="font-size:${fontSize.xl};font-weight:400;margin:0 0 24px;line-height:1.3;">${data.salutation}</h1>

  <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.55;margin:0 0 32px;"/>

  <div style="font-size:19px;line-height:1.78;margin:0 0 40px;">${data.body}</div>

  <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.55;margin:0 0 28px;"/>

  <p style="font-size:${fontSize.sm};color:${colors.inkSoft};margin:0 0 4px;
    font-family:${fonts.sans};letter-spacing:0.05em;">With love,</p>

  <p style="font-family:${fonts.script};font-size:${fontSize["2xl"]};color:${colors.ink};
    margin:4px 0 32px;line-height:1.2;">${data.from}</p>

  <div style="text-align:center;padding:8px 0 16px;">${sealSvg(data.sealMonogram)}</div>

  <p style="text-align:center;font-size:${fontSize.xs};color:${colors.inkSoft};
    font-family:${fonts.sans};letter-spacing:0.08em;margin:16px 0 0;opacity:0.7;">
    Deliver on ${data.deliverOn}</p>
</div>`
}

export function LetterTree(data: LetterData, Root: RootType) {
  const isEmail = Root === Email
  // WaxSeal + Signature are registered Elements tools — used here for JSON/editor export
  // Visual render uses inline HTML inside the paper card for correct layout
  return createElement(Root,
    {
      backgroundColor: colors.night,
      contentWidth: isEmail ? contentWidth.email : contentWidth.page,
      ...(isEmail ? { previewText: data.occasion } : {}),
    },
    createElement(Row,
      { layout: ColumnLayouts.OneColumn, padding: "48px 20px 64px", backgroundColor: colors.night },
      createElement(Column, null,
        createElement(Html, { html: paperCard(data, !isEmail) })
      )
    )
  )
}

// Export registered tools so they appear in renderToJson output
export { WaxSeal, Signature }
