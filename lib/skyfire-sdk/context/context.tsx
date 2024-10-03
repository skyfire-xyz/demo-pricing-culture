"use client"

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios"

import {
  SkyfireAction,
  addResponse,
  loading,
  updateError,
  updateSkyfireAPIKey,
  updateSkyfireClaims,
  updateSkyfireWallet,
} from "@/lib/skyfire-sdk/context/action"

import { toast } from "../shadcn/hooks/use-toast"
import {
  getApiKeyFromLocalStorage,
  removeApiKeyFromLocalStorage,
  usdAmount,
} from "../util"
import { initialState, skyfireReducer } from "./reducer"
import { SkyfireState } from "./type"

interface SkyfireContextType {
  state: SkyfireState
  dispatch: React.Dispatch<SkyfireAction>
  apiClient: AxiosInstance | null
  logout: () => void
  pushResponse: (response: AxiosResponse) => void
}

const SkyfireContext = createContext<SkyfireContextType | undefined>(undefined)

export const SkyfireProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(skyfireReducer, initialState)

  // Create a memoized Axios instance
  const apiClient = useMemo(() => {
    if (!state.localAPIKey) return null
    const instance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_SKYFIRE_API_URL || "https://api.skyfire.xyz",
    })

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        config.headers["skyfire-api-key"] = state.localAPIKey
        if (config.url?.includes("proxy")) {
          dispatch(loading(true))
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    instance.interceptors.response.use(
      async (response) => {
        if (response.config.url?.includes("proxy")) {
          pushResponse(response)
        }

        // Can Process Payment Here
        setTimeout(() => {
          dispatch(loading(false))
          if (response.headers["skyfire-payment-reference-id"]) {
            fetchUserBlanace()
            fetchUserClaims()
            if (response.headers["skyfire-payment-amount"]) {
              toast({
                title: `Spent ${usdAmount(
                  response.headers["skyfire-payment-amount"]
                )}`,
                duration: 3000,
              })
            }
          }
        }, 500)
        return response
      },
      (error) => {
        dispatch(loading(false))
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
        }
        return Promise.reject(error)
      }
    )

    return instance
  }, [state.localAPIKey])

  useEffect(() => {
    const apiKey = getApiKeyFromLocalStorage()
    dispatch(updateSkyfireAPIKey(apiKey))
  }, [])

  async function fetchUserBlanace() {
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/balance")
        dispatch(updateSkyfireWallet(res.data))
      } catch (e) {
        if (isAxiosError(e)) {
          dispatch(updateError(e))
        }
      }
    }
  }

  async function fetchUserClaims() {
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/claims")
        dispatch(updateSkyfireClaims(res.data))
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          dispatch(updateError(e))
        }
      }
    }
  }

  function logout() {
    removeApiKeyFromLocalStorage()
    dispatch(updateSkyfireAPIKey(null))
  }

  function pushResponse(response: AxiosResponse) {
    dispatch(addResponse(response))
  }

  useEffect(() => {
    if (apiClient) {
      fetchUserBlanace()
      fetchUserClaims()
    }
  }, [apiClient])

  return (
    <SkyfireContext.Provider
      value={{ state, dispatch, apiClient, logout, pushResponse }}
    >
      {children}
    </SkyfireContext.Provider>
  )
}

export const useSkyfire = () => {
  const context = useContext(SkyfireContext)
  if (!context) {
    throw new Error("useSkyfire must be used within a SkyfireProvider")
  }
  return context
}

export const useSkyfireState = () => {
  const context = useContext(SkyfireContext)
  if (!context) {
    throw new Error("useSkyfire must be used within a SkyfireProvider")
  }
  return context.state
}

export const useSkyfireAPIKey = () => {
  const { state } = useSkyfire()

  return {
    localAPIKey: state?.localAPIKey,
    isReady: state?.isAPIKeyInitialized,
  }
}

export const useSkyfireAPIClient = () => {
  const { state, apiClient } = useSkyfire()
  if (!state.localAPIKey) return null
  return apiClient
}

export const useLoadingState = () => {
  const { state } = useSkyfire()
  return state?.loading
}

export const useSkyfireResponses = () => {
  const { state } = useSkyfire()
  return state?.responses
}
