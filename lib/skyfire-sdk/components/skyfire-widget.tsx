"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useSkyfireAPIKey, useSkyfireState } from "../context/context"
import { usdAmount } from "../util"
import { ApiKeyConfig } from "./api-key-config"
import { WalletInterface } from "./wallet"

export default function SkyfireWidget() {
  const localAPIKey = useSkyfireAPIKey()
  const { balance } = useSkyfireState()
  const [isDialogOpen, setIsDialogOpen] = useState(!localAPIKey)
  const [showWidget, setShowWidget] = useState(!!localAPIKey)

  useEffect(() => {
    if (localAPIKey) {
      setIsDialogOpen(false)
      setShowWidget(true)
    }
  }, [localAPIKey])

  const minimizedVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: "-50%",
      y: "-50%",
      left: "50%",
      top: "50%",
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      left: "auto",
      right: "20px",
      top: "auto",
      bottom: "20px",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const claims = [
    "Generate Image",
    "Analyze Text",
    "Translate Language",
    "Summarize Document",
    "Detect Objects",
    "Sentiment Analysis",
  ]

  return (
    <div className="skyfire-theme">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent className="skyfire-theme sm:max-w-[425px]">
          <ApiKeyConfig />
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showWidget && (
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={minimizedVariants}
                style={{
                  position: "fixed",
                  backgroundColor: "hsl(var(--primary))",
                  zIndex: 9900,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                className="rounded-full p-2 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2 p-4">
                  {/* <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Company Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  /> */}
                  <span className="text-primary-foreground font-semibold">
                    {usdAmount(balance?.escrow.available || "0")}
                  </span>
                </div>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              className="max-w-[500px] w-[500px] bg-transparent border-none p-0"
              align="end"
              side="top"
            >
              <WalletInterface />
            </PopoverContent>
          </Popover>
        )}
      </AnimatePresence>
    </div>
  )
}
