export const APP_NAME = "JuraganTitip"
export const APP_DESCRIPTION = "Kelola bisnis konsinyasi Anda"

export const STORAGE_KEYS = {
  AUTH_USER: "jt_auth_user",
  AUTH_TOKEN: "jt_auth_token",
  PRODUCTS: "jt_products",
  STORES: "jt_stores",
  STORE_PRICES: "jt_store_prices",
  VISITS: "jt_visits",
  INVOICES: "jt_invoices",
  CONSIGNMENTS: "jt_consignments",
  SIDEBAR_STATE: "jt_sidebar_state",
  THEME: "jt_theme",
} as const

export const PRODUCT_CATEGORIES = [
  "Makanan Ringan",
  "Minuman",
  "Bumbu & Sambal",
  "Kue & Roti",
  "Frozen Food",
  "Kerajinan",
  "Lainnya",
] as const

export const STOCK_THRESHOLDS = {
  SAFE: 50,
  LOW: 10,
} as const

export const LIMIT = 12


export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  PRODUCT_NEW: "/products/new",
  PRODUCT_DETAIL: "/products/:id",
  PRODUCT_EDIT: "/products/:id/edit",
  STORES: "/stores",
  STORE_NEW: "/stores/new",
  STORE_DETAIL: "/stores/:id",
  STORE_EDIT: "/stores/:id/edit",
  STORE_VISIT: "/stores/:id/visit",
  INVOICES: "/finance/invoices",
  INVOICE_DETAIL: "/finance/invoices/:id",
  RECEIVABLES: "/finance/receivables",
  REPORT_STORES: "/reports/stores",
  REPORT_TRACKING: "/reports/tracking",
  REPORT_FINANCIAL: "/reports/financial",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_PREFERENCES: "/settings/preferences",
} as const
