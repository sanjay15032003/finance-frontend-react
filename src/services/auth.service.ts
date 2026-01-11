import { apiRequest } from './api'
import type { AuthResponse, SignUpPayload, SignInPayload } from '../types/api.types'

export const authService = {
  signUp: (payload: SignUpPayload) =>
    apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      data: payload,
    }),

  signIn: (payload: SignInPayload) =>
    apiRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      data: payload,
    }),

  getToken: () => localStorage.getItem('token'),

  setToken: (token: string) => localStorage.setItem('token', token),

  removeToken: () => localStorage.removeItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token'),
}

