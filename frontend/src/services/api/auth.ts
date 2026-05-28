import type { ApiResponse, AuthResponse, User, LoginFormData, RegisterFormData } from "@/types"
import { storageGet, storageSet, storageRemove } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { db, type DbUser } from "@/lib/db"

export const authApi = {
  login: async (data: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
    // Pastikan email menjadi lowercase untuk mencegah case-sensitivity duplicate
    const emailLower = data.email.toLowerCase();
    
    // Cari user menggunakan IndexedDB (Dexie) berdasarkan email
    const user = await db.users.where('email').equals(emailLower).first();
    
    if (user && user.password === data.password) {
      const { password: _, ...userData } = user
      const token = `mock-jwt-${Date.now()}`
      
      // Simpan session (State kecil & sinkron) ke LocalStorage
      storageSet(STORAGE_KEYS.AUTH_TOKEN, token)
      storageSet(STORAGE_KEYS.AUTH_USER, userData)
      
      return { success: true, data: { accessToken: token, user: userData } }
    }
    
    return { success: false, data: null as unknown as AuthResponse, message: "Email atau password salah" }
  },

  register: async (data: RegisterFormData): Promise<ApiResponse<AuthResponse>> => {
    const emailLower = data.email.toLowerCase();
    
    const newUser: Omit<DbUser, 'id'> = {
      name: data.name,
      email: emailLower,
      password: data.password,
      createdAt: new Date().toISOString(),
    }

    try {
      // Insert user ke IndexedDB, Dexie akan otomatis membuatkan 'id' auto-increment
      const id = await db.users.add(newUser as DbUser);
      
      const { password: _, ...userData } = { ...newUser, id } as DbUser;
      const token = `mock-jwt-${Date.now()}`
      
      // Simpan session ke LocalStorage
      storageSet(STORAGE_KEYS.AUTH_TOKEN, token)
      storageSet(STORAGE_KEYS.AUTH_USER, userData)

      return { success: true, data: { accessToken: token, user: userData } }
    } catch (error: any) {
      if (error.name === 'ConstraintError') {
        return { success: false, data: null as unknown as AuthResponse, message: "Email sudah terdaftar" }
      }
      console.error("Dexie Register Error:", error);
      return { success: false, data: null as unknown as AuthResponse, message: "Gagal mendaftar ke database" }
    }
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
