import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk"
import { get, invoke } from "lodash"

// Check if the environment is valid.
type SkyfireEnv = "production" | "sandbox"
function isSkyfireEnv(env: any): env is SkyfireEnv {
  return env === "production" || env === "sandbox"
}

export async function POST(request: Request) {
  const req = await request.json()

  const { apiPath, payload } = req

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 })
  }
  if (
    process.env.SKYFIRE_APP_ENV !== undefined &&
    !isSkyfireEnv(process.env.SKYFIRE_APP_ENV)
  ) {
    return Response.json({ message: "Wrong Environment" }, { status: 401 })
  }

  // Initialize Skyfire Client
  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV,
    baseUrl: process.env.SKYFIRE_API_BASE_URL,
  })

  let res
  try {
    // e.g. client.account.wallet.getWalletBalanceForUser
    res = await invoke(client, apiPath, payload)
  } catch (err) {
    const error = err as any
    return Response.json(
      { message: `Call to ${apiPath} | Error: ${error.body || error.message}` },
      { status: error.code }
    )
  }

  if (!res) return Response.json({ message: "Not Found" }, { status: 400 })

  // Return result without payment information
  return Response.json(res)
}
