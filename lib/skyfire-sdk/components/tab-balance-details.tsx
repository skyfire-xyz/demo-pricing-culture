import React from "react"

import { useSkyfire } from "../context/context"
import { usdAmount } from "../util"
import LogoutButton from "./logout"

interface WalletDetailsPanelProps {
  wallet: {
    walletName: string
    walletAddress: string
    network: string
    walletType: string
  } | null
  balance: {
    escrow: {
      total: string
      available: string
      allowance: string
    }
    native: {
      balance: string
    }
  } | null
}

export function WalletDetailsPanel({
  wallet,
  balance,
}: WalletDetailsPanelProps) {
  const { dispatch, logout } = useSkyfire()
  return (
    <div className="space-y-4 max-w-sm h-full">
      <div>
        <h3 className="text-lg font-semibold">Wallet Details</h3>
        <p>
          <strong>Name:</strong> {wallet?.walletName}
        </p>
        <p>
          <strong>Address:</strong> {wallet?.walletAddress}
        </p>
        <p>
          <strong>Network:</strong> {wallet?.network}
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
  )
}
