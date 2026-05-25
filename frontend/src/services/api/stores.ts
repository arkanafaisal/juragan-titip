import type { Store, StoreFormData, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { seedStores } from "@/seed-data/stores"
import { generateId } from "@/lib/utils"

export const storeApi = {
  getAll: async (): Promise<ApiResponse<Store[]>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, seedStores)
    return { success: true, data: stores }
  },

  getById: async (id: string): Promise<ApiResponse<Store>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, seedStores)
    const store = stores.find((s) => s.id === id)
    if (!store) return { success: false, data: null as unknown as Store, message: "Toko tidak ditemukan" }
    return { success: true, data: store }
  },

  create: async (data: StoreFormData): Promise<ApiResponse<Store>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, seedStores)
    const newStore: Store = {
      id: generateId("store"),
      ...data,
      activeItemCount: 0,
      totalReceivable: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    storageSet(STORAGE_KEYS.STORES, [...stores, newStore])
    return { success: true, data: newStore }
  },

  update: async (id: string, data: Partial<StoreFormData>): Promise<ApiResponse<Store>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, seedStores)
    const index = stores.findIndex((s) => s.id === id)
    if (index === -1) return { success: false, data: null as unknown as Store, message: "Toko tidak ditemukan" }
    stores[index] = { ...stores[index], ...data, updatedAt: new Date().toISOString() }
    storageSet(STORAGE_KEYS.STORES, stores)
    return { success: true, data: stores[index] }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, seedStores)
    storageSet(STORAGE_KEYS.STORES, stores.filter((s) => s.id !== id))
    return { success: true, data: null }
  },
}
