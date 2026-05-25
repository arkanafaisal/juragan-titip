import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, LoginFormData, RegisterFormData } from "@/types"
import { authApi } from "@/services/api/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginFormData) => Promise<{ success: boolean; message?: string }>
  register: (data: RegisterFormData) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    const token = authApi.getToken()
    if (currentUser && token) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (data: LoginFormData) => {
    const response = await authApi.login(data)
    if (response.success) {
      setUser(response.data.user)
      return { success: true }
    }
    return { success: false, message: response.message }
  }, [])

  const register = useCallback(async (data: RegisterFormData) => {
    const response = await authApi.register(data)
    if (response.success) {
      setUser(response.data.user)
      return { success: true }
    }
    return { success: false, message: response.message }
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
