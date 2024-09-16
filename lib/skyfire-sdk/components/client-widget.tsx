"use client"

import { useSkyfireAPIKey } from "../context/context"
import { ApiKeyConfig } from "./api-key-config"
import { SkyfireMonitor } from "./monitor"

export function SkyfireClientWidget() {
  const localAPIKey = useSkyfireAPIKey()

  if (localAPIKey) {
    return <SkyfireMonitor />
  } else {
    return <ApiKeyConfig />
  }
}
