import { apiRequest } from './api'

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

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/user/profile', {
      method: 'GET',
    })
    return response.data
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/user/profile', {
      method: 'PUT',
      data: data,
    })
    return response.data
  },
}
