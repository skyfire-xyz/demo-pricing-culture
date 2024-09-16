"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

import {
  useLoadingState,
  useSkyfireAPIKey,
  useSkyfireState,
} from "../context/context"
import { usdAmount } from "../util"
import { ApiKeyConfig } from "./api-key-config"
import LoadingImageWidget from "./loadingImage"
import { WalletInterface } from "./wallet"

export default function SkyfireWidget() {
  const { localAPIKey, isReady } = useSkyfireAPIKey()

  const loading = useLoadingState()
  const { balance } = useSkyfireState()
  const [isDialogOpen, setIsDialogOpen] = useState(isReady && !localAPIKey)
  const [showWidget, setShowWidget] = useState(isReady && !!localAPIKey)

  useEffect(() => {
    if (isReady) {
      if (localAPIKey) {
        setIsDialogOpen(false)
        setShowWidget(true)
      } else {
        setIsDialogOpen(true)
        setShowWidget(false)
      }
    }
  }, [localAPIKey, isReady])

  const minimizedVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: 0,
      y: 0,
      right: "20px",
      bottom: "20px",
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      right: "20px",
      bottom: "20px",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

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
                initial={localAPIKey ? "visible" : "hidden"}
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
                  <LoadingImageWidget
                    src="https://imagedelivery.net/WemO4_3zZlyNq-8IGpxrAQ/9b7b7f1c-a4b7-4777-c7ff-c92b50865600/public"
                    alt="Company Logo"
                    size={50}
                    loading={!!loading}
                  />
                  <span className="text-primary-foreground text-xl font-semibold">
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
