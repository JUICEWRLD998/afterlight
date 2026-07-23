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

// Google Fonts link for web/PDF (omitted in email)
const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Ephesis&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">`

function paperCard(data: LetterData, includeWebFonts: boolean) {
  const fontHead = includeWebFonts ? fontLink : ""
  return `${fontHead}
<div style="background:${colors.paper};border-radius:2px;padding:52px 60px 48px;
  box-shadow:0 1px 2px rgba(43,39,35,.06),0 24px 48px -24px rgba(43,39,35,.32);
  font-family:${fonts.serif};color:${colors.ink};max-width:560px;margin:0 auto;">

  <p style="font-size:${fontSize.xs};color:${colors.inkSoft};letter-spacing:0.1em;
    text-transform:uppercase;margin:0 0 36px;font-family:${fonts.sans};">${data.occasion}</p>

  <h1 style="font-size:${fontSize.xl};font-weight:400;margin:0 0 24px;line-height:1.3;
    font-family:${fonts.serif};">${data.salutation}</h1>

  <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.55;margin:0 0 32px;"/>

  <div style="font-size:19px;line-height:1.78;margin:0 0 40px;font-family:${fonts.serif};">
    ${data.body}
  </div>

  <hr style="border:none;border-top:1px solid ${colors.gold};opacity:0.55;margin:0 0 28px;"/>

  <p style="font-size:${fontSize.sm};color:${colors.inkSoft};margin:0 0 4px;
    font-family:${fonts.sans};letter-spacing:0.05em;">With love,</p>
</div>`
}

export function LetterTree(data: LetterData, Root: RootType) {
  const isEmail = Root === Email
  return createElement(Root,
    {
      backgroundColor: colors.night,
      contentWidth: isEmail ? contentWidth.email : contentWidth.page,
      ...(isEmail ? { previewText: data.occasion } : {}),
    },
    createElement(Row,
      { layout: ColumnLayouts.OneColumn, padding: "48px 20px 64px", backgroundColor: colors.night },
      createElement(Column, null,
        createElement(Html, { html: paperCard(data, !isEmail) }),
        createElement(Signature, { name: data.from }),
        createElement(WaxSeal, { monogram: data.sealMonogram, size: 80 }),
        createElement(Html, {
          html: `<p style="text-align:center;font-size:${fontSize.xs};color:${colors.inkSoft};
            font-family:${fonts.sans};letter-spacing:0.08em;margin:20px 0 0;opacity:0.7;">
            Deliver on ${data.deliverOn}</p>`
        })
      )
    )
  )
}
