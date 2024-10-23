import { NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

import { createTools, toolsInstruction } from "@/lib/skyfire-sdk/ai-agent/tools"
import { SKYFIRE_ENDPOINT_URL } from "@/lib/skyfire-sdk/env"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const apiKey = req.headers.get("skyfire-api-key")

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 401 })
  }

  if (!SKYFIRE_ENDPOINT_URL) {
    return NextResponse.json(
      { error: "Missing Skyfire Endpoint URL" },
      { status: 500 }
    )
  }

  // Use OpenAI Provider, but replace the base URL with the Skyfire endpoint
  const skyfireWithOpenAI = createOpenAI({
    baseURL: `${SKYFIRE_ENDPOINT_URL}/proxy/openai/v1`,
    headers: {
      "skyfire-api-key": apiKey,
    },
  })

  try {
    const tools = createTools(SKYFIRE_ENDPOINT_URL, apiKey)

    const instruction = {
      role: "system",
      content: toolsInstruction,
    }

    const result = await streamText({
      model: skyfireWithOpenAI("gpt-4o"),
      messages: [instruction, ...messages],
      tools,
    })

    // Return the streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "An error occurred during the request" },
      { status: 500 }
    )
  }
}
