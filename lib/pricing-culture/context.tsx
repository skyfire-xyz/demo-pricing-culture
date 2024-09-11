"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

import { MarketCompObject } from "./type"

interface PricingCultureContextType {
  marketComps: MarketCompObject[]
  loading: boolean
  error: string | null
}

const PricingCultureContext = createContext<
  PricingCultureContextType | undefined
>(undefined)

export const PricingCultureProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [marketComps, setMarketComps] = useState<MarketCompObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarketComps = async () => {
      try {
        const response = await axios.get(
          "https://dataservices.pricingculture.com/api/data/dailycomps"
        )
        setMarketComps(response.data.objects)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch market comps")
        setLoading(false)
      }
    }

    fetchMarketComps()
  }, [])

  return (
    <PricingCultureContext.Provider value={{ marketComps, loading, error }}>
      {children}
    </PricingCultureContext.Provider>
  )
}

export const usePricingCulture = () => {
  const context = useContext(PricingCultureContext)
  if (context === undefined) {
    throw new Error(
      "usePricingCulture must be used within a PricingCultureProvider"
    )
  }
  return context
}
