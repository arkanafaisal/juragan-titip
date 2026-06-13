export const getStoreFilterGroups = (storeCategoryLabels: Record<string, string>, overdueDays: number) => {
  return [
    {
      id: "category",
      title: "Kategori Toko",
      options: [
        { label: "Semua", value: "" },
        ...Object.entries(storeCategoryLabels).map(([key, label]) => ({
          label,
          value: key
        }))
      ]
    },
    {
      id: "status",
      title: "Status Operasional",
      options: [
        { label: "Semua", value: "" },
        { label: "Lunas", value: "lunas" },
        { label: "Piutang", value: "piutang" }
      ]
    },
    {
      id: "visitStatus",
      title: "Kunjungan Toko",
      options: [
        { label: "Semua", value: "" },
        { label: `> ${overdueDays} Hari`, value: "overdue" }
      ]
    },
    {
      id: "sortBy",
      title: "Urutkan Berdasarkan",
      options: [
        { label: "Default (A-Z)", value: "" },
        { label: "Kunjungan Terbaru", value: "lastVisitDesc" },
        { label: "Kunjungan Terlama", value: "lastVisitAsc" }
      ]
    },
    {
      id: "isArchived",
      title: "Status Arsip",
      options: [
        { label: "Aktif", value: "" },
        { label: "Diarsipkan", value: "true" }
      ]
    }
  ];
};

export const getProductFilterGroups = (categoryLabels: Record<string, string>, lowStockThreshold: number) => {
  return [
    {
      id: "category",
      title: "Kategori Produk",
      options: [
        { label: "Semua", value: "" },
        ...Object.entries(categoryLabels).map(([key, label]) => ({
          label,
          value: key
        }))
      ]
    },
    {
      id: "stock",
      title: "Level Stok",
      options: [
        { label: "Semua", value: "" },
        { label: "0", value: "out_of_stock" },
        { label: `1-${lowStockThreshold}`, value: "low_stock" },
        { label: `>${lowStockThreshold}`, value: "in_stock" }
      ]
    },
    {
      id: "isArchived",
      title: "Status Arsip",
      options: [
        { label: "Aktif", value: "" },
        { label: "Diarsipkan", value: "true" }
      ]
    }
  ];
};
