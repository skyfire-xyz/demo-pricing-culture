"use client"

import { useEffect } from "react"
import { Message } from "ai"
import { AxiosResponse } from "axios"

import { concatenateMessages, formatReponseToChatSystemData } from "./util"

export function addDatasets(
  responses: AxiosResponse[],
  messages: Message[],
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
) {
  const addingMessages = responses.flatMap((res) => {
    return formatReponseToChatSystemData(res, messages)
  })
  if (addingMessages.length > 0) {
    setMessages((prevMessages) => {
      const filteredMessages = addingMessages.filter((msg) => {
        return !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
      })
      return concatenateMessages([prevMessages, filteredMessages])
    })
  }
}
