import { registerElementsTool } from "@unlayer/react-elements"
import { colors, fonts, fontSize } from "./theme"

function signatureHtml(name: string) {
  return `<div style="padding:8px 0 4px;">
    <span style="font-family:${fonts.script};font-size:${fontSize["2xl"]};color:${colors.ink};line-height:1.2;display:block;">${name}</span>
  </div>`
}

const Signature = registerElementsTool({
  name: "signature",
  displayName: "Signature",
  values: { name: "Dad" },
  renderer: {
    exporters: {
      web:      ({ name }: { name: string }) => signatureHtml(name),
      email:    ({ name }: { name: string }) => signatureHtml(name),
      document: ({ name }: { name: string }) => signatureHtml(name),
    },
  },
})

export default Signature
