

import type { Product, ProductFormData, ApiResponse, InventoryLog } from "@/types"
import { db, type DbProduct } from "@/lib/db"
import { toast } from "sonner"
import Dexie from "dexie";
import { settingsApi } from "@/services/api/settings";
import { LIMIT } from "@/lib/constants";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  stockStatus?: string;
  isArchived?: string;
  page?: number;
}

export interface ProductDetailWithLogs {
  product: Product;
  logs: InventoryLog[];
}

export const productApi = {
  getAll: async (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
    try {
      let productsArray: DbProduct[] = [];
      
      if (params?.category) {
        productsArray = await db.products
          .where('category')
          .equals(params.category.toLowerCase())
          .sortBy('normalizedName');
      } else {
        productsArray = await db.products
          .orderBy('normalizedName')
          .toArray();
      }

      // ====================================================
      // 2. FASE RAM (Javascript): Filter logika bisnis
      // ====================================================
      
      const showArchived = params?.isArchived === 'true';
      productsArray = productsArray.filter(p => !!p.isArchived === showArchived);

      if (params) {
        if (params.search) {
          const query = params.search.toLowerCase();
          productsArray = productsArray.filter(p => p.normalizedName.startsWith(query));
        }
        
        // Filter Status Stok
        if (params.stockStatus) {
          const threshold = settingsApi.getLowStockThreshold();
          if (params.stockStatus === 'in_stock') {
            productsArray = productsArray.filter(p => p.warehouseStock > threshold);
          } else if (params.stockStatus === 'low_stock') {
            productsArray = productsArray.filter(p => p.warehouseStock > 0 && p.warehouseStock <= threshold);
          } else if (params.stockStatus === 'out_of_stock') {
            productsArray = productsArray.filter(p => p.warehouseStock === 0);
          }
        }
      }

      const page = params?.page || 1;
      const startIndex = (page - 1) * LIMIT;
      
      // Ambil LIMIT + 1 untuk mempertahankan kompatibilitas dengan UI.
      // (Memberitahu frontend bahwa masih ada halaman berikutnya)
      const endIndex = startIndex + LIMIT + 1; 

      // Memotong array menggunakan .slice() sangat ringan dan instan O(1)
      const paginatedData = productsArray.slice(startIndex, endIndex);

      return { success: true, data: paginatedData as Product[] };
      
    } catch (error) {
      console.error("Dexie Get All Products Error:", error);
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

  getDetailWithLogs: async (id: number | string): Promise<ApiResponse<ProductDetailWithLogs | null>> => {
    try {
      const numericId = Number(id);
      const product = await db.products.get(numericId);
      
      if (!product) {
        toast.error("Produk tidak ditemukan");
        return { success: false, data: null, message: "Produk tidak ditemukan" };
      }

      // Mengambil logs 1 bulan terakhir dan diurutkan berdasarkan createdAt
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const minDateStr = oneMonthAgo.toISOString();

      const logs = await db.inventoryLogs
        .where('[productId+createdAt]')
        .between([numericId, minDateStr], [numericId, Dexie.maxKey])
        .reverse()
        .toArray();

      return { 
        success: true, 
        data: { product, logs } 
      };
    } catch (error) {
      toast.error("Gagal memuat detail produk dan riwayat");
      return { success: false, data: null, message: "Gagal memuat detail produk dan riwayat" };
    }
  },

  create: async (data: ProductFormData): Promise<ApiResponse<Product | null>> => {
    const normalizedName = data.name.toLowerCase();
    
    const newProduct: Omit<DbProduct, 'id'> = {
      ...data,
      warehouseStock: 0,
      returnedStock: 0,
      normalizedName,
      isArchived: false
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
    
    if (!product || product.isArchived) return { success: false, data: null, message: "Produk tidak ditemukan" }
    
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
      if (error instanceof Dexie.ModifyError) {
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
    
    if (!product || product.isArchived) {
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

    await db.products.update(numericId, { isArchived: true });
    return { success: true, data: null };
  },

  restore: async (id: number | string): Promise<ApiResponse<null>> => {
    const numericId = Number(id);
    const product = await db.products.get(numericId);
    
    if (!product) {
      return { 
        success: false, 
        data: null, 
        message: "Produk tidak ditemukan" 
      };
    }

    await db.products.update(numericId, { isArchived: false });
    toast.success("Produk berhasil dipulihkan");
    return { success: true, data: null };
  },

  adjustStock: async (id: number | string, newStock: number, reason?: string): Promise<ApiResponse<Product | null>> => {
    const numericId = Number(id);
    
    try {
      let updatedProduct: Product | null = null;
      
      await db.transaction('rw', db.products, db.inventoryLogs, async () => {
        const product = await db.products.get(numericId);
        if (!product || product.isArchived) throw new Error("Produk tidak ditemukan");
        
        const diff = newStock - product.warehouseStock;
        
        if (diff !== 0) {
          await db.products.update(numericId, { warehouseStock: newStock });
          
          await db.inventoryLogs.add({
            productId: numericId,
            type: 'KOREKSI',
            quantity: diff,
            notes: reason || "Penyesuaian stok fisik",
            createdAt: new Date().toISOString()
          } as Omit<InventoryLog, 'id'>);
        }
        
        updatedProduct = await db.products.get(numericId) as Product;
      });
      
      toast.success("Stok berhasil disesuaikan");
      return { success: true, data: updatedProduct };
    } catch (error: any) {
      console.error("Dexie Adjust Stock Error:", error);
      toast.error(error.message || "Gagal menyesuaikan stok");
      return { success: false, data: null, message: error.message || "Gagal menyesuaikan stok" };
    }
  },

  addStock: async (id: number | string, addedStock: number, notes?: string): Promise<ApiResponse<Product | null>> => {
    const numericId = Number(id);
    
    if (addedStock <= 0) {
      toast.error("Jumlah stok tidak valid");
      return { success: false, data: null, message: "Jumlah stok tidak valid" };
    }

    try {
      let updatedProduct: Product | null = null;
      
      await db.transaction('rw', db.products, db.inventoryLogs, async () => {
        const product = await db.products.get(numericId);
        if (!product || product.isArchived) throw new Error("Produk tidak ditemukan");
        
        const newStock = product.warehouseStock + addedStock;
        await db.products.update(numericId, { warehouseStock: newStock });
        
        await db.inventoryLogs.add({
          productId: numericId,
          type: 'KULAKAN',
          quantity: addedStock,
          notes: notes || "Tambah stok dari agen",
          createdAt: new Date().toISOString()
        } as Omit<InventoryLog, 'id'>);
        
        updatedProduct = await db.products.get(numericId) as Product;
      });
      
      toast.success("Stok berhasil ditambah");
      return { success: true, data: updatedProduct };
    } catch (error: any) {
      console.error("Dexie Add Stock Error:", error);
      toast.error(error.message || "Gagal menambah stok");
      return { success: false, data: null, message: error.message || "Gagal menambah stok" };
    }
  },

  processReturn: async (
    id: number | string, 
    resaleQty: number, 
    wasteQty: number
  ): Promise<ApiResponse<Product | null>> => {
    const numericId = Number(id);
    
    if (resaleQty < 0 || wasteQty < 0) {
      toast.error("Jumlah tidak valid");
      return { success: false, data: null, message: "Jumlah tidak valid" };
    }
    
    if (resaleQty === 0 && wasteQty === 0) {
      return { success: true, data: null };
    }

    try {
      let updatedProduct: Product | null = null;
      
      await db.transaction('rw', db.products, db.inventoryLogs, async () => {
        const product = await db.products.get(numericId);
        if (!product || product.isArchived) throw new Error("Produk tidak ditemukan");
        
        const totalProcessed = resaleQty + wasteQty;
        if (totalProcessed > (product.returnedStock || 0)) {
          throw new Error("Jumlah melebihi stok retur yang ada");
        }
        
        const newReturnedStock = (product.returnedStock || 0) - totalProcessed;
        const newWarehouseStock = product.warehouseStock + resaleQty;
        
        await db.products.update(numericId, { 
          returnedStock: newReturnedStock,
          warehouseStock: newWarehouseStock 
        });
        
        const now = new Date();
        
        if (resaleQty > 0) {
          await db.inventoryLogs.add({
            productId: numericId,
            type: 'OLAH_RETUR',
            quantity: resaleQty,
            notes: "Siap jual, masuk kembali ke gudang",
            createdAt: now.toISOString()
          } as Omit<InventoryLog, 'id'>);
        }
        
        if (wasteQty > 0) {
          now.setMilliseconds(now.getMilliseconds() + 1);
          await db.inventoryLogs.add({
            productId: numericId,
            type: 'BUANG_RUSAK',
            quantity: -wasteQty,
            notes: "Basi/Rusak/Dibuang",
            createdAt: now.toISOString()
          } as Omit<InventoryLog, 'id'>);
        }
        
        updatedProduct = await db.products.get(numericId) as Product;
      });
      
      toast.success("Barang retur berhasil diproses");
      return { success: true, data: updatedProduct };
    } catch (error: any) {
      console.error("Dexie Process Return Error:", error);
      toast.error(error.message || "Gagal memproses barang retur");
      return { success: false, data: null, message: error.message || "Gagal memproses barang retur" };
    }
  },
}