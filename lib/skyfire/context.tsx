// src/contexts/skyfire/context.tsx

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react"
import axios from "axios"

import { SkyfireAction, updateSkyfireInfo } from "./action"
import { initialState, skyfireReducer } from "./reducer"
import { SkyfireState } from "./type"

interface SkyfireContextType {
  state: SkyfireState
  dispatch: React.Dispatch<SkyfireAction>
}

const SkyfireContext = createContext<SkyfireContextType | undefined>(undefined)

export const SkyfireProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(skyfireReducer, initialState)

  const fetchSomething = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get<SkyfireState>("your-api-endpoint")
      dispatch(updateSkyfireInfo(response.data))
    } catch (error) {
      console.error("Error fetching Skyfire data:", error)
    }
  }

  useEffect(() => {
    fetchSomething() // Initial fetch
  }, [])

  return (
    <SkyfireContext.Provider value={{ state, dispatch }}>
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
