"use client"

import { useEffect } from "react"
import { Message } from "ai"
import { AxiosResponse } from "axios"

import { concatenateMessages, formatReponseToChatSystemData } from "./util"

export function useMessageHandler(
  responses: AxiosResponse[],
  messages: Message[],
  setMessages: (messages: Message[]) => void
) {
  useEffect(() => {
    const addingMessages = responses.flatMap((res) => {
      return formatReponseToChatSystemData(res, messages)
    })

    if (addingMessages.length > 0) {
      setMessages((prevMessages) =>
        concatenateMessages(addingMessages, prevMessages)
      )
    }
  }, [responses, messages, setMessages])
}
