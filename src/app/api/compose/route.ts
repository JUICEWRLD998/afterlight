import { NextResponse } from "next/server"
import { composeLetterBody, isComposeEnabled } from "@/ai/compose"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const input = {
    recipient: typeof body.recipient === "string" ? body.recipient : "my loved one",
    occasion: typeof body.occasion === "string" ? body.occasion : "a meaningful milestone",
    memories: typeof body.memories === "string" ? body.memories : "",
    tone: typeof body.tone === "string" ? body.tone : "warm and sincere",
  }

  const result = await composeLetterBody(input)

  return NextResponse.json({
    ...result,
    enabled: isComposeEnabled(),
  })
}
