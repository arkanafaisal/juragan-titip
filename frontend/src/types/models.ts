export interface User {
  id: number
  name: string
  email: string
  phone?: string  // <-- Tambahkan '?' di sini
  createdAt: string
}

export interface Product {
  id: number
  name: string
  normalizedName: string
  category: string
  costPrice: number
  wholesalePrice: number
  retailPrice: number
  warehouseStock: number
  description: string
}

export interface Store {
  id: number
  name: string
  ownerName: string
  phone: string
  address: string
  latitude: number
  longitude: number
  notes: string
  totalReceivable: number
}

export interface StorePrice {
  id: string
  storeId: string
  productId: string
  productName: string
  standardPrice: number
  customPrice: number
}

export interface Consignment {
  id: string
  storeId: string
  storeName: string
  items: ConsignmentItem[]
  status: "active" | "checked"
  createdAt: string
}

export interface ConsignmentItem {
  id: string
  productId: string
  productName: string
  quantity: number
  wholesalePrice: number
  retailPrice: number
}

export interface Visit {
  id: string
  storeId: string
  storeName: string
  items: OpnameItem[]
  totalBilled: number
  amountPaid: number
  previousReceivable: number
  documentNumber: string
  createdAt: string
}

export interface OpnameItem {
  productId: string
  productName: string
  sold: number
  returned: number
  remained: number
  wholesalePrice: number
}

export interface RestockItem {
  productId: string
  productName: string
  quantity: number
  wholesalePrice: number
  retailPrice: number
}


export interface Invoice {
  id: string
  visitId: string
  storeId: string
  storeName: string
  documentNumber: string
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
  retailPrice: number
}
