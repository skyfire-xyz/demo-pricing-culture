export async function POST(request: Request) {
  const req = await request.json()

  const { paylaod, path, method } = req

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 })
  }
  if (!process.env.SKYFIRE_ENDPOINT_URL) {
    return Response.json(
      { message: "Missing Skyfire API URL" },
      { status: 401 }
    )
  }

  // Call the BE API directly
  const apiResponse = await fetch(
    `${process.env.SKYFIRE_ENDPOINT_URL}/${path}`,
    {
      method: method,
      headers: {
        "skyfire-api-key": process.env.SKYFIRE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paylaod),
    }
  )

  if (!apiResponse.ok) {
    throw new Error(`HTTP error! status: ${apiResponse.status}`)
  }
  let jsonResponse = null
  const contentType = apiResponse.headers.get("Content-Type")
  if (contentType && contentType.includes("application/json")) {
    jsonResponse = await apiResponse.json()
  }
  return Response.json(jsonResponse)
}
