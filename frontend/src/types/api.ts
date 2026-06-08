export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; message: string; errors?: Record<string, string[]> };

export type PaginatedResponse<T> = 
  | { success: true; data: T[]; meta: { page: number; perPage: number; total: number; totalPages: number } }
  | { success: false; message: string; errors?: Record<string, string[]> };

export interface AuthResponse {
  accessToken: string
  user: User
}

import type { User } from "./models"
