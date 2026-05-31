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
  retailPrice: number
  warehouseStock: number
  description: string
}

export interface Store {
  id: number
  name: string
  normalizedName: string
  ownerName: string
  phone?: string
  address: string
  latitude: number
  longitude: number
  notes: string
  debt: number
  assetValue: number
  lastVisitAt?: string
  category: "1" | "2" | "3" | "4" | "5"
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
  wholesalePrice: number
}

export interface RestockItem {
  productId: number
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
