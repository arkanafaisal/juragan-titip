export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface AuthResponse {
  accessToken: string
  user: User
}

import type { User } from "./models"
