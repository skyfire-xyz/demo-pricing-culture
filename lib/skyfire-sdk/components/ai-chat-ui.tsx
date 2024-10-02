"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useSkyfireResponses } from "../context/context"
import { formatReponseToChatSystemData } from "../util"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
}

export default function Component() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat()
  const responses = useSkyfireResponses()

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const updateHeight = () => {
      if (cardRef.current && chatContainerRef.current) {
        const windowHeight = window.innerHeight
        const cardRect = cardRef.current.getBoundingClientRect()
        const headerHeight =
          cardRef.current.querySelector('div[class*="CardHeader"]')
            ?.clientHeight || 0
        const footerHeight =
          cardRef.current.querySelector('div[class*="CardFooter"]')
            ?.clientHeight || 0

        const maxCardHeight = windowHeight - cardRect.top - 20 // 20px buffer
        const chatContainerHeight = maxCardHeight - headerHeight - footerHeight

        cardRef.current.style.height = `${maxCardHeight}px`
        chatContainerRef.current.style.height = `${chatContainerHeight}px`
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    //
    setMessages(
      responses.map((res) => {
        return formatReponseToChatSystemData(res)
      })
    )

    return () => {
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  return (
    <Card className="w-full max-w-lg mx-auto flex flex-col" ref={cardRef}>
      <CardHeader></CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <div ref={chatContainerRef} className="overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                  <AvatarImage
                    src={
                      message.role === "user"
                        ? "/user-avatar.png"
                        : "/ai-avatar.png"
                    }
                    alt={message.role === "user" ? "User Avatar" : "AI Avatar"}
                  />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "system"
                    ? message.content.split("<data-response>")[0]
                    : message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <input
            className="flex-grow max-w-md p-2 border rounded bg-white"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}
