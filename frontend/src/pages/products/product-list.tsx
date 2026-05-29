import { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { productApi } from "@/services/api/products";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Pagination } from "@/components/shared/pagination";
import { LIMIT } from "@/lib/constants";

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

  
  // const displayProducts = products.slice(0, LIMIT); 
  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      

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

      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Menyelaraskan data produk...</div>
        </div>
      ) : products.length === 0? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="text-text-secondary font-body text-body">Pencarian tidak menemukan produk.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {products.map((product, index) => {
            if(index >= LIMIT){return}
            return (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEdit}
                onDelete={setProductToDelete}
              />
            );
          })}
        </div>
      )}

      
      {!isLoading && products.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          hasNextPage={products.length > LIMIT}
          onPageChange={(page) => setCurrentPage(page)}
        />
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