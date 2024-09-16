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
import { ClaimsWidget } from "./claims"
import LogoutButton from "./logout"

export function WalletInterface() {
  const { wallet, balance, claims } = useSkyfireState()
  const { dispatch, logout } = useSkyfire()

  return (
    <Card className="skyfire-theme w-[200px] max-w-[200px] mx-auto">
      <CardHeader>
        <CardTitle>{usdAmount(balance?.escrow.available || "0")}</CardTitle>
        <CardDescription>{wallet?.walletAddress}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="claim-history">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claim-history">Claim History</TabsTrigger>
            <TabsTrigger value="wallet-info">Wallet Details</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet-info">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Wallet Details</h3>
                <p>
                  <strong>Name:</strong> {wallet?.walletName}
                </p>
                <p>
                  <strong>Address:</strong> {wallet?.walletAddress}
                </p>
                <p>
                  <strong>Network:</strong>{" "}
                  {/* {getNetworkName(wallet?.network || "polygon_testnet")} */}
                </p>
                <p>
                  <strong>Type:</strong> {wallet?.walletType}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Balance Details</h3>
                <p>
                  <strong>Total Escrow:</strong>{" "}
                  {usdAmount(balance?.escrow.total || "0")}
                </p>
                <p>
                  <strong>Available Escrow:</strong>{" "}
                  {usdAmount(balance?.escrow.available || "0")}
                </p>
                <p>
                  <strong>Allowance:</strong>{" "}
                  {usdAmount(balance?.escrow.allowance || "0")}
                </p>
                <p>
                  <strong>Native Balance:</strong>{" "}
                  {usdAmount(balance?.native.balance || "0")}
                </p>
                <div className="mt-4">
                  <LogoutButton onLogout={logout} />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="claim-history">
            <ClaimsWidget claims={claims || []} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
