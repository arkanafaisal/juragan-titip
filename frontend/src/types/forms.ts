export interface ProductFormData {
  name: string
  category: string
  costPrice: number
  wholesalePrice: number
  retailPrice: number
  warehouseStock: number
  description: string
}

export interface StoreFormData {
  name: string
  ownerName: string
  phone: string
  address: string
  latitude: number
  longitude: number
  notes: string
}

export interface OpnameFormData {
  items: Array<{
    productId: string
    sold: number
    returned: number
  }>
}

export interface RestockFormData {
  items: Array<{
    productId: string
    quantity: number
  }>
}

export interface CheckoutFormData {
  amountPaid: number
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  phone?: string  
  password: string
  confirmPassword: string
}
