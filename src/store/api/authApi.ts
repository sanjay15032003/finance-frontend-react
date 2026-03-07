import { baseApi } from './baseApi'
import type { AuthResponse, SignUpPayload, SignInPayload, ApiResponse } from '../../types/api.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpPayload>({
      query: (payload) => ({
        url: '/auth/signup',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
      transformErrorResponse: (response: any) =>
        response.data?.message || 'Signup failed',
    }),

    signIn: builder.mutation<AuthResponse, SignInPayload>({
      query: (payload) => ({
        url: '/auth/signin',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
      transformErrorResponse: (response: any) =>
        response.data?.message || 'Login failed',
    }),
  }),
})

export const { useSignUpMutation, useSignInMutation } = authApi
