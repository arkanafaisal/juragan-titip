import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, Package, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { NumberInput } from "@/components/shared/number-input";
import type { Product, RestockItem } from "@/types";
import { productApi } from "@/services/api/products";

interface StepRestockProps {
  allProducts: Product[];
  restockItems: (RestockItem & { _warehouseStock: number })[];
  suggestedProducts: ({ id: number; name: string } | Product)[];
  handleAddRestock: (product: Product | { id: number; name: string }) => void;
  handleRestockQuantity: (productId: number, qty: number) => void;
  handleRemoveRestock: (productId: number) => void;
  onNext: () => void;
  onPrev: () => void;
  formatCurrency: (value: number) => string;
}

export function StepRestock({ 
  allProducts, restockItems, suggestedProducts, handleAddRestock, 
  handleRestockQuantity, handleRemoveRestock, 
  onNext, onPrev, formatCurrency 
}: StepRestockProps) {
  const [searchProduct, setSearchProduct] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async () => {
    if (!searchProduct.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await productApi.getById(searchProduct);
      if (response.success && response.data) {
        handleAddRestock(response.data);
        setSearchProduct("");
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!searchProduct) {
      setDebouncedSearch("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchProduct);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchProduct]);

  useEffect(() => {
    const fetchSearchedProducts = async () => {
      if (!debouncedSearch) {
        setSearchedProducts([]);
        return;
      }
      setIsSearching(true);
      try {
        let foundProducts: Product[] = [];
        if (!isNaN(Number(debouncedSearch))) {
          const byIdResponse = await productApi.getById(debouncedSearch);
          if (byIdResponse.success && byIdResponse.data) {
            foundProducts = [byIdResponse.data];
          }
        }
        if (foundProducts.length === 0) {
          const response = await productApi.getAll({ search: debouncedSearch });
          if (response.success) {
            foundProducts = response.data;
          }
        }
        setSearchedProducts(foundProducts);
      } catch (error) {
        console.error("Gagal mencari produk:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSearchedProducts();
  }, [debouncedSearch]);

  const displayProducts = debouncedSearch ? searchedProducts : allProducts;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-md">
      
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-md border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-body  text-body  font-bold text-text-primary mb-md">Cari atau pilih produk dari gudang utama yang akan dititipkan hari ini.</h3>
          
          <div
            className="relative w-full max-w-[484px] flex gap-2" 
            tabIndex={-1} 
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setIsDropdownOpen(false);
            }}
          >
            <div className="relative flex-1 cursor-pointer" onClick={() => setIsDropdownOpen(true)}>
              <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4   text-text-muted pointer-events-none" />
              <input 
                value={searchProduct}
                onChange={(e) => {
                  setSearchProduct(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Nama Produk..."
                className="w-full pl-xl pr-10 py-sm  bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body text-body transition-all"
                autoComplete="off"
              />
              <ChevronDown className="absolute right-sm top-1/2 -translate-y-1/2 w-4 h-4   text-text-muted pointer-events-none" />
            </div>

            <button
              onClick={handleSearchSubmit}
              disabled={isSearching || !searchProduct.trim()}
              className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-lg font-body font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Tambah
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-surface-elevated border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                {isSearching ? (
                  <div className="p-md text-center text-text-secondary font-body-sm text-body-sm flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Mencari produk...
                  </div>
                ) : displayProducts.length > 0 ? (
                  displayProducts.map(p => (
                    <div 
                      key={p.id} 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleAddRestock(p);
                        setIsDropdownOpen(false);
                      }}
                      className="p-sm hover:bg-surface-container-low cursor-pointer flex justify-between items-center border-b border-border last:border-0 transition-colors"
                    >
                      <div>
                        <p className="font-body text-body font-medium">{p.name}</p>
                        <p className="font-caption text-caption text-text-secondary">Stok Gudang: {p.warehouseStock} • Hrg: {formatCurrency(p.wholesalePrice)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-primary shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="p-md text-center text-text-secondary font-body-sm text-body-sm">Produk tidak ditemukan</div>
                )}
              </div>
            )}
          </div>

          
          {suggestedProducts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-md">
              <span className="text-text-secondary font-caption text-caption">Saran produk:</span>
              {suggestedProducts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleAddRestock(p)} 
                  className="px-3 py-1 bg-surface-container-highest text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-full font-caption  text-caption  transition-colors flex items-center gap-1 active:scale-95"
                >
                  {p.name} <Plus className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        
        {restockItems.length === 0 ? (
          <div className="py-xl flex flex-col items-center justify-center bg-surface-bright text-text-secondary">
            <Package className="w-10 h-10   mb-sm text-outline-variant" />
            <p className="px-6 text-center font-body text-body font-medium text-text-primary">Keranjang Restock Kosong</p>
            <p className="px-6 text-center font-caption  text-caption  mt-1">Tambahkan produk melalui pencarian atau saran di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px] ">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold">Produk</th>
                  <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center">Stok Gudang</th>
                  <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-right">Harga Setor (Baru)</th>
                  <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-32 ">Jumlah Dititip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {restockItems.map(item => (
                  <tr key={item.productId} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-md px-md font-body text-body font-medium text-text-primary">
                      {item.productName}
                    </td>
                    <td className="py-md px-md text-center">
                      <span className={`font-data-md text-data-md font-medium px-2 py-1 rounded-md ${item._warehouseStock < 10 ? 'bg-warning/10 text-warning-dark' : 'bg-success/10 text-success'}`}>
                        {item._warehouseStock}
                      </span>
                    </td>
                    <td className="py-md px-md text-right font-data-md text-data-md text-text-secondary">
                      {formatCurrency(item.wholesalePrice)}
                    </td>
                    <td className="py-md px-md">
                      <div className="flex items-center justify-center gap-xs">
                        <NumberInput 
                          value={item.quantity} 
                          max={item._warehouseStock} 
                          onChange={(val: number) => handleRestockQuantity(item.productId, val)} 
                        />
                        <button 
                          onClick={() => handleRemoveRestock(item.productId)}
                          className="p-1  text-error hover:bg-error/10 rounded-lg transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-sm">
        <button onClick={onPrev} className="text-text-secondary hover:text-text-primary px-md py-sm  rounded-lg font-body  text-body  font-medium transition-colors border border-outline-variant hover:bg-surface-container-low bg-surface">
          Kembali
        </button>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={onNext} 
            className="bg-primary text-on-primary px-lg py-sm  rounded-lg font-body  text-body  font-medium flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            Lanjut Checkout <ArrowRight className="w-4 h-4  " />
          </button>
        </div>
      </div>
    </div>
  );
}