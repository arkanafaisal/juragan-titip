import type { Invoice, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { generateId } from "@/lib/utils"
import { toast } from "sonner"

export const invoiceApi = {
  getAll: async (): Promise<ApiResponse<Invoice[]>> => {
    try {
      const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
      return { success: true, data: invoices }
    } catch (error) {
      toast.error("Gagal memuat data invoice")
      return { success: false, data: [], message: "Gagal memuat data invoice" }
    }
  },

  getById: async (id: string): Promise<ApiResponse<Invoice>> => {
    try {
      const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
      const invoice = invoices.find((i) => i.id === id)
      if (!invoice) {
        toast.error("Invoice tidak ditemukan")
        return { success: false, data: null as unknown as Invoice, message: "Invoice tidak ditemukan" }
      }
      return { success: true, data: invoice }
    } catch (error) {
      toast.error("Gagal memuat data invoice")
      return { success: false, data: null as unknown as Invoice, message: "Gagal memuat data invoice" }
    }
  },

  getByStore: async (storeId: string): Promise<ApiResponse<Invoice[]>> => {
    try {
      const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
      return { success: true, data: invoices.filter((i) => i.storeId === storeId) }
    } catch (error) {
      toast.error("Gagal memuat data invoice toko")
      return { success: false, data: [], message: "Gagal memuat data invoice toko" }
    }
  },

  create: async (data: Omit<Invoice, "id">): Promise<ApiResponse<Invoice>> => {
    try {
      const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
      const newInvoice: Invoice = {
        id: generateId("inv"),
        ...data,
      }
      storageSet(STORAGE_KEYS.INVOICES, [...invoices, newInvoice])
      toast.success("Invoice berhasil dibuat")
      return { success: true, data: newInvoice }
    } catch (error) {
      toast.error("Gagal membuat invoice")
      return { success: false, data: null as any, message: "Gagal membuat invoice" }
    }
  },
}
