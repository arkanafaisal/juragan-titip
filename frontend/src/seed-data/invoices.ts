import type { Invoice } from "@/types"

export const seedInvoices: Invoice[] = [
  {
    id: "inv-001",
    visitId: "visit-001",
    storeId: "store-001",
    storeName: "Toko Berkah",
    documentNumber: "VIS-2026-0510-001",
    billedItems: [
      { productName: "Keripik Singkong", quantity: 15, price: 10000, total: 150000 },
      { productName: "Sambal Matah", quantity: 10, price: 18000, total: 180000 },
      { productName: "Dodol Garut", quantity: 7, price: 15000, total: 105000 },
    ],
    subtotal: 435000,
    previousReceivable: 0,
    totalDue: 435000,
    amountPaid: 435000,
    remainingReceivable: 0,
    activeStock: [
      { productName: "Keripik Singkong", remaining: 4, restocked: 15, totalActive: 19, retailPrice: 15000 },
      { productName: "Sambal Matah", remaining: 5, restocked: 10, totalActive: 15, retailPrice: 22000 },
      { productName: "Dodol Garut", remaining: 1, restocked: 0, totalActive: 1, retailPrice: 18000 },
      { productName: "Kopi Arabika", remaining: 0, restocked: 5, totalActive: 5, retailPrice: 55000 },
    ],
    createdAt: "2026-05-10T09:00:00Z",
  },
  {
    id: "inv-002",
    visitId: "visit-002",
    storeId: "store-002",
    storeName: "Toko Makmur",
    documentNumber: "VIS-2026-0514-001",
    billedItems: [
      { productName: "Keripik Singkong", quantity: 18, price: 12000, total: 216000 },
      { productName: "Rengginang", quantity: 12, price: 10000, total: 120000 },
    ],
    subtotal: 336000,
    previousReceivable: 0,
    totalDue: 336000,
    amountPaid: 200000,
    remainingReceivable: 136000,
    activeStock: [
      { productName: "Keripik Singkong", remaining: 7, restocked: 20, totalActive: 27, retailPrice: 15000 },
      { productName: "Rengginang", remaining: 5, restocked: 15, totalActive: 20, retailPrice: 13000 },
    ],
    createdAt: "2026-05-14T10:30:00Z",
  },
  {
    id: "inv-003",
    visitId: "visit-003",
    storeId: "store-003",
    storeName: "Toko Jaya",
    documentNumber: "VIS-2026-0520-001",
    billedItems: [
      { productName: "Dodol Garut", quantity: 5, price: 15000, total: 75000 },
    ],
    subtotal: 75000,
    previousReceivable: 500000,
    totalDue: 575000,
    amountPaid: 0,
    remainingReceivable: 575000,
    activeStock: [
      { productName: "Dodol Garut", remaining: 7, restocked: 10, totalActive: 17, retailPrice: 18000 },
    ],
    createdAt: "2026-05-20T14:00:00Z",
  },
]
