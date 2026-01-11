import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/api.types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error(error.message || 'Something went wrong')
  }
)

export async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await axiosInstance({
    url: endpoint,
    ...options,
  })

  if (!response.data.success) {
    throw new Error(response.data.message || 'Something went wrong')
  }

  return response.data
}

export default axiosInstance

