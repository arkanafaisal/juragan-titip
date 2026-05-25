import type { ApiResponse, AuthResponse, User, LoginFormData, RegisterFormData } from "@/types"
import { storageGet, storageSet, storageRemove } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"

const DEFAULT_USER: User = {
  id: "user-001",
  name: "Ahmad Reseller",
  email: "ahmad@juragan.com",
  phone: "081234567890",
  createdAt: "2026-01-01T00:00:00Z",
}

export const authApi = {
  login: async (data: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
    const users = storageGet<Array<User & { password: string }>>(STORAGE_KEYS.AUTH_USER + "_list")

    if (users) {
      const user = users.find((u) => u.email === data.email && u.password === data.password)
      if (user) {
        const { password: _, ...userData } = user
        const token = `mock-jwt-${Date.now()}`
        storageSet(STORAGE_KEYS.AUTH_TOKEN, token)
        storageSet(STORAGE_KEYS.AUTH_USER, userData)
        return { success: true, data: { accessToken: token, user: userData } }
      }
      return { success: false, data: null as unknown as AuthResponse, message: "Email atau password salah" }
    }

    if (data.email === "ahmad@juragan.com" && data.password === "password") {
      const token = `mock-jwt-${Date.now()}`
      storageSet(STORAGE_KEYS.AUTH_TOKEN, token)
      storageSet(STORAGE_KEYS.AUTH_USER, DEFAULT_USER)
      return { success: true, data: { accessToken: token, user: DEFAULT_USER } }
    }

    return { success: false, data: null as unknown as AuthResponse, message: "Email atau password salah" }
  },

  register: async (data: RegisterFormData): Promise<ApiResponse<AuthResponse>> => {
    const users = storageGet<Array<User & { password: string }>>(STORAGE_KEYS.AUTH_USER + "_list") || []

    if (users.some((u) => u.email === data.email)) {
      return { success: false, data: null as unknown as AuthResponse, message: "Email sudah terdaftar" }
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      createdAt: new Date().toISOString(),
    }

    storageSet(STORAGE_KEYS.AUTH_USER + "_list", [...users, newUser])

    const { password: _, ...userData } = newUser
    const token = `mock-jwt-${Date.now()}`
    storageSet(STORAGE_KEYS.AUTH_TOKEN, token)
    storageSet(STORAGE_KEYS.AUTH_USER, userData)

    return { success: true, data: { accessToken: token, user: userData } }
  },

  logout: async (): Promise<void> => {
    storageRemove(STORAGE_KEYS.AUTH_TOKEN)
    storageRemove(STORAGE_KEYS.AUTH_USER)
  },

  getCurrentUser: (): User | null => {
    return storageGet<User>(STORAGE_KEYS.AUTH_USER)
  },

  getToken: (): string | null => {
    return storageGet<string>(STORAGE_KEYS.AUTH_TOKEN)
  },

  isAuthenticated: (): boolean => {
    return !!storageGet<string>(STORAGE_KEYS.AUTH_TOKEN)
  },
}
