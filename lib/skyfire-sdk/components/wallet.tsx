import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { updateSkyfireAPIKey } from "../context/action"
import { useSkyfire, useSkyfireState } from "../context/context"
import { usdAmount } from "../util"
import AIChatPanel from "./ai-chat-ui"
import { ClaimsWidget } from "./claims"
import LogoutButton from "./logout"
import { WalletDetailsPanel } from "./tab-balance-details"

export function WalletInterface() {
  const { wallet, balance, claims } = useSkyfireState()

  return (
    <Card className="skyfire-theme max-w-full min-h-[50vh] flex flex-col">
      <CardHeader>
        <CardTitle>{usdAmount(balance?.escrow.available || "0")}</CardTitle>
        <CardDescription>{wallet?.walletAddress}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="claim-history" className="h-full">
          <TabsList className="">
            <TabsTrigger value="claim-history">Claim History</TabsTrigger>
            <TabsTrigger value="wallet-info">Wallet Details</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet-info" className="h-full">
            <div className="h-full overflow-y-auto">
              <WalletDetailsPanel wallet={wallet} balance={balance} />
            </div>
          </TabsContent>
          <TabsContent value="claim-history" className="h-full">
            <div className="h-full overflow-y-auto">
              <ClaimsWidget claims={claims || []} />
            </div>
          </TabsContent>
          <TabsContent value="chat" className="h-full">
            <div className="h-full overflow-y-auto">
              <AIChatPanel />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
