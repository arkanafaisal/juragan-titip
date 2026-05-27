// frontend/src/services/api/products.ts

import type { Product, ProductFormData, ApiResponse } from "@/types"
import { storageGet, storageGetOrSeed, storageSet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { seedProducts } from "@/seed-data/products"
import { generateId } from "@/lib/utils"
export interface ProductQueryParams {
  search?: string;
  category?: string;
  stockStatus?: string;
  page?: number;
}

export const productApi = {
  getAll: async (params?: ProductQueryParams) => {
    // Simulasi delay jaringan
    await new Promise((resolve) => setTimeout(resolve, 300));

    let products = storageGetOrSeed<Array<Product>>(STORAGE_KEYS.PRODUCTS, []) // localStorage.getItem("jt_products"); 
    // let products = storedData ? JSON.parse(storedData) : [];

    // 1. Proses Filtering
    if (params) {
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter((p: any) => 
          p.name.toLowerCase().includes(query)
        );
      }
      
      if (params.category) {
        products = products.filter((p: any) => 
          p.category.toLowerCase() === params.category!.toLowerCase()
        );
      }
      
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

    // 2. Proses Pagination (Ambil 6 item untuk cek halaman selanjutnya)
    const page = params?.page || 1;
    const limit = 6;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit + 1; // +1 untuk mengintip data halaman berikutnya

    products = products.slice(startIndex, endIndex);

    return { success: true, data: products };
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, [])
    const product = products.find((p) => p.id === id)
    if (!product) return { success: false, data: null as unknown as Product, message: "Produk tidak ditemukan" }
    return { success: true, data: product }
  },

  create: async (data: ProductFormData): Promise<ApiResponse<Product>> => {
    const products = storageGet<Product[]>(STORAGE_KEYS.PRODUCTS) || []
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
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, [])
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return { success: false, data: null as unknown as Product, message: "Produk tidak ditemukan" }
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() }
    storageSet(STORAGE_KEYS.PRODUCTS, products)
    return { success: true, data: products[index] }
  },

  delete: async (id: string, productNameConfirm: string): Promise<ApiResponse<null>> => {
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const products = storageGetOrSeed<Product[]>(STORAGE_KEYS.PRODUCTS, [])
    
    const isNameExists = products.some((p) => p.name.toLowerCase() === productNameConfirm.toLowerCase());
    
    if (!isNameExists) {
      return { 
        success: false, 
        data: null as unknown as null, 
        message: "Nama produk tidak ditemukan di sistem" 
      };
    }

    const productIndex = products.findIndex(
      (p) => p.id === id && p.name.toLowerCase() === productNameConfirm.toLowerCase()
    );

    if (productIndex === -1) {
      return { 
        success: false, 
        data: null as unknown as null, 
        message: "Konfirmasi nama salah untuk ID produk ini" 
      };
    }

    products.splice(productIndex, 1);
    storageSet(STORAGE_KEYS.PRODUCTS, products);
    return { success: true, data: null };
  },
}