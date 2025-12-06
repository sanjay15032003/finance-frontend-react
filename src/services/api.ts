import type { ApiResponse } from '../types/api.types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  const response = await res.json()

  if (!response.success) {
    throw new Error(response.message || 'Something went wrong')
  }

  return response
}

