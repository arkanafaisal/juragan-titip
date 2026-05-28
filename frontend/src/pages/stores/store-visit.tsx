import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { storeApi } from "@/services/api/stores";
import { visitApi } from "@/services/api/visits";
import { productApi } from "@/services/api/products";
import { storageGet } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Store, Product, OpnameItem, RestockItem } from "@/types";

import { StepOpname } from "@/components/visits/step-opname";
import { StepRestock } from "@/components/visits/step-restock";
import { StepCheckout } from "@/components/visits/step-checkout";

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

export default function StoreVisitPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // States
  const [opnameItems, setOpnameItems] = useState<(OpnameItem & { initialStock: number })[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [restockItems, setRestockItems] = useState<(RestockItem & { _warehouseStock: number })[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const productsFromStorage = storageGet<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
        setAllProducts(productsFromStorage);

        const [storeRes, visitsRes] = await Promise.all([ storeApi.getById(id), visitApi.getByStore(id) ]);
        if (storeRes.success && storeRes.data) setStore(storeRes.data.store);
        
        if (visitsRes.success && visitsRes.data.length > 0) {
          const sorted = visitsRes.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const lastVisit = sorted[0];
          
          const initialOpname = lastVisit.items
            .filter(item => item.remained > 0)
            .map(item => ({
               ...item,
               initialStock: item.remained, // Snapshot dari visit terakhir
               sold: 0,
               returned: 0,
               remained: item.remained
            }));
          
          setOpnameItems(initialOpname);
          
          if (initialOpname.length === 0) setStep(2); 
        } else {
          setStep(2);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  const handleOpnameChange = (productId: number, field: 'sold' | 'returned', value: number) => {
    setOpnameItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const num = isNaN(value) || value < 0 ? 0 : value;
        const updated = { ...item, [field]: num };
        if (updated.sold + updated.returned > updated.initialStock) return item; 
        updated.remained = updated.initialStock - updated.sold - updated.returned;
        return updated;
      }
      return item;
    }));
  };

  const suggestedProducts = useMemo(() => {
    const opnameIds = opnameItems.map(i => i.productId);
    const restockedIds = restockItems.map(i => i.productId);
    return allProducts.filter(p => opnameIds.includes(p.id) && !restockedIds.includes(p.id));
  }, [allProducts, opnameItems, restockItems]);

  const handleAddRestock = (product: Product) => {
    if (restockItems.some(i => i.productId === product.id)) return;
    setRestockItems(prev => [...prev, {
      productId: product.id, productName: product.name, quantity: 1, 
      wholesalePrice: product.wholesalePrice, retailPrice: product.retailPrice, _warehouseStock: product.warehouseStock 
    }]);
  };

  const handleRestockQuantity = (productId: number, qty: number) => {
    setRestockItems(prev => prev.map(item => {
      if (item.productId === productId) {
        let finalQty = isNaN(qty) || qty < 0 ? 0 : qty;
        if (finalQty > item._warehouseStock) finalQty = item._warehouseStock;
        return { ...item, quantity: finalQty };
      }
      return item;
    }));
  };

  const handleRemoveRestock = (productId: number) => {
    setRestockItems(prev => prev.filter(i => i.productId !== productId));
  };

  // VALIDASI KUNJUNGAN KOSONG: Cegah next step jika tidak ada barang titipan lama DAN tidak ada barang baru yang direstock.
  const isVisitEmpty = opnameItems.length === 0 && restockItems.filter(i => i.quantity > 0).length === 0;

  // CHECKOUT CALCULATION - Tagihan dipisah per Laku & Restock (harga bisa beda)
  const billingItems = useMemo(() => {
    const items: any[] = [];
    opnameItems.forEach(item => {
      if (item.sold > 0) {
        items.push({ id: `${item.productId}_sold`, name: item.productName, type: 'sold', qty: item.sold, price: item.wholesalePrice });
      }
    });
    restockItems.forEach(item => {
      if (item.quantity > 0) {
        items.push({ id: `${item.productId}_restock`, name: item.productName, type: 'restock', qty: item.quantity, price: item.wholesalePrice });
      }
    });
    return items;
  }, [opnameItems, restockItems]);

  const displayStockItems = useMemo(() => {
    const map = new Map<number, { productId: number; productName: string; initialStock: number; sold: number; returned: number; remained: number; restock: number; total: number; }>();
    
    opnameItems.forEach(item => {
      map.set(item.productId, { 
        productId: item.productId, 
        productName: item.productName, 
        initialStock: item.initialStock,
        sold: item.sold,
        returned: item.returned,
        remained: item.remained,
        restock: 0,
        total: item.remained
      });
    });
    
    restockItems.forEach(item => {
      if (item.quantity > 0) {
        const existing = map.get(item.productId);
        if (existing) {
          existing.restock = item.quantity;
          existing.total += item.quantity;
        } else {
          map.set(item.productId, { 
            productId: item.productId, 
            productName: item.productName, 
            initialStock: 0,
            sold: 0,
            returned: 0,
            remained: 0,
            restock: item.quantity,
            total: item.quantity
          });
        }
      }
    });
    
    return Array.from(map.values());
  }, [opnameItems, restockItems]);

  const subtotal = billingItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const totalBilled = subtotal; 

  const handlePrevStepFromRestock = () => {
    if (opnameItems.length > 0) setStep(1);
    else navigate(`/stores/${id}`);
  };

  const handleFinish = async () => {
    if (!id || !store || isVisitEmpty) return;
    setIsSubmitting(true);
    try {
      // 1. Kurangi stok gudang concurrently terlebih dahulu
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

      // 2. Merge Logic final items record
      const mergedItemsMap = new Map<number, OpnameItem>();

      opnameItems.forEach(item => {
        mergedItemsMap.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          sold: item.sold,
          returned: item.returned,
          remained: item.remained,
          wholesalePrice: item.wholesalePrice
        });
      });

      restockItems.forEach(item => {
        if (item.quantity > 0) {
          const existing = mergedItemsMap.get(item.productId);
          if (existing) {
            existing.remained += item.quantity;
            existing.wholesalePrice = item.wholesalePrice; // Overwrite harga terbaru jika direstock
          } else {
            mergedItemsMap.set(item.productId, {
              productId: item.productId,
              productName: item.productName,
              sold: 0,
              returned: 0,
              remained: item.quantity,
              wholesalePrice: item.wholesalePrice
            });
          }
        }
      });

      // Hapus yang remained == 0 sesuai aturan
      const finalItems = Array.from(mergedItemsMap.values()).filter(item => item.remained > 0);

      // 3. Create Visit Record
      await visitApi.create({
        storeId: Number(id), storeName: store.name, items: finalItems,
        totalBilled, amountPaid: totalBilled, previousReceivable: store.totalReceivable || 0,
        documentNumber: `VST-${Date.now()}`, createdAt: new Date().toISOString()
      });

      // 4. Update toko
      const totalActive = displayStockItems.reduce((acc, i) => acc + i.total, 0);
      await storeApi.update(id, { activeItemCount: totalActive });
      navigate(`/stores/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHeaderPrevStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      if (opnameItems.length > 0) setStep(1);
      else navigate(`/stores/${id}`);
    }
    else if (step === 1) navigate(`/stores/${id}`);
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
      <div className="flex items-center justify-between bg-surface rounded-xl p-md shadow-sm border border-border">
        <div className="flex items-center gap-2 sm:gap-md min-w-0">
          <button onClick={handleHeaderPrevStep} className="p-1 sm:p-xs hover:bg-surface-container-low rounded-lg transition-colors text-text-secondary shrink-0">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="min-w-0">
            {/* Lebar teks judul kini dihardcode px per breakpoint agar tidak konflik dengan spasi default v4 */}
            <h2 className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary truncate max-w-[140px] sm:max-w-[320px] md:max-w-[448px]">{store.name}</h2>
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

      {step === 1 && (
        <StepOpname 
          opnameItems={opnameItems}
          handleOpnameChange={handleOpnameChange}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepRestock 
          allProducts={allProducts}
          restockItems={restockItems}
          suggestedProducts={suggestedProducts}
          isNextDisabled={isVisitEmpty}
          handleAddRestock={handleAddRestock}
          handleRestockQuantity={handleRestockQuantity}
          handleRemoveRestock={handleRemoveRestock}
          onNext={() => setStep(3)}
          onPrev={handlePrevStepFromRestock}
          formatCurrency={formatCurrency}
        />
      )}

      {step === 3 && (
        <StepCheckout 
          billingItems={billingItems}
          displayStockItems={displayStockItems}
          subtotal={subtotal}
          totalBilled={totalBilled}
          isSubmitting={isSubmitting}
          isNextDisabled={isVisitEmpty}
          onPrev={() => setStep(2)}
          onFinish={handleFinish}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}