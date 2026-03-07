import { baseApi } from './baseApi'
import type { ApiResponse } from '../../types/api.types'

export type UserProfile = {
  id: number
  email: string
  name: string
  mobileNumber?: string
  createdAt: string
}

export type UpdateProfileData = {
  name: string
  mobileNumber?: string
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/user/profile',
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfileData>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi
