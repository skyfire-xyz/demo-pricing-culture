"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

import { InterviewItem, InterviewReport } from "./type"

interface Micro1ContextType {
  interviewList: InterviewItem[]
  reportList: InterviewReport[]
  loading: boolean
  error: string | null
  selectedComp: InterviewItem | null
}

const Micro1Context = createContext<Micro1ContextType | undefined>(undefined)

export const Micro1Provider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [interviewList, setInterviewList] = useState<InterviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedComp, setSelectedComp] = useState<InterviewItem | null>(null)
  const [reportList, setReportList] = useState<InterviewReport[]>([])

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.post(`/api/skyfire-api`, {
          method: "GET",
          path: `proxy/micro1/interviews`,
        })
        setInterviewList(response.data.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch market comps")
        setLoading(false)
      }
    }

    const fetchInterviewReports = async () => {
      try {
        const response = await axios.post(`/api/skyfire-api`, {
          method: "GET",
          path: `proxy/micro1/interview/reports`,
        })
        setReportList(response.data.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch market comps")
        setLoading(false)
      }
    }
    fetchInterviews()
    fetchInterviewReports()
  }, [])

  return (
    <Micro1Context.Provider
      value={{
        interviewList,
        loading,
        error,
        selectedComp,
        reportList,
      }}
    >
      {children}
    </Micro1Context.Provider>
  )
}

export const useMicro1 = () => {
  const context = useContext(Micro1Context)
  if (context === undefined) {
    throw new Error("useMicro1 must be used within a Micro1Provider")
  }
  return context
}

// export const useSelectedComp = ({
//   id,
//   from,
//   to,
// }: {
//   id: string
//   from: string
//   to: string
// }) => {
//   const { selectedComp, fetchCompDetails } = useMicro1()

//   useEffect(() => {
//     if (id) {
//       fetchCompDetails(id, from, to)
//     }
//   }, [id])

//   return selectedComp
// }
