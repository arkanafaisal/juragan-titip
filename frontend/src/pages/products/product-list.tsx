import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Cookie, 
  Coffee, 
  Cake, 
  IceCream,
  Package,
  Pencil, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { productApi } from "@/services/api/products";
import type { Product } from "@/types";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getAll();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "bg-destructive";
    if (stock <= 20) return "bg-warning";
    return "bg-success";
  };

  const getStockTextColor = (stock: number) => {
    if (stock === 0) return "text-destructive";
    return "";
  };

  const renderIcon = (category: string) => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes("minuman") || lowerCat.includes("kopi") || lowerCat.includes("coffee")) return <Coffee className="w-6 h-6" strokeWidth={1.5} />;
    if (lowerCat.includes("kue") || lowerCat.includes("roti") || lowerCat.includes("cake")) return <Cake className="w-6 h-6" strokeWidth={1.5} />;
    if (lowerCat.includes("es") || lowerCat.includes("dessert") || lowerCat.includes("ice cream")) return <IceCream className="w-6 h-6" strokeWidth={1.5} />;
    if (lowerCat.includes("snack") || lowerCat.includes("makanan") || lowerCat.includes("keripik")) return <Cookie className="w-6 h-6" strokeWidth={1.5} />;
    
    return <Package className="w-6 h-6" strokeWidth={1.5} />;
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-text-primary">Daftar Produk</h2>
          <p className="font-body text-body text-text-secondary mt-xs">Kelola inventaris dan harga produk Anda.</p>
        </div>
        <button className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs">
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-surface rounded-xl shadow-sm p-md border border-border flex flex-col md:flex-row gap-md items-center justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input 
            className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body text-body bg-surface-container-lowest outline-none" 
            placeholder="Cari nama produk..." 
            type="text" 
          />
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <select className="flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            <option value="">Semua Kategori</option>
            <option value="Makanan Ringan">Makanan Ringan</option>
            <option value="Minuman">Minuman</option>
          </select>
          <select className="flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            <option value="">Status Stok</option>
            <option value="in_stock">Tersedia</option>
            <option value="low_stock">Menipis</option>
            <option value="out_of_stock">Habis</option>
          </select>
          <button className="p-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-text-secondary flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Nama Produk</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Kategori</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Stok</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-right">HPP</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-right">Harga Grosir</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body text-body text-text-primary divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-lg text-center text-text-secondary">Memuat data produk...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-lg text-center text-text-secondary">Tidak ada produk ditemukan.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-md px-md flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-fixed-dim shrink-0">
                        {renderIcon(product.category)}
                      </div>
                      <span className="font-medium whitespace-nowrap">{product.name}</span>
                    </td>
                    <td className="py-md px-md text-text-secondary whitespace-nowrap">{product.category}</td>
                    <td className="py-md px-md">
                      <div className="flex items-center gap-xs">
                        <div className={`w-2 h-2 rounded-full ${getStockStatusColor(product.warehouseStock)}`}></div>
                        <span className={`font-data-md text-data-md ${getStockTextColor(product.warehouseStock)}`}>{product.warehouseStock}</span>
                      </div>
                    </td>
                    <td className="py-md px-md text-right font-data-md text-data-md whitespace-nowrap">{formatCurrency(product.costPrice)}</td>
                    <td className="py-md px-md text-right font-data-md text-data-md whitespace-nowrap">{formatCurrency(product.wholesalePrice)}</td>
                    <td className="py-md px-md text-center">
                      <button className="text-text-muted hover:text-primary transition-colors p-xs lg:opacity-0 lg:group-hover:opacity-100 opacity-100 focus:opacity-100">
                        <Pencil className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-md py-sm border-t border-border bg-surface-container-lowest gap-sm">
          <span className="font-caption text-caption text-text-secondary">Menampilkan 1-{products.length} dari {products.length} produk</span>
          <div className="flex gap-xs">
            <button className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-sm py-xs rounded bg-primary-container text-on-primary-container font-body-sm text-body-sm font-medium">1</button>
            <span className="px-sm py-xs text-text-secondary font-body-sm text-body-sm">...</span>
            <button className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50" disabled>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}