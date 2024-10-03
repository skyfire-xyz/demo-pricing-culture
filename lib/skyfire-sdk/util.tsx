/**
 * Test if session storage is supported for the browser.
 * @returns {boolean}
 */

import { Message } from "ai"
import { AxiosResponse } from "axios"

const API_KEY_LOCAL_STORAGE_KEY = "skyfire_local_api_key"
export const isLocalStorageSupported = () => {
  try {
    const key = "__storage__test"
    if (window) {
      window["localStorage"].setItem(key, "")
      window["localStorage"].removeItem(key)
      return true
    } else {
      return false
    }
  } catch {
    return false
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export const getApiKeyFromLocalStorage = () => {
  if (!isLocalStorageSupported()) {
    return null
  }
  return localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY)
}

export const removeApiKeyFromLocalStorage = () => {
  if (!isLocalStorageSupported()) {
    return
  }
  localStorage.removeItem(API_KEY_LOCAL_STORAGE_KEY)
}

export const setApiKeyToLocalStorage = (apiKey: string): boolean => {
  if (!isLocalStorageSupported()) {
    return false
  }
  if (apiKey === undefined || !isValidUUID(apiKey)) {
    removeApiKeyFromLocalStorage()
    return false
  }

  localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey)
  return true
}

export function usdAmount(usdc: number | string) {
  if (usdc === undefined || usdc === null) {
    return "0.00 USD"
  }
  if (typeof usdc === "string") {
    usdc = usdc.split(" ")[0]
  }
  // Converts USDC to USD by dividing by 1,000,000
  const usdAmount = Number(usdc) / 1000000
  return "$" + usdAmount.toFixed(7) + " USD"
}

export function formatReponseToChatSystemData(
  response: AxiosResponse
): Message[] {
  const originalMessageObj: Message = {
    id: `claim-${response.config.url}`,
    role: "system",
    content: `Response from ${response.config.url}`,
  }

  const chunkedContent = chunkMessages([
    {
      role: "system",
      content: JSON.stringify(response.data),
    } as Message,
  ])

  const chunkedMessages: Message[] = chunkedContent.map((chunk, index) => ({
    id: `claim-${response.config.url}-chunk-${index + 1}`,
    role: "system",
    content: chunk.content,
  }))

  return [originalMessageObj, ...chunkedMessages]
}

const CHUNK_SIZE = 5000 // Adjust this value based on your needs and model limits

type Role = "system" | "user" | "assistant"

export function chunkMessages(messages: Message[]): Message[] {
  const chunkedMessages: Message[] = []

  for (const message of messages) {
    if (message.content.length > CHUNK_SIZE) {
      // If a single message is larger than CHUNK_SIZE, split it
      const contentChunks = chunkContent(message.content)
      for (const chunk of contentChunks) {
        chunkedMessages.push({
          role: message.role,
          content: `<Chunk> ${chunk}`,
        })
      }
    } else {
      chunkedMessages.push(message)
    }
  }

  return chunkedMessages
}

function chunkContent(content: string): string[] {
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += CHUNK_SIZE) {
    chunks.push(content.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}

export function concatenateMessages(messageGroups: Message[][]): Message[] {
  return messageGroups.reduce((acc, group) => acc.concat(group), [])
}
