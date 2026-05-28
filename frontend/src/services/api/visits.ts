import type { Visit, ApiResponse } from "@/types"
import { db, type DbVisit } from "@/lib/db"

export const visitApi = {
  getAll: async (): Promise<ApiResponse<Visit[] | null>> => {
    try {
      const visits = await db.visits.toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get All Visits Error:", error);
      return { success: false, data: null, message: "Gagal memuat kunjungan" }
    }
  },

  getByStore: async (storeId: number | string): Promise<ApiResponse<Visit[] | null>> => {
    const numericId = Number(storeId);
    try {
      const visits = await db.visits.where('storeId').equals(numericId).toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get Visits by Store Error:", error);
      return { success: false, data: null, message: "Gagal memuat kunjungan toko" }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<Visit | null>> => {
    const numericId = Number(id);
    try {
      const visit = await db.visits.get(numericId);
      if (!visit) return { success: false, data: null, message: "Kunjungan tidak ditemukan" }
      return { success: true, data: visit }
    } catch (error) {
      console.error("Dexie Get Visit By Id Error:", error);
      return { success: false, data: null, message: "Gagal memuat kunjungan" }
    }
  },

  create: async (data: Omit<Visit, "id">): Promise<ApiResponse<Visit | null>> => {
    const newVisit: Omit<DbVisit, 'id'> = {
      ...data,
      // pastikan storeId selalu berbentuk number jika disupply string
      storeId: Number(data.storeId),
      createdAt: new Date().toISOString() 
    }

    try {
      const id = await db.visits.add(newVisit as DbVisit);
      return { success: true, data: { ...newVisit, id } as Visit }
    } catch (error) {
      console.error("Dexie Create Visit Error:", error);
      return { success: false, data: null, message: "Gagal menyimpan kunjungan" }
    }
  },
}