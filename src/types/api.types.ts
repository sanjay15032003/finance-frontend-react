export type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
}

export type AuthResponse = {
  accessToken: string
}

export type SignUpPayload = {
  name: string
  email: string
  password: string
}

export type SignInPayload = {
  email: string
  password: string
}
