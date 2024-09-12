"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

import { MarketCompObject } from "./type"

interface PricingCultureContextType {
  marketComps: MarketCompObject[]
  loading: boolean
  error: string | null
  selectedComp: MarketCompObject | null
  fetchCompDetails: (id: string, from: string, to: string) => Promise<void>
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
  const [selectedComp, setSelectedComp] = useState<MarketCompObject | null>(
    null
  )

  useEffect(() => {
    const fetchMarketComps = async () => {
      try {
        const response = await axios.post(`/api/skyfire-api`, {
          method: "GET",
          path: `proxy/pricing-culture/api/data/dailycomps`,
        })
        setMarketComps(response.data.objects)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch market comps")
        setLoading(false)
      }
    }
    fetchMarketComps()
  }, [])

  const fetchCompDetails = async (id: string, from: string, to: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`/api/skyfire-api`, {
        method: "GET",
        path: `proxy/pricing-culture/api/data/dailycomps/snapshot?id=${id}&start_time=${from}&end_time=${to}`,
      })
      setSelectedComp(response.data.objects)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch comp details")
      setLoading(false)
    }
  }

  return (
    <PricingCultureContext.Provider
      value={{ marketComps, loading, error, selectedComp, fetchCompDetails }}
    >
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

export const useSelectedComp = ({
  id,
  from,
  to,
}: {
  id: string
  from: string
  to: string
}) => {
  const { marketComps, selectedComp, fetchCompDetails } = usePricingCulture()

  useEffect(() => {
    if (id) {
      fetchCompDetails(id, from, to)
    }
  }, [id])

  const selectedCompDetail =
    id && marketComps.find((comp) => comp.id == Number(id))

  return {
    meta: selectedCompDetail,
    data: selectedComp,
  }
}
