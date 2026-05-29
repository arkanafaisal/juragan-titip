import { useState, useEffect } from "react";
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
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  
  
  const [currentPage, setCurrentPage] = useState(1);

  
  const [productToDelete, setProductToDelete] = useState<{ id: number, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  
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

  
  const displayProducts = products.slice(0, 6); 
  const hasNextPage = products.length > 6;      
  const hasPrevPage = currentPage > 1;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStockBlockStyles = (stock: number) => {
    if (stock === 0) return "bg-error/10 text-error border-error/20";
    if (stock <= 20) return "bg-warning/10 text-warning-dark border-warning/20"; 
    return "bg-success/10 text-success border-success/20";
  };

  const getCategoryStyles = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat === "minuman") return { bg: "bg-info/10", text: "text-info", border: "border-info/40", icon: <Coffee className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "basah") return { bg: "bg-success/10", text: "text-success", border: "border-success/40", icon: <Utensils className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "kering") return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/40", icon: <Cookie className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "non-makanan") return { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/40", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
    return { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <p className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary">Kelola inventaris dan harga produk Anda.</p>
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
            placeholder="Kripik Singkong Balado..." 
            type="text" 
          />
        </div>
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

      
      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Menyelaraskan data produk...</div>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="text-text-secondary font-body text-body">Pencarian tidak menemukan produk.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {displayProducts.map((product) => {
            const catStyle = getCategoryStyles(product.category);
            const stockStyle = getStockBlockStyles(product.warehouseStock);
            
            return (
              <div key={product.id} className={`bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden border-[1.5px] ${catStyle.border}`}>
                <div className="p-md flex-1 flex flex-col">
                  
                  <div className="flex items-start justify-between mb-md gap-3">
                    <div className="flex items-start gap-sm">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${catStyle.bg} ${catStyle.text}`}>
                        {catStyle.icon}
                      </div>
                      <div>
                        <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{product.name}</h3>
                        <p className="font-caption text-caption text-text-secondary mt-0.5 line-clamp-2">
                          {product.description || "Tidak ada deskripsi."}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase shrink-0 ${catStyle.bg} ${catStyle.text}`}>
                      {product.category}
                    </span>
                  </div>

                  
                  <div className="grid grid-cols-2 gap-sm mb-md mt-auto">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-caption text-caption text-text-secondary">HPP</span>
                      <span className="font-data-md text-data-md text-text-primary">{formatCurrency(product.costPrice)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-caption text-caption text-text-secondary">Harga Grosir</span>
                      <span className="font-data-md text-data-md text-text-primary">{formatCurrency(product.wholesalePrice)}</span>
                    </div>
                  </div>

                  
                  <div className={`rounded-lg p-sm flex items-center justify-between border ${stockStyle}`}>
                    <div className="flex items-center gap-xs font-body-sm text-body-sm font-medium">
                      <Package className="w-4 h-4 shrink-0" />
                      Stok di Gudang
                    </div>
                    <span className="font-data-md text-data-md font-bold">{product.warehouseStock}</span>
                  </div>
                </div>

                
                <div className="p-sm bg-surface-bright border-t border-outline-variant flex gap-sm">
                  <button 
                    onClick={() => handleOpenEdit(product)} 
                    className="flex-1 border border-outline-variant text-text-secondary hover:text-warning hover:bg-warning/10 hover:border-warning/50 font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => setProductToDelete({ id: product.id, name: product.name })} 
                    className="flex-1 border border-outline-variant text-text-secondary hover:text-error hover:bg-error/10 hover:border-error/50 font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {!isLoading && displayProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-md py-sm bg-surface rounded-xl border border-border shadow-sm gap-sm">
          <span className="font-caption text-caption text-text-secondary">
            Menampilkan {(currentPage - 1) * 6 + 1}-{(currentPage - 1) * 6 + displayProducts.length} produk
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
      )}

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