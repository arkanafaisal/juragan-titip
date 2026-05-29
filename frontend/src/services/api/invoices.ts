import type { Invoice, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { generateId } from "@/lib/utils"

export const invoiceApi = {
  getAll: async (): Promise<ApiResponse<Invoice[]>> => {
    const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    return { success: true, data: invoices }
  },

  getById: async (id: string): Promise<ApiResponse<Invoice>> => {
    const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    const invoice = invoices.find((i) => i.id === id)
    if (!invoice) return { success: false, data: null as unknown as Invoice, message: "Invoice tidak ditemukan" }
    return { success: true, data: invoice }
  },

  getByStore: async (storeId: string): Promise<ApiResponse<Invoice[]>> => {
    const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    return { success: true, data: invoices.filter((i) => i.storeId === storeId) }
  },

  create: async (data: Omit<Invoice, "id">): Promise<ApiResponse<Invoice>> => {
    const invoices = storageGetOrSeed<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    const newInvoice: Invoice = {
      id: generateId("inv"),
      ...data,
    }
    storageSet(STORAGE_KEYS.INVOICES, [...invoices, newInvoice])
    return { success: true, data: newInvoice }
  },
}
