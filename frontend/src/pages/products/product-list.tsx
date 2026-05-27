import React, { useState, useEffect } from "react";
import { 
  Plus, Search, SlidersHorizontal, Cookie, Coffee, 
  Utensils, Package, Pencil, Trash2, ChevronLeft, ChevronRight 
} from "lucide-react";
import { productApi } from "@/services/api/products";
import type { Product } from "@/types";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter & Search State
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Delete State
  const [productToDelete, setProductToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page kembali ke 1 setiap kali ada filter yang berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productApi.getAll({
        search: debouncedSearch,
        category: categoryFilter,
        stockStatus: stockFilter,
        page: currentPage
      });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categoryFilter, stockFilter, currentPage]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = async (typedName?: string) => {
    if (!productToDelete || !typedName) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await productApi.delete(productToDelete.id, typedName);
      if (response.success) {
        setProductToDelete(null);
        fetchProducts();
      } else {
        setDeleteError(response.message || "Gagal menghapus produk");
      }
    } catch (error) {
      setDeleteError("Terjadi kesalahan sistem saat menghapus produk.");
      console.error("Gagal menghapus produk:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper Pagination Logic (Sistem Trik 6 Item)
  const displayProducts = products.slice(0, 5); // Hanya tampilkan max 5
  const hasNextPage = products.length > 5;      // Jika API mengembalikan 6 item, berarti ada Next
  const hasPrevPage = currentPage > 1;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "bg-error";
    if (stock <= 20) return "bg-warning";
    return "bg-success";
  };

  const getStockTextColor = (stock: number) => {
    if (stock === 0) return "text-error font-bold";
    if (stock <= 20) return "text-warning font-bold";
    return "text-success font-medium";
  };

  const getCategoryStyles = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat === "minuman") return { bg: "bg-info/10", text: "text-info", icon: <Coffee className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "basah") return { bg: "bg-success/10", text: "text-success", icon: <Utensils className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "kering") return { bg: "bg-warning/10", text: "text-warning", icon: <Cookie className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "non-makanan") return { bg: "bg-secondary/10", text: "text-secondary", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
    return { bg: "bg-surface-variant", text: "text-on-surface-variant", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-text-primary">Daftar Produk</h2>
          <p className="font-body text-body text-text-secondary mt-xs">Kelola inventaris dan harga produk Anda.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-sm p-md border border-border flex flex-col md:flex-row gap-md items-center justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body text-body bg-surface-container-lowest outline-none transition-all" 
            placeholder="Cari nama produk..." 
            type="text" 
          />
        </div>
        {/* RESPONSIVITAS FILTER DIPERBAIKI DI SINI: flex-col sm:flex-row dan w-full */}
        <div className="flex flex-col sm:flex-row gap-sm w-full md:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option value="kering">Kering</option>
            <option value="basah">Basah</option>
            <option value="minuman">Minuman</option>
            <option value="non-makanan">Non-Makanan</option>
          </select>
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full sm:w-auto flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
          >
            <option value="">Status Stok</option>
            <option value="in_stock">Tersedia {'>'} 20</option>
            <option value="low_stock">Menipis (1-20)</option>
            <option value="out_of_stock">Habis (0)</option>
          </select>
          <button 
            title="Filter Lanjutan (Segera Hadir)"
            className="w-full sm:w-auto p-sm border border-outline-variant rounded-lg bg-surface-container-low text-text-muted opacity-50 cursor-not-allowed flex items-center justify-center"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
        <div className="overflow-x-auto pb-32 -mb-32">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left">Nama Produk</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left">Kategori</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left">Stok</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left">HPP</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left">Harga Grosir</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-left w-[120px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body text-body text-text-primary divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-lg text-center text-text-secondary">
                    <div className="animate-pulse">Menyelaraskan data produk...</div>
                  </td>
                </tr>
              ) : displayProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-lg text-center text-text-secondary">
                    Pencarian tidak menemukan produk.
                  </td>
                </tr>
              ) : (
                displayProducts.map((product) => {
                  const catStyle = getCategoryStyles(product.category);
                  
                  return (
                    <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-md text-left">
                        <div className="flex items-center gap-md">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${catStyle.bg} ${catStyle.text}`}>
                            {catStyle.icon}
                          </div>
                          
                          <div className="relative group/tooltip outline-none" tabIndex={0}>
                            <span className="font-medium whitespace-nowrap cursor-help border-b border-dashed border-outline-variant pb-0.5">
                              {product.name}
                            </span>
                            <div className="absolute z-50 left-0 top-full mt-2 hidden group-hover/tooltip:block group-focus/tooltip:block bg-surface-elevated text-on-surface p-sm rounded-lg shadow-md border border-outline-variant w-64 text-caption font-normal whitespace-normal break-words pointer-events-none">
                              {product.description || "Tidak ada deskripsi untuk produk ini."}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-md px-md text-left">
                        <span className={`px-2 py-1 rounded text-caption font-medium ${catStyle.bg} ${catStyle.text} capitalize`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="py-md px-md text-left">
                        <div className="flex items-center gap-xs">
                          <div className={`w-2 h-2 rounded-full ${getStockStatusColor(product.warehouseStock)}`}></div>
                          <span className={`font-data-md text-data-md ${getStockTextColor(product.warehouseStock)}`}>
                            {product.warehouseStock}
                          </span>
                        </div>
                      </td>
                      <td className="py-md px-md text-left font-data-md text-data-md whitespace-nowrap">
                        {formatCurrency(product.costPrice)}
                      </td>
                      <td className="py-md px-md text-left font-data-md text-data-md whitespace-nowrap">
                        {formatCurrency(product.wholesalePrice)}
                      </td>
                      <td className="py-md px-md text-left">
                        <div className="flex items-center gap-xs">
                          <button 
                            onClick={() => handleOpenEdit(product)}
                            className="text-warning hover:bg-warning/20 transition-colors p-sm rounded-md"
                            title="Edit Produk"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                            className="text-error hover:bg-error/20 transition-colors p-sm rounded-md"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-md py-sm border-t border-border bg-surface-container-lowest gap-sm">
          <span className="font-caption text-caption text-text-secondary">
            {displayProducts.length > 0 
              ? `Menampilkan ${(currentPage - 1) * 5 + 1}-${(currentPage - 1) * 5 + displayProducts.length} produk`
              : "Menampilkan 0 produk"
            }
          </span>
          <div className="flex gap-xs">
            <button 
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={!hasPrevPage}
              className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-sm py-xs rounded bg-primary-container text-on-primary-container font-body-sm text-body-sm font-medium">
              {currentPage}
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!hasNextPage}
              className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchProducts}
        product={editingProduct}
      />

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => {
          setProductToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Produk"
        description="Tindakan ini permanen. Histori barang ini di invoice sebelumnya tetap aman, namun Anda tidak bisa lagi menambahkannya ke kunjungan baru."
        isDanger={true}
        confirmText="Hapus Produk"
        isLoading={isDeleting}
        verificationText={productToDelete?.name}
        verificationLabel={
          <>Ketik persis <span className="font-bold text-text-primary select-none">{productToDelete?.name}</span> untuk konfirmasi:</>
        }
        errorMessage={deleteError}
        onClearError={() => setDeleteError(null)}
      />
    </div>
  );
}