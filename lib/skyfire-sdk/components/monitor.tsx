"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useSkyfireState } from "../context/context"
import { usdAmount } from "../util"

export function SkyfireMonitor() {
  const { balance, claims } = useSkyfireState()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance {usdAmount(balance?.escrow.available)}</CardTitle>
      </CardHeader>
      <CardContent>
        {claims &&
          claims?.map((claim) => (
            <div key={claim.id}>
              <p>
                {claim.destinationName} - {usdAmount(claim.value)} at{" "}
                {claim.createdAt}
              </p>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
