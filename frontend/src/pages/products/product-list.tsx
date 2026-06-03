import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { productApi } from "@/services/api/products";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Pagination } from "@/components/shared/pagination";
import { LIMIT } from "@/lib/constants";
import { ActionToolbar, type FilterGroup } from "@/components/shared/action-toolbar";
import { settingsApi } from "@/services/api/settings";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    // sortBy: "name_asc"
  });
  const categoryLabels = settingsApi.getCategoryLabels();

  const storeFilterConfig: FilterGroup[] = [
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
        { label: "Habis", value: "out_of_stock" },
        { label: "Menipis", value: "low_stock" },
        { label: "Tersedia", value: "in_stock" }
      ]
    },
    // {
    //   id: "sortBy",
    //   title: "Urutkan Berdasarkan",
    //   options: [
    //     { label: "Nama (A-Z)", value: "name_asc" },
    //     { label: "Terbaru Ditambahkan", value: "newest" }
    //   ]
    // }
  ];

    const handleFilterChange = (groupId: string, value: string) => {
      setFilters(prev => ({
        ...prev,
        [groupId]: value
      }))
    };
  
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
  }, [debouncedSearch, filters]);

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
    <div className="flex flex-col">
    
        <ActionToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Cari toko mitra..."
          onAddClick={handleOpenAdd}
          onSettingClick={() => navigate("/settings?section=produk")}
          
          // Cukup passing 3 baris ini, Boom! Filter beres.
          filterGroups={storeFilterConfig}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />

      
      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data produk...</div>
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