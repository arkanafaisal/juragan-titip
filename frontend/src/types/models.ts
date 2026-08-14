export interface User {
  id: number
  name: string
  email: string
  phone?: string  
  createdAt: string
}

export interface Product {
  id: number
  name: string
  normalizedName: string
  category: "1" | "2" | "3" | "4" | "5" 
  costPrice: number
  wholesalePrice: number
  retailPrice?: number
  warehouseStock: number
  returnedStock: number
  description: string
  isArchived: boolean
}

export interface Store {
  id: number
  name: string
  normalizedName: string
  ownerName?: string
  phone?: string
  latitude: number
  longitude: number
  notes: string
  debt: number
  assetValue: number
  lastVisitAt: string
  category: "1" | "2" | "3" | "4" | "5"
  isArchived: boolean
}

export interface StorePrice {
  id: string
  storeId: string
  productId: string
  productName: string
  standardPrice: number
  customPrice: number
}

export interface Visit {
  id: number
  storeId: number
  storeName: string
  items: OpnameItem[]
  amountPaid: number
  currentDebt: number
  createdAt: string
}

export interface OpnameItem {
  productId: number
  productName: string
  sold: number
  returned: number
  remained: number
  costPrice: number;
  wholesalePrice: number
}

export interface RestockItem {
  productId: number
  productName: string
  quantity: number
  costPrice: number
  wholesalePrice: number
}


export interface Invoice {
  id: string
  visitId: string
  storeId: string
  storeName: string
  billedItems: BilledItem[]
  subtotal: number
  previousReceivable: number
  totalDue: number
  amountPaid: number
  remainingReceivable: number
  activeStock: ActiveStockItem[]
  createdAt: string
}

export interface BilledItem {
  productName: string
  quantity: number
  price: number
  total: number
}

export interface ActiveStockItem {
  productName: string
  remaining: number
  restocked: number
  totalActive: number
  wholesalePrice: number
}

// 1. Kita kunci tipe aktivitasnya agar tidak ada typo di database
export type InventoryActionType = 
  | 'KULAKAN'      // (IN) Nambah stok utama dari agen/pabrik
  | 'TITIPAN'      // (OUT) Mengurangi stok utama karena dibawa/dititip ke toko
  | 'TARIK_RETUR'  // (IN) Nambah stok retur karena ditarik dari toko
  | 'OLAH_RETUR'   // (RESTORE) Mengurangi stok retur, menambah stok utama (barang masih bagus)
  | 'BUANG_RUSAK' // (DISCARD) Mengurangi stok (utama/retur) menjadi debu (rugi)
  | 'KOREKSI';     // (ADJUST) Penyesuaian stok (bisa plus/minus) karena salah ketik/selisih hitung

// 2. Skema Tabel InventoryLog
export interface InventoryLog {
  id: number;
  productId: number;
  
  type: InventoryActionType;

  // Catatan: Selalu positif untuk tipe lain, tapi BISA MINUS/PLUS khusus untuk tipe 'KOREKSI'
  quantity: number; 
  
  storeId?: number;
  storeName?: string; 
  
  // Contoh: "Dimakan tikus", "Basi", "Nota Kulakan: INV-001"
  notes?: string;
  createdAt: string; 
}
