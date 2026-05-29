import type { Visit, ApiResponse } from "@/types"
import { db, type DbVisit } from "@/lib/db"
import { toast } from "sonner"

export const visitApi = {
  getAll: async (): Promise<ApiResponse<Visit[] | null>> => {
    try {
      const visits = await db.visits.toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get All Visits Error:", error);
      toast.error("Gagal memuat kunjungan")
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
      toast.error("Gagal memuat kunjungan toko")
      return { success: false, data: null, message: "Gagal memuat kunjungan toko" }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<Visit | null>> => {
    const numericId = Number(id);
    try {
      const visit = await db.visits.get(numericId);
      if (!visit) {
        toast.error("Kunjungan tidak ditemukan")
        return { success: false, data: null, message: "Kunjungan tidak ditemukan" }
      }
      return { success: true, data: visit }
    } catch (error) {
      console.error("Dexie Get Visit By Id Error:", error);
      toast.error("Gagal memuat kunjungan")
      return { success: false, data: null, message: "Gagal memuat kunjungan" }
    }
  },

  create: async (data: Omit<Visit, "id">): Promise<ApiResponse<Visit | null>> => {
    const newVisit: Omit<DbVisit, 'id'> = {
      ...data,
      
      storeId: Number(data.storeId),
      createdAt: new Date().toISOString() 
    }

    try {
      const id = await db.visits.add(newVisit as DbVisit);
      toast.success("Kunjungan berhasil disimpan")
      return { success: true, data: { ...newVisit, id } as Visit }
    } catch (error) {
      console.error("Dexie Create Visit Error:", error);
      toast.error("Gagal menyimpan kunjungan")
      return { success: false, data: null, message: "Gagal menyimpan kunjungan" }
    }
  },
}