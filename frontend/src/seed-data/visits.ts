import type { Visit } from "@/types"

export const seedVisits: Visit[] = [
  {
    id: "visit-001",
    storeId: "store-001",
    storeName: "Toko Berkah",
    opnameItems: [
      { productId: "prod-001", productName: "Keripik Singkong", previousStock: 20, sold: 15, returned: 1, remaining: 4, wholesalePrice: 10000 },
      { productId: "prod-002", productName: "Sambal Matah", previousStock: 15, sold: 10, returned: 0, remaining: 5, wholesalePrice: 18000 },
      { productId: "prod-004", productName: "Dodol Garut", previousStock: 10, sold: 7, returned: 2, remaining: 1, wholesalePrice: 15000 },
    ],
    restockItems: [
      { productId: "prod-001", productName: "Keripik Singkong", quantity: 15, wholesalePrice: 10000, retailPrice: 15000 },
      { productId: "prod-002", productName: "Sambal Matah", quantity: 10, wholesalePrice: 18000, retailPrice: 22000 },
      { productId: "prod-003", productName: "Kopi Arabika", quantity: 5, wholesalePrice: 45000, retailPrice: 55000 },
    ],
    totalBilled: 435000,
    amountPaid: 435000,
    receivable: 0,
    previousReceivable: 0,
    documentNumber: "VIS-2026-0510-001",
    createdAt: "2026-05-10T09:00:00Z",
  },
  {
    id: "visit-002",
    storeId: "store-002",
    storeName: "Toko Makmur",
    opnameItems: [
      { productId: "prod-001", productName: "Keripik Singkong", previousStock: 25, sold: 18, returned: 0, remaining: 7, wholesalePrice: 12000 },
      { productId: "prod-005", productName: "Rengginang", previousStock: 20, sold: 12, returned: 3, remaining: 5, wholesalePrice: 10000 },
    ],
    restockItems: [
      { productId: "prod-001", productName: "Keripik Singkong", quantity: 20, wholesalePrice: 12000, retailPrice: 15000 },
      { productId: "prod-005", productName: "Rengginang", quantity: 15, wholesalePrice: 10000, retailPrice: 13000 },
    ],
    totalBilled: 336000,
    amountPaid: 200000,
    receivable: 136000,
    previousReceivable: 0,
    documentNumber: "VIS-2026-0514-001",
    createdAt: "2026-05-14T10:30:00Z",
  },
  {
    id: "visit-003",
    storeId: "store-003",
    storeName: "Toko Jaya",
    opnameItems: [
      { productId: "prod-004", productName: "Dodol Garut", previousStock: 15, sold: 5, returned: 3, remaining: 7, wholesalePrice: 15000 },
    ],
    restockItems: [
      { productId: "prod-004", productName: "Dodol Garut", quantity: 10, wholesalePrice: 15000, retailPrice: 18000 },
    ],
    totalBilled: 75000,
    amountPaid: 0,
    receivable: 75000,
    previousReceivable: 500000,
    documentNumber: "VIS-2026-0520-001",
    createdAt: "2026-05-20T14:00:00Z",
  },
]
