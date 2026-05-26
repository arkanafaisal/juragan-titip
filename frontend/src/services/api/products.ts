import type { Product, ProductFormData, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { seedProducts } from "@/seed-data/products"
import { generateId } from "@/lib/utils"

export interface ProductQueryParams {
  search?: string;
  category?: string;
  stockStatus?: string;
}

export const productApi = {
  getAll: async (params?: ProductQueryParams) => {
    // Simulasi delay jaringan (biar terasa seperti API beneran)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Ambil data asli dari localStorage (sesuaikan nama key kamu jika berbeda)
    const storedData = localStorage.getItem("jt_products"); // atau STORAGE_KEYS.PRODUCTS
    let products = storedData ? JSON.parse(storedData) : [];

    // 3. Terapkan logika Backend Filtering jika ada parameter yang dikirim
    if (params) {
      // Filter Nama Produk
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter((p: any) => 
          p.name.toLowerCase().includes(query)
        );
      }
      
      // Filter Kategori
      if (params.category) {
        products = products.filter((p: any) => 
          p.category.toLowerCase() === params.category!.toLowerCase()
        );
      }
      
      // Filter Status Stok
      if (params.stockStatus) {
        if (params.stockStatus === 'in_stock') {
          products = products.filter((p: any) => p.warehouseStock > 20);
        } else if (params.stockStatus === 'low_stock') {
          products = products.filter((p: any) => p.warehouseStock > 0 && p.warehouseStock <= 20);
        } else if (params.stockStatus === 'out_of_stock') {
          products = products.filter((p: any) => p.warehouseStock === 0);
        }
      }
    }

    return { success: true, data: products };
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
