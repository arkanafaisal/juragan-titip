

import type { Product, ProductFormData, ApiResponse } from "@/types"
import { db, type DbProduct } from "@/lib/db"
import { toast } from "sonner"

export interface ProductQueryParams {
  search?: string;
  category?: string;
  stockStatus?: string;
  page?: number;
}

export const productApi = {
  getAll: async (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
    try {
      let collection = db.products.toCollection();

      if (params) {
        if (params.search) {
          const query = params.search.toLowerCase();
          
          collection = collection.filter(p => p.normalizedName.includes(query));
        }
        
        if (params.category) {
          const categoryFilter = params.category.toLowerCase();
          collection = collection.filter(p => p.category.toLowerCase() === categoryFilter);
        }
        
        if (params.stockStatus) {
          if (params.stockStatus === 'in_stock') {
            collection = collection.filter(p => p.warehouseStock > 20);
          } else if (params.stockStatus === 'low_stock') {
            collection = collection.filter(p => p.warehouseStock > 0 && p.warehouseStock <= 20);
          } else if (params.stockStatus === 'out_of_stock') {
            collection = collection.filter(p => p.warehouseStock === 0);
          }
        }
      }

      const page = params?.page || 1;
      const limit = 6;
      const offset = (page - 1) * limit;

      const products = await collection.offset(offset).limit(limit + 1).toArray();

      return { success: true, data: products };
    } catch (error) {
      toast.error("Gagal memuat data produk");
      return { success: false, data: [], message: "Gagal memuat data produk" };
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<Product | null>> => {
    try {
      const numericId = Number(id);
      const product = await db.products.get(numericId);
      if (!product) {
        toast.error("Produk tidak ditemukan");
        return { success: false, data: null, message: "Produk tidak ditemukan" }
      }
      return { success: true, data: product }
    } catch (error) {
      toast.error("Gagal memuat data produk");
      return { success: false, data: null, message: "Gagal memuat data produk" };
    }
  },

  create: async (data: ProductFormData): Promise<ApiResponse<Product | null>> => {
    const normalizedName = data.name.toLowerCase();
    
    const newProduct: Omit<DbProduct, 'id'> = {
      ...data,
      normalizedName
    }

    try {
      const id = await db.products.add(newProduct as DbProduct);
      toast.success("Produk berhasil ditambahkan")
      return { success: true, data: { ...newProduct, id } as Product }
    } catch (error: any) {
      if (error.name === 'ConstraintError') {
        toast.error("Nama produk sudah ada di sistem")
        return { success: false, data: null, message: "Nama produk sudah ada di sistem" }
      }
      console.error("Dexie Create Product Error:", error);
      toast.error("Gagal menyimpan produk")
      return { success: false, data: null, message: "Gagal menyimpan produk" }
    }
  },

  update: async (id: number | string, data: Partial<ProductFormData>): Promise<ApiResponse<Product | null>> => {
    const numericId = Number(id);
    const product = await db.products.get(numericId);
    
    if (!product) return { success: false, data: null, message: "Produk tidak ditemukan" }
    
    const updateData: Partial<DbProduct> = { ...data };
    if (data.name) {
      updateData.normalizedName = data.name.toLowerCase();
    }

    try {
      await db.products.update(numericId, updateData);
      const updatedProduct = await db.products.get(numericId);
      toast.success("Produk berhasil diperbarui")
      return { success: true, data: updatedProduct! }
    } catch (error: any) {
      if (error.name === 'ConstraintError') {
        toast.error("Nama produk sudah digunakan oleh produk lain")
        return { success: false, data: null, message: "Nama produk sudah digunakan oleh produk lain" }
      }
      toast.error("Gagal memperbarui produk")
      return { success: false, data: null, message: "Gagal memperbarui produk" }
    }
  },

  delete: async (id: number | string, productNameConfirm: string): Promise<ApiResponse<null>> => {
    const numericId = Number(id);
    const product = await db.products.get(numericId);
    
    if (!product) {
      return { 
        success: false, 
        data: null, 
        message: "Produk tidak ditemukan" 
      };
    }

    if (product.normalizedName !== productNameConfirm.toLowerCase()) {
      return { 
        success: false, 
        data: null, 
        message: "Konfirmasi nama salah untuk produk ini" 
      };
    }

    await db.products.delete(numericId);
    return { success: true, data: null };
  },
}