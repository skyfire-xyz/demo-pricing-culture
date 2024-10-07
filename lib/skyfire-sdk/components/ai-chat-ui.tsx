"use client"

import { use, useEffect, useRef, useState } from "react"
import { UseChatHelpers, useChat } from "ai/react"
import { AxiosResponse } from "axios"
import { ChevronDown, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  getItemNamesFromResponse,
  useSkyfireAPIKey,
  useSkyfireResponses,
} from "../context/context"
import { addDatasets } from "../hooks"
import { MemoizedReactMarkdown } from "./markdown"

interface AIChatPanelProps {
  aiChatProps: UseChatHelpers
}

const quickPrompts = ["Can you give me the average prices?"]

export default function Component({ aiChatProps }: AIChatPanelProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    setInput,
  } = aiChatProps

  const responses = useSkyfireResponses()

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)
  const [selectedData, setSelectedData] = useState<string[]>(
    responses.map((res) => res.config.url || "")
  )

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const bottomThreshold = 100
      setShowScrollButton(
        scrollHeight - scrollTop - clientHeight > bottomThreshold
      )
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll)
      return () => chatContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    setSelectedData(responses.map((res) => res.config.url || ""))
  }, [responses])

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    setShowQuickPrompts(false)
  }

  const handleDataToggle = (dataId: string) => {
    setSelectedData((prev) =>
      prev.includes(dataId)
        ? prev.filter((id) => id !== dataId)
        : [...prev, dataId]
    )
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addDatasets(
      responses.filter((res: AxiosResponse) =>
        selectedData.includes(res.config.url || "")
      ),
      messages,
      setMessages
    )

    handleSubmit(e)
  }

  return (
    <Card
      className="w-full mx-auto flex flex-col h-[calc(100vh-380px)]"
      ref={cardRef}
    >
      <CardHeader className="flex-shrink-0">
        <CardTitle>AI Agent</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 relative">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-scroll overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <div className="flex justify-start items-start mb-4">
            <div className="flex items-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>AI</AvatarFallback>
                <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
              </Avatar>
              <div className="mx-2 p-3 rounded-lg bg-muted max-w-[calc(100%-50px)]">
                <p className="mb-2">
                  Welcome to the Pricing Culture AI Agent. What can I do for you
                  {responses.length > 0 ? `or select an option below` : ""}?
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {responses.map((response) => {
                    const url = response.config.url
                    if (!url) return null
                    return (
                      <Badge
                        key={response.config.url}
                        variant={
                          selectedData.includes(url) ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        // onClick={() => handleDataToggle(url)}
                      >
                        {getItemNamesFromResponse(response)}
                        {/* {selectedData.includes(url) && (
                          <X
                            className="w-3 h-3 ml-1"
                            onClick={(e: Event) => {
                              e.stopPropagation()
                              handleDataToggle(url)
                            }}
                          />
                        )} */}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          {messages
            .filter((message) => {
              if (
                message.role === "system" &&
                message.content.startsWith("<Chunk>")
              )
                return false
              return true
            })
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex max-w-[100%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                    <AvatarImage
                      src={
                        message.role === "user"
                          ? "/user-avatar.png"
                          : "/ai-avatar.png"
                      }
                      alt={
                        message.role === "user" ? "User Avatar" : "AI Avatar"
                      }
                    />
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "max-w-[calc(100%-50px)] bg-muted"
                    } break-words`}
                  >
                    <MemoizedReactMarkdown>
                      {message.role === "system"
                        ? message.content.split("<data-response>")[0]
                        : message.content}
                    </MemoizedReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          {isLoading && (
            <div className="flex justify-start items-start mb-4">
              <div className="flex items-start">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage
                    src="/ai-avatar.png"
                    alt="AI Avatar"
                    className="animate-pulse"
                  />
                </Avatar>
                <div className="mx-2 p-3 rounded-lg bg-muted max-w-[calc(100%-50px)]">
                  <span className="inline-block animate-pulse">
                    Thinking<span className="dots">...</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {showScrollButton && (
          <Button
            className="absolute bottom-4 right-4 rounded-full p-2"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
      <CardFooter className="p-4 flex-shrink-0">
        <div className="w-full space-y-4">
          {selectedData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="flex gap-2 w-full">
            <input
              className="flex-grow max-w-md p-2 border rounded bg-white"
              value={input}
              placeholder="Ask about the selected datasets..."
              onChange={handleInputChange}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  )
}
