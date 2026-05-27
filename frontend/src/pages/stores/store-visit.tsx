import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ChevronLeft, Search, Plus, Minus, Trash2, 
  Package, ShoppingCart, CheckCircle2, ArrowRight, Save, Loader2, ChevronDown
} from "lucide-react";
import { storeApi } from "@/services/api/stores";
import { visitApi } from "@/services/api/visits";
import { productApi } from "@/services/api/products";
import { storageGet } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Store, Product, OpnameItem, RestockItem } from "@/types";

// Komponen Reusable untuk Stepper Header
const StepIndicator = ({ current, target, label, num }: any) => {
  const isPast = current > target;
  const isActive = current === target;
  
  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${isActive ? 'text-primary' : isPast ? 'text-success' : 'text-text-muted'}`}>
      {isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : (
        <div className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-text-muted'}`}>
          {num}
        </div>
      )}
      <span className="font-caption sm:font-body-sm font-medium hidden sm:block">{label}</span>
    </div>
  );
};

// Komponen Input Angka Aman (Max/Min Check)
const NumberInput = ({ value, max, onChange, className = "" }: any) => {
  const disabled = max === 0;
  return (
    <div className={`flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest ${className} ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <button 
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="px-2 py-1 sm:py-1.5 bg-surface-container-low hover:bg-surface-container-high text-text-secondary transition-colors disabled:opacity-50"
      ><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
      <input 
        type="text" 
        disabled={disabled}
        value={value === 0 ? '0' : value}
        onChange={(e) => {
          if (disabled) return;
          const raw = e.target.value.replace(/[^0-9]/g, '');
          const val = parseInt(raw);
          if (isNaN(val)) onChange(0);
          else onChange(max !== undefined ? Math.min(max, val) : val);
        }}
        className="w-full min-w-[32px] sm:min-w-[40px] max-w-[50px] sm:max-w-[60px] text-center font-data-md text-data-md outline-none bg-transparent py-1"
      />
      <button 
        onClick={() => !disabled && onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={disabled || (max !== undefined && value >= max)}
        className="px-2 py-1 sm:py-1.5 bg-surface-container-low hover:bg-surface-container-high text-text-secondary transition-colors disabled:opacity-50"
      ><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
    </div>
  );
};

export default function StoreVisitPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // States: Step 1 (Opname)
  const [opnameItems, setOpnameItems] = useState<OpnameItem[]>([]);
  
  // States: Step 2 (Restock & Dropdown)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [restockItems, setRestockItems] = useState<(RestockItem & { _warehouseStock: number })[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format Helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  // INIT DATA & AUTO-SKIP LOGIC
  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Ambil data produk tanpa limit pagination melalui local storage bypass khusus dropdown
        const productsFromStorage = storageGet<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
        setAllProducts(productsFromStorage);

        const [storeRes, visitsRes] = await Promise.all([ storeApi.getById(id), visitApi.getByStore(id) ]);
        if (storeRes.success && storeRes.data) setStore(storeRes.data);
        
        if (visitsRes.success && visitsRes.data.length > 0) {
          const sorted = visitsRes.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const lastVisit = sorted[0];
          const activeMap = new Map<string, OpnameItem>();
          
          lastVisit.opnameItems.forEach(item => {
            if (item.remaining > 0) {
              activeMap.set(item.productId, { ...item, previousStock: item.remaining, sold: 0, returned: 0, remaining: item.remaining });
            }
          });
          
          lastVisit.restockItems.forEach(item => {
            if (item.quantity > 0) {
              const existing = activeMap.get(item.productId);
              if (existing) {
                existing.previousStock += item.quantity;
                existing.remaining += item.quantity;
              } else {
                activeMap.set(item.productId, {
                  productId: item.productId, productName: item.productName, previousStock: item.quantity,
                  sold: 0, returned: 0, remaining: item.quantity, wholesalePrice: item.wholesalePrice
                });
              }
            }
          });
          
          const initialOpname = Array.from(activeMap.values());
          setOpnameItems(initialOpname);
          
          // Pre-fill restock items (kuantitas 0) agar user bisa langsung lihat produk sebelumnya
          if (initialOpname.length > 0) {
            const prefilledRestock = initialOpname.map(opItem => {
              const matchedProd = productsFromStorage.find(p => p.id === opItem.productId);
              return {
                productId: opItem.productId,
                productName: opItem.productName,
                quantity: 0,
                wholesalePrice: matchedProd ? matchedProd.wholesalePrice : opItem.wholesalePrice,
                retailPrice: matchedProd ? matchedProd.retailPrice : 0,
                _warehouseStock: matchedProd ? matchedProd.warehouseStock : 0
              };
            });
            setRestockItems(prefilledRestock);
          }
          
          // AUTO SKIP KONDISI: Jika tidak ada barang aktif tertinggal di toko
          if (initialOpname.length === 0) setStep(2); 
        } else {
          setStep(2); // Toko Baru / Belum ada riwayat
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  // OPNAME HANDLERS
  const handleOpnameChange = (productId: string, field: 'sold' | 'returned', value: number) => {
    setOpnameItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const num = isNaN(value) || value < 0 ? 0 : value;
        const updated = { ...item, [field]: num };
        if (updated.sold + updated.returned > updated.previousStock) return item; // Tolak jika melebih stok
        updated.remaining = updated.previousStock - updated.sold - updated.returned;
        return updated;
      }
      return item;
    }));
  };

  // RESTOCK SEARCH FILTER (Lokal)
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // RESTOCK HANDLERS
  const handleAddRestock = (product: Product) => {
    if (restockItems.some(i => i.productId === product.id)) return;
    setRestockItems(prev => [...prev, {
      productId: product.id, productName: product.name, quantity: 1, 
      wholesalePrice: product.wholesalePrice, retailPrice: product.retailPrice, _warehouseStock: product.warehouseStock 
    }]);
    setSearchProduct("");
  };

  const handleRestockQuantity = (productId: string, qty: number) => {
    setRestockItems(prev => prev.map(item => {
      if (item.productId === productId) {
        let finalQty = isNaN(qty) || qty < 0 ? 0 : qty;
        if (finalQty > item._warehouseStock) finalQty = item._warehouseStock;
        return { ...item, quantity: finalQty };
      }
      return item;
    }));
  };

  const handleRemoveRestock = (productId: string) => {
    setRestockItems(prev => prev.filter(i => i.productId !== productId));
  };

  // CHECKOUT CALCULATION LOGIC
  const checkoutItems = useMemo(() => {
    const map = new Map<string, { productId: string; productName: string; sold: number; restock: number; price: number; }>();
    opnameItems.forEach(item => {
      if (item.sold > 0) map.set(item.productId, { productId: item.productId, productName: item.productName, sold: item.sold, restock: 0, price: item.wholesalePrice });
    });
    restockItems.forEach(item => {
      if (item.quantity > 0) {
        const existing = map.get(item.productId);
        if (existing) existing.restock = item.quantity;
        else map.set(item.productId, { productId: item.productId, productName: item.productName, sold: 0, restock: item.quantity, price: item.wholesalePrice });
      }
    });
    return Array.from(map.values());
  }, [opnameItems, restockItems]);

  const activeStockItems = useMemo(() => {
    const map = new Map<string, { productId: string; productName: string; sisa: number; baru: number; }>();
    opnameItems.forEach(item => {
      if (item.remaining > 0) map.set(item.productId, { productId: item.productId, productName: item.productName, sisa: item.remaining, baru: 0 });
    });
    restockItems.forEach(item => {
      if (item.quantity > 0) {
        const existing = map.get(item.productId);
        if (existing) existing.baru = item.quantity;
        else map.set(item.productId, { productId: item.productId, productName: item.productName, sisa: 0, baru: item.quantity });
      }
    });
    return Array.from(map.values());
  }, [opnameItems, restockItems]);

  // Sesuai Aturan Prompt: Tagihan = (Sold + Restock) * Wholesale Price
  const subtotal = checkoutItems.reduce((acc, item) => acc + ((item.sold + item.restock) * item.price), 0);
  const totalBilled = subtotal; // Dianggap lunas / 0 piutang

  // NAVIGATION HANDLERS
  const handlePrevStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      if (opnameItems.length > 0) setStep(1);
      else navigate(`/stores/${id}`);
    }
    else if (step === 1) navigate(`/stores/${id}`);
  };

  const handleFinish = async () => {
    if (!id || !store) return;
    setIsSubmitting(true);
    try {
      const totalActive = activeStockItems.reduce((acc, i) => acc + i.sisa + i.baru, 0);

      await visitApi.create({
        storeId: id, storeName: store.name, opnameItems: opnameItems,
        restockItems: restockItems.map(({ _warehouseStock, ...rest }) => rest), // Buang temp field
        totalBilled, amountPaid: totalBilled, previousReceivable: store.totalReceivable || 0,
        documentNumber: `VST-${Date.now()}`, createdAt: new Date().toISOString()
      });

      // Kurangi stok gudang concurrently
      await Promise.all(
        restockItems.map(async (item) => {
          if (item.quantity > 0) {
            const pRes = await productApi.getById(item.productId);
            if (pRes.success && pRes.data) {
               await productApi.update(item.productId, { warehouseStock: Math.max(0, pRes.data.warehouseStock - item.quantity) });
            }
          }
        })
      );

      // Update counter di toko
      await storeApi.update(id, { activeItemCount: totalActive });
      navigate(`/stores/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !store) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-md md:space-y-lg pb-xl">
      
      {/* HEADER STEPPER */}
      <div className="flex items-center justify-between bg-surface rounded-xl p-md shadow-sm border border-border">
        <div className="flex items-center gap-2 sm:gap-md min-w-0">
          <button onClick={handlePrevStep} className="p-1 sm:p-xs hover:bg-surface-container-low rounded-lg transition-colors text-text-secondary shrink-0">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="min-w-0">
            <h2 className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary truncate max-w-[140px] md:max-w-[484px]">Kunjungan — {store.name}</h2>
            <p className="font-caption sm:font-body-sm text-caption sm:text-body-sm text-text-secondary truncate">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3 md:gap-lg shrink-0">
          <StepIndicator current={step} target={1} label="Opname" num="1" />
          <div className="w-2 sm:w-3 md:w-4 h-[1px] bg-outline-variant hidden sm:block"></div>
          <StepIndicator current={step} target={2} label="Restock" num="2" />
          <div className="w-2 sm:w-3 md:w-4 h-[1px] bg-outline-variant hidden sm:block"></div>
          <StepIndicator current={step} target={3} label="Checkout" num="3" />
        </div>
      </div>

      {/* STEP 1: OPNAME */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-md">
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-primary">Step 1: Hitung Barang di Toko</h3>
                <p className="font-caption sm:font-body-sm text-caption sm:text-body-sm text-text-secondary mt-0.5">Cek fisik barang sisa titipan kunjungan terakhir</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px] md:min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold w-[35%]">Produk</th>
                    <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[15%]">Titip</th>
                    <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[20%]">Laku</th>
                    <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[20%]">Retur (Rusak)</th>
                    <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-[10%]">Sisa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {opnameItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-xl text-center text-text-secondary font-body-sm sm:font-body text-body-sm sm:text-body bg-surface-bright">
                        Tidak ada data titipan sebelumnya. (Otomatis Skip)
                      </td>
                    </tr>
                  ) : (
                    opnameItems.map(item => (
                      <tr key={item.productId} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-md px-md">
                          <span className="font-body text-body font-medium text-text-primary">{item.productName}</span>
                        </td>
                        <td className="py-md px-md text-center">
                          <span className="font-data-md text-data-md text-text-secondary font-medium bg-surface-container-high px-2 py-1 rounded-md">{item.previousStock}</span>
                        </td>
                        <td className="py-md px-md flex justify-center">
                          <NumberInput value={item.sold} max={item.previousStock - item.returned} onChange={(val: number) => handleOpnameChange(item.productId, 'sold', val)} />
                        </td>
                        <td className="py-md px-md text-center">
                          <NumberInput className="mx-auto" value={item.returned} max={item.previousStock - item.sold} onChange={(val: number) => handleOpnameChange(item.productId, 'returned', val)} />
                        </td>
                        <td className="py-md px-md text-center">
                          <span className={`font-data-md sm:font-data-lg text-data-md sm:text-data-lg font-bold ${item.remaining > 0 ? 'text-primary' : 'text-text-muted'}`}>{item.remaining}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} className="bg-primary text-on-primary px-lg py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm">
              Lanjut Restock <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RESTOCK */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-md">
          
          {/* Card Gabungan Search & Table */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            
            {/* Header / Search Area */}
            <div className="p-md border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-primary mb-1">Step 2: Tambah Barang Baru</h3>
              <p className="font-caption sm:font-body-sm text-caption sm:text-body-sm text-text-secondary mb-md">Cari atau pilih produk dari gudang utama yang akan dititipkan hari ini.</p>
              
              <div 
                className="relative w-full max-w-[484px]" 
                tabIndex={-1} 
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setIsDropdownOpen(false);
                }}
              >
                <div className="relative cursor-pointer" onClick={() => setIsDropdownOpen(true)}>
                  <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted pointer-events-none" />
                  <input 
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Cari atau pilih produk..."
                    className="w-full pl-xl pr-10 py-sm sm:py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body text-body transition-all"
                  />
                  <ChevronDown className="absolute right-sm top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted pointer-events-none" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-1 w-full bg-surface-elevated border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
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
            </div>

            {/* Table Area */}
            {restockItems.length === 0 ? (
              <div className="py-xl flex flex-col items-center justify-center bg-surface-bright text-text-secondary">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 mb-sm text-outline-variant" />
                <p className="font-body text-body font-medium text-text-primary">Keranjang Restock Kosong</p>
                <p className="font-caption sm:font-body-sm text-caption sm:text-body-sm mt-1">Tambahkan produk melalui kolom di atas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px] md:min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold">Produk</th>
                      <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center">Stok Gudang</th>
                      <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-right">Harga Setor</th>
                      <th className="py-sm px-md font-caption text-caption text-text-secondary font-semibold text-center w-32 sm:w-40">Jumlah Dititip</th>
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
                              className="p-1 sm:p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors ml-1"
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
            <button onClick={handlePrevStep} className="text-text-secondary hover:text-text-primary px-md py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium transition-colors border border-outline-variant hover:bg-surface-container-low bg-surface">
              Kembali
            </button>
            <button onClick={() => setStep(3)} className="bg-primary text-on-primary px-lg py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm">
              Lanjut Checkout <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CHECKOUT */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-lg pb-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            
            {/* PANEL TAGIHAN */}
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
                <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold flex items-center gap-xs text-text-primary">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary"/> TAGIHAN (Sesuai Aturan: Laku + Restock)
                </h3>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <div className="space-y-sm flex-1">
                  {checkoutItems.length === 0 ? (
                    <div className="text-center text-text-secondary font-body-sm text-body-sm py-lg">Tidak ada item tagihan kunjungan ini.</div>
                  ) : (
                    checkoutItems.map(item => (
                      <div key={item.productId} className="flex justify-between items-start border-b border-dashed border-outline-variant pb-sm last:border-0 last:pb-0">
                        <div>
                          <p className="font-body text-body font-medium text-text-primary">{item.productName}</p>
                          <p className="font-caption text-caption text-text-secondary mt-0.5">
                            {item.sold > 0 && `Laku ${item.sold} `} 
                            {item.sold > 0 && item.restock > 0 && ' | '}
                            {item.restock > 0 && `Restock ${item.restock} `}
                            <span className="font-medium text-text-primary block mt-0.5">
                               Total {item.sold + item.restock} item × {formatCurrency(item.price)}
                            </span>
                          </p>
                        </div>
                        <p className="font-data-md text-data-md font-bold text-text-primary mt-1">
                          {formatCurrency((item.sold + item.restock) * item.price)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-lg border-t-[1.5px] border-text-primary pt-md space-y-xs">
                  <div className="flex justify-between font-body text-body">
                    <span className="text-text-secondary">Subtotal Tagihan:</span>
                    <span className="font-data-md text-data-md font-medium text-text-primary">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body text-body">
                    <span className="text-text-secondary">Piutang Sebelumnya:</span>
                    <span className="font-data-md text-data-md font-medium text-text-primary">{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold mt-sm bg-primary/10 p-sm rounded-lg text-primary items-center">
                    <span>TOTAL TAGIHAN:</span>
                    <span className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg">{formatCurrency(totalBilled)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL STOK AKTIF */}
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
                <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold flex items-center gap-xs text-text-primary">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-success"/> STOK AKTIF DI TOKO (Setelah Visit)
                </h3>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <div className="space-y-sm flex-1">
                  {activeStockItems.length === 0 ? (
                     <div className="text-center text-text-secondary font-body-sm text-body-sm py-lg">Tidak ada stok aktif tertinggal di toko.</div>
                  ) : (
                    activeStockItems.map(item => (
                      <div key={item.productId} className="flex justify-between items-center border-b border-dashed border-outline-variant pb-sm last:border-0 last:pb-0">
                        <p className="font-body text-body font-medium text-text-primary">{item.productName}</p>
                        <p className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg font-bold text-success">
                          {item.sisa + item.baru}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-lg border-t-[1.5px] border-outline-variant pt-md flex justify-between items-center bg-surface-bright -mx-md -mb-md p-md">
                  <span className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-secondary">Total Seluruh Item Aktif:</span>
                  <span className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary bg-surface-container px-3 py-1 rounded-md">
                     {activeStockItems.reduce((acc, i) => acc + i.sisa + i.baru, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION SUBMIT */}
          <div className="flex flex-col sm:flex-row gap-sm sm:gap-md justify-between items-center pt-md">
            <button onClick={handlePrevStep} className="w-full sm:w-auto text-text-secondary hover:text-text-primary px-md py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium transition-colors border border-outline-variant hover:bg-surface-container-low bg-surface text-center">
              Kembali Edit
            </button>
            <button 
              onClick={handleFinish} 
              disabled={isSubmitting}
              className="w-full sm:flex-1 max-w-[400px] bg-primary text-on-primary font-body sm:font-h3 text-body sm:text-h3 py-sm sm:py-md rounded-xl font-bold flex items-center justify-center gap-sm hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
              {isSubmitting ? "Menyimpan Data..." : "SELESAIKAN KUNJUNGAN"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}