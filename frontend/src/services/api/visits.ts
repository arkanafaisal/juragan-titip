import type { Visit, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { generateId } from "@/lib/utils"

export const visitApi = {
  getAll: async (): Promise<ApiResponse<Visit[]>> => {
    const visits = storageGetOrSeed<Visit[]>(STORAGE_KEYS.VISITS, [])
    return { success: true, data: visits }
  },

  getByStore: async (storeId: string): Promise<ApiResponse<Visit[]>> => {
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const visits = storageGetOrSeed<Visit[]>(STORAGE_KEYS.VISITS, [])
    return { success: true, data: visits.filter((v) => v.storeId === storeId) }
  },

  getById: async (id: string): Promise<ApiResponse<Visit>> => {
    const visits = storageGetOrSeed<Visit[]>(STORAGE_KEYS.VISITS, [])
    const visit = visits.find((v) => v.id === id)
    if (!visit) return { success: false, data: null as unknown as Visit, message: "Kunjungan tidak ditemukan" }
    return { success: true, data: visit }
  },

  create: async (data: Omit<Visit, "id">): Promise<ApiResponse<Visit>> => {
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const visits = storageGetOrSeed<Visit[]>(STORAGE_KEYS.VISITS, [])
    const newVisit: Visit = {
      id: generateId("visit"),
      ...data,
    }
    storageSet(STORAGE_KEYS.VISITS, [...visits, newVisit])
    return { success: true, data: newVisit }
  },
}