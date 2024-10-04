import { OpenAIStream, StreamingTextResponse, convertToCoreMessages } from "ai"

import { SKYFIRE_ENDPOINT_URL } from "@/lib/skyfire-sdk/env"

export async function POST(request: Request) {
  const req = await request.json()
  const apiKey = request.headers.get("skyfire-api-key")
  const { messages, model, chatType } = req

  if (!apiKey) {
    return Response.json({ message: "Missing API Key" }, { status: 401 })
  }

  const streamResponse = await fetch(
    `${SKYFIRE_ENDPOINT_URL}/proxy/openrouter/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "skyfire-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5-8b",
        messages: convertToCoreMessages(messages),
        stream: true,
      }),
    }
  )

  if (!streamResponse.ok) {
    return Response.json(
      { message: "API request failed" },
      { status: streamResponse.status }
    )
  }

  if (streamResponse.body) {
    // TODO: Figure out how to handle the stream response without
    const stream = OpenAIStream(streamResponse)
    return new StreamingTextResponse(stream)
  }
}
