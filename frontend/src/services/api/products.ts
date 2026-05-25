import type { Product, ProductFormData, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { seedProducts } from "@/seed-data/products"
import { generateId } from "@/lib/utils"

export const productApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, seedProducts)
    return { success: true, data: products }
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, seedProducts)
    const product = products.find((p) => p.id === id)
    if (!product) return { success: false, data: null as unknown as Product, message: "Produk tidak ditemukan" }
    return { success: true, data: product }
  },

  create: async (data: ProductFormData): Promise<ApiResponse<Product>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, seedProducts)
    const newProduct: Product = {
      id: generateId("prod"),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    storageSet(STORAGE_KEYS.PRODUCTS, [...products, newProduct])
    return { success: true, data: newProduct }
  },

  update: async (id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, seedProducts)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return { success: false, data: null as unknown as Product, message: "Produk tidak ditemukan" }
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() }
    storageSet(STORAGE_KEYS.PRODUCTS, products)
    return { success: true, data: products[index] }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, seedProducts)
    storageSet(STORAGE_KEYS.PRODUCTS, products.filter((p) => p.id !== id))
    return { success: true, data: null }
  },
}
