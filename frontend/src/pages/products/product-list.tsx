import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { productApi } from "@/services/api/products";
import { ItemCard } from "@/components/shared/item-card";
import type { Product } from "@/types";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Pagination } from "@/components/shared/pagination";
import { LIMIT } from "@/lib/constants";
import { ActionToolbar, type FilterGroup } from "@/components/shared/action-toolbar";
import { settingsApi } from "@/services/api/settings";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchInput = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const filters = useMemo(() => ({
    category: searchParams.get('category') || "",
    stock: searchParams.get('stock') || ""
  }), [searchParams]);

  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const categoryLabels = settingsApi.getCategoryLabels();
  const lowStockThreshold = settingsApi.getLowStockThreshold();

  const storeFilterConfig: FilterGroup[] = useMemo(() => [
    {
      id: "category",
      title: "Kategori Produk",
      options: [
        { label: "Semua", value: "" },
        { label: categoryLabels["1"], value: "1" },
        { label: categoryLabels["2"], value: "2" },
        { label: categoryLabels["3"], value: "3" },
        { label: categoryLabels["4"], value: "4" },
        { label: categoryLabels["5"], value: "5" }
      ]
    },
    {
      id: "stock",
      title: "level stock",
      options: [
        { label: "Semua", value: "" },
        { label: "0", value: "out_of_stock" },
        { label: `1-${lowStockThreshold}`, value: "low_stock" },
        { label: `>${lowStockThreshold}`, value: "in_stock" }
      ]
    }
  ], [categoryLabels, lowStockThreshold]);

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };

  const handleFilterChange = useCallback((groupId: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(groupId, value);
    else newParams.delete(groupId);
    
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams, { replace: true });
  };

  
  const [productToDelete, setProductToDelete] = useState<{ id: number, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productApi.getAll({
        search: debouncedSearch,
        category: filters.category,
        stockStatus: filters.stock,
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
    
  }, [debouncedSearch, filters, currentPage]);

  const handleOpenAdd = () => {
    navigate("/product/new");
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
    <div className="flex flex-col">
    
      <div className="sticky top-[-16px] z-20 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest/90 to-transparent -mx-4 px-4 pt-4 pb-8 -mb-4">
        <ActionToolbar
          className="mb-0"
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Cari produk..."
          onAddClick={handleOpenAdd}
          onSettingClick={() => navigate("/settings?section=produk")}
          
          // Cukup passing 3 baris ini, Boom! Filter beres.
          filterGroups={storeFilterConfig}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      
      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data produk...</div>
        </div>
      ) : products.length === 0? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="text-text-secondary font-body text-body">Pencarian tidak menemukan produk.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1   gap-md">
          {products.map((product, index) => {
            if(index >= LIMIT){return}
            return (
              <ItemCard
                key={product.id}
                product={product}
                categoryLabels={categoryLabels}
                lowStockThreshold={lowStockThreshold}
              />
            );
          })}
        </div>
      )}

      
      {!isLoading && products.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          hasNextPage={products.length > LIMIT}
          onPageChange={handlePageChange}
        />
      )}


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