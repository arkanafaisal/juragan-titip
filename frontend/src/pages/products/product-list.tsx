import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Cookie, 
  Coffee, 
  Utensils,
  Package,
  Pencil, 
  Trash2,
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
    if (cat === "beverage") return { bg: "bg-blue-100", text: "text-blue-600", icon: <Coffee className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "food") return { bg: "bg-emerald-100", text: "text-emerald-600", icon: <Utensils className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "snack") return { bg: "bg-amber-100", text: "text-amber-600", icon: <Cookie className="w-5 h-5" strokeWidth={1.5} /> };
    if (cat === "non-food") return { bg: "bg-purple-100", text: "text-purple-600", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
    
    return { bg: "bg-surface-variant", text: "text-on-surface-variant", icon: <Package className="w-5 h-5" strokeWidth={1.5} /> };
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
            className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body text-body bg-surface-container-lowest outline-none transition-all" 
            placeholder="Cari nama produk..." 
            type="text" 
          />
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <select className="flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
            <option value="">Semua Kategori</option>
            <option value="snack">Snack</option>
            <option value="food">Food</option>
            <option value="beverage">Beverage</option>
            <option value="non-food">Non-Food</option>
          </select>
          <select className="flex-1 md:flex-none border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
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
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Nama Produk</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Kategori</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold">Stok</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-right">HPP</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-right">Harga Grosir</th>
                <th className="font-caption text-caption text-text-secondary py-sm px-md font-semibold text-right">Aksi</th>
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
                products.map((product) => {
                  const catStyle = getCategoryStyles(product.category);
                  
                  return (
                    <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-md">
                        <div className="flex items-center gap-md">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${catStyle.bg} ${catStyle.text}`}>
                            {catStyle.icon}
                          </div>
                          
                          {/* Nama Produk dengan Deskripsi Popup */}
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
                      <td className="py-md px-md">
                        <span className={`px-2 py-1 rounded text-caption font-medium ${catStyle.bg} ${catStyle.text} capitalize`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="py-md px-md">
                        <div className="flex items-center gap-xs">
                          <div className={`w-2 h-2 rounded-full ${getStockStatusColor(product.warehouseStock)}`}></div>
                          <span className={`font-data-md text-data-md ${getStockTextColor(product.warehouseStock)}`}>
                            {product.warehouseStock}
                          </span>
                        </div>
                      </td>
                      <td className="py-md px-md text-right font-data-md text-data-md whitespace-nowrap">
                        {formatCurrency(product.costPrice)}
                      </td>
                      <td className="py-md px-md text-right font-data-md text-data-md whitespace-nowrap">
                        {formatCurrency(product.wholesalePrice)}
                      </td>
                      <td className="py-md px-md text-right">
                        <div className="flex items-center justify-end gap-xs">
                          <button 
                            className="text-text-secondary hover:bg-primary-container hover:text-primary transition-colors p-sm rounded-md"
                            title="Edit Produk"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-text-secondary hover:bg-error-container hover:text-error transition-colors p-sm rounded-md"
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-md py-sm border-t border-border bg-surface-container-lowest gap-sm">
          <span className="font-caption text-caption text-text-secondary">
            Menampilkan 1-{products.length} dari {products.length} produk
          </span>
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