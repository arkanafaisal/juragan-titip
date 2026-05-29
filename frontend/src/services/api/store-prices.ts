import type { StorePrice, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { generateId } from "@/lib/utils"
import { toast } from "sonner"

const seedStorePrices: StorePrice[] = [
  {
    id: "sp-001",
    storeId: "store-001",
    productId: "prod-001",
    productName: "Keripik Singkong",
    standardPrice: 12000,
    customPrice: 10000,
  },
]

export const storePriceApi = {
  getByStore: async (storeId: string): Promise<ApiResponse<StorePrice[]>> => {
    try {
      const prices = storageGetOrSeed<StorePrice[]>(STORAGE_KEYS.STORE_PRICES, seedStorePrices)
      return { success: true, data: prices.filter((p) => p.storeId === storeId) }
    } catch (error) {
      toast.error("Gagal memuat harga khusus toko")
      return { success: false, data: [], message: "Gagal memuat harga khusus toko" }
    }
  },

  upsert: async (data: Omit<StorePrice, "id">): Promise<ApiResponse<StorePrice>> => {
    try {
      const prices = storageGetOrSeed<StorePrice[]>(STORAGE_KEYS.STORE_PRICES, seedStorePrices)
      const existing = prices.findIndex((p) => p.storeId === data.storeId && p.productId === data.productId)

      if (existing >= 0) {
        prices[existing] = { ...prices[existing], ...data }
        storageSet(STORAGE_KEYS.STORE_PRICES, prices)
        toast.success("Harga khusus berhasil diperbarui")
        return { success: true, data: prices[existing] }
      }

      const newPrice: StorePrice = { id: generateId("sp"), ...data }
      storageSet(STORAGE_KEYS.STORE_PRICES, [...prices, newPrice])
      toast.success("Harga khusus berhasil disimpan")
      return { success: true, data: newPrice }
    } catch (error) {
      toast.error("Gagal menyimpan harga khusus")
      return { success: false, data: null as any, message: "Gagal menyimpan harga khusus" }
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const prices = storageGetOrSeed<StorePrice[]>(STORAGE_KEYS.STORE_PRICES, seedStorePrices)
    storageSet(STORAGE_KEYS.STORE_PRICES, prices.filter((p) => p.id !== id))
    return { success: true, data: null }
  },
}
