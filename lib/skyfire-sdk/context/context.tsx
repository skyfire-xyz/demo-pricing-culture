"use client"

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import axios, { AxiosInstance } from "axios"

import {
  SkyfireAction,
  loading,
  updateSkyfireAPIKey,
  updateSkyfireClaims,
  updateSkyfireWallet,
} from "@/lib/skyfire-sdk/context/action"

import {
  getApiKeyFromLocalStorage,
  removeApiKeyFromLocalStorage,
} from "../util"
import { initialState, skyfireReducer } from "./reducer"
import { SkyfireState } from "./type"

interface SkyfireContextType {
  state: SkyfireState
  dispatch: React.Dispatch<SkyfireAction>
  apiClient: AxiosInstance | null
  logout: () => void
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
      baseURL: "https://api-qa.skyfire.xyz",
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
        // Can Process Payment Here
        setTimeout(() => {
          dispatch(loading(false))
          if (response.headers["skyfire-payment-reference-id"]) {
            fetchUserBlanace()
            fetchUserClaims()
          }
        }, 500)
        return response
      },
      (error) => {
        dispatch(loading(false))
        if (error.response && error.response.status === 401) {
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
    // fetUserBalance
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/balance")
        dispatch(updateSkyfireWallet(res.data))
      } catch (e) {}
    }
  }

  async function fetchUserClaims() {
    // fetUserBalance
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/claims")
        dispatch(updateSkyfireClaims(res.data))
      } catch (e) {}
    }
  }

  function logout() {
    removeApiKeyFromLocalStorage()
    dispatch(updateSkyfireAPIKey(null))
  }

  useEffect(() => {
    if (apiClient) {
      // Fetch User Balance
      fetchUserBlanace()
      fetchUserClaims()
    }
  }, [apiClient])

  return (
    <SkyfireContext.Provider value={{ state, dispatch, apiClient, logout }}>
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
