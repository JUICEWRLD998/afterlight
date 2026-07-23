import { composeLetterBody, isComposeEnabled } from "../src/ai/compose"

async function main() {
  console.log(`compose enabled: ${isComposeEnabled()}`)

  const result = await composeLetterBody({
    recipient: "my daughter Amara",
    occasion: "her first day of university",
    memories: "teaching her to ride a bike; she never gave up even when she fell",
    tone: "warm and proud, a little bittersweet",
  })

  console.log(`\nsource: ${result.source}${result.model ? ` (${result.model})` : ""}`)
  if (result.reason) console.log(`reason: ${result.reason}`)
  console.log(`\n--- body HTML ---\n${result.body}\n`)

  if (result.source === "ai" && result.body.includes("<br/><br/>")) {
    console.log("Phase 3.5 test PASSED — AI drafted a body in the correct HTML shape.")
  } else if (result.source === "fallback") {
    console.log("Phase 3.5 test: fell back gracefully (check reason above).")
  }
}

main().catch(e => { console.error(e); process.exit(1) })
