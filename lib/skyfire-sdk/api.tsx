import axios from "axios"

import { getApiKeyFromLocalStorage } from "./util"

export const skyfireAPI = axios.create({
  baseURL: "https://app-qa.skyfire.app",
})

const api = axios.create({})
// axiosRetry(api, { retries: 2 })

api.interceptors.request.use(
  (config) => {
    // Allowing to override the default API key set in the envs
    const key = getApiKeyFromLocalStorage()
    if (key) {
      config.headers["skyfire-api-key"] = key
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
