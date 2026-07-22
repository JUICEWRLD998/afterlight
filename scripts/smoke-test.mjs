// Phase 0 smoke test — verifies Elements renders all three modes
import { createElement } from "react"
import {
  Email, Page, Document,
  Row, Column, ColumnLayouts,
  Heading, Paragraph, Divider,
  renderToHtml, renderToJson,
} from "@unlayer/react-elements"

const tree = (Root) => createElement(Root,
  { backgroundColor: "#FBF7EF", contentWidth: "600px" },
  createElement(Row, { layout: ColumnLayouts.OneColumn, padding: "48px" },
    createElement(Column, null,
      createElement(Heading, { fontSize: "31px", color: "#2B2723" }, "My dearest Amara,"),
      createElement(Divider, { borderTopColor: "#C9A24B" }),
      createElement(Paragraph, { html: "By the time you read this, you will be eighteen.", fontSize: "19px", color: "#2B2723" }),
    )
  )
)

const emailHtml = renderToHtml(tree(Email))
const pageHtml  = renderToHtml(tree(Page))
const docHtml   = renderToHtml(tree(Document))
const json      = renderToJson(tree(Email))

console.log("✓ Email  HTML:", emailHtml.length, "chars")
console.log("✓ Page   HTML:", pageHtml.length,  "chars")
console.log("✓ Doc    HTML:", docHtml.length,   "chars")
console.log("✓ JSON keys:", Object.keys(json).join(", "))
console.log("\nPhase 0 smoke test PASSED — Elements renders all three modes.")
