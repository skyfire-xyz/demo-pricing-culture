import { OpenAIStream, StreamingTextResponse, convertToCoreMessages } from "ai"

import { SKYFIRE_API_KEY, SKYFIRE_ENDPOINT_URL } from "@/lib/skyfire-sdk/env"

export async function POST(request: Request) {
  const req = await request.json()
  const { messages, model, chatType } = req

  console.log("aaa")
  if (!SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 })
  }

  console.log("111")
  const streamResponse = await fetch(
    `${SKYFIRE_ENDPOINT_URL}/proxy/openrouter/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "skyfire-api-key": SKYFIRE_API_KEY,
        "skyfire-api-key": "",
      },
      body: JSON.stringify({
        model: "openai/chatgpt-4o-latest",
        messages: convertToCoreMessages(messages),
        stream: true,
      }),
    }
  )

  console.log(streamResponse, "222")

  if (!streamResponse.ok) {
    return Response.json(
      { message: "API request failed" },
      { status: streamResponse.status }
    )
  }

  console.log("333")

  if (streamResponse.body) {
    // TODO: Figure out how to handle the stream response without
    const stream = OpenAIStream(streamResponse)
    return new StreamingTextResponse(stream)
  }
}
