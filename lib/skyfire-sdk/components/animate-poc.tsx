"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function AnimatedComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [showMinimized, setShowMinimized] = useState(false)

  const handleSubmit = () => {
    if (apiKey.trim()) {
      setIsDialogOpen(false)
      setShowMinimized(true)
    }
  }

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

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent className="sm:max-w-[425px]">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Enter Skyfire API Key</CardTitle>
              <CardDescription>We need your API key to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Skyfire API key to unlock full functionality. This
                  key is required to authenticate your requests and access our
                  services.
                </p>
              </div>
              <Button onClick={handleSubmit} className="w-full mt-4">
                Submit API Key
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showMinimized && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={minimizedVariants}
            style={{
              position: "fixed",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--primary))",
              zIndex: 9900,
              overflow: "hidden",
            }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary-foreground"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
