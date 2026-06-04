import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { storeApi } from "@/services/api/stores";
import { visitApi } from "@/services/api/visits";
import { productApi } from "@/services/api/products";
import type { Store, Product, OpnameItem, RestockItem } from "@/types";

import { StepOpname } from "@/components/visits/step-opname";
import { StepRestock } from "@/components/visits/step-restock";
import { StepCheckout } from "@/components/visits/step-checkout";
import { toast } from "sonner";

const StepIndicator = ({ current, target, label, num }: any) => {
  const isPast = current > target;
  const isActive = current === target;
  
  return (
    <div className={`flex items-center gap-1  ${isActive ? 'text-primary' : isPast ? 'text-success' : 'text-text-muted'}`}>
      {isPast ? <CheckCircle2 className="w-4 h-4   shrink-0" /> : (
        <div className={`w-4 h-4   shrink-0 rounded-full flex items-center justify-center text-[10px]  font-bold ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-text-muted'}`}>
          {num}
        </div>
      )}
      <span className="font-caption  font-medium hidden ">{label}</span>
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
  const [currentDebt, setCurrentDebt] = useState(0);

  
  const [opnameItems, setOpnameItems] = useState<(OpnameItem & { initialStock: number })[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [restockItems, setRestockItems] = useState<(RestockItem & { _warehouseStock: number })[]>([]);
  const [amountPaidStr, setAmountPaidStr] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const productsFromStorage = await productApi.getAll()
        setAllProducts(productsFromStorage.data);

        const [storeRes, visitsRes] = await Promise.all([ storeApi.getById(id), visitApi.getByStore(id) ]);
        if (storeRes.success && storeRes.data) setStore(storeRes.data.store);
        
        if (visitsRes.success && visitsRes.data && visitsRes.data.length > 0) {
          const lastVisit = visitsRes.data[0];
          setCurrentDebt(lastVisit.currentDebt);
          
          const initialOpname = lastVisit.items
            .filter(item => item.remained > 0)
            .map(item => {
               const p = productsFromStorage.data.find(prod => prod.id === item.productId);
               return {
                 ...item,
                 initialStock: item.remained, 
                 sold: 0,
                 returned: 0,
                 remained: item.remained,
                 costPrice: p ? p.costPrice : (item.costPrice || 0)
               };
            });
          
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
    const restockedIds = restockItems.map(i => i.productId);
    return opnameItems
      .filter(i => !restockedIds.includes(i.productId))
      .map(i => ({ id: i.productId, name: i.productName }));
  }, [opnameItems, restockItems]);

  const handleAddRestock = async (product: Product | { id: number; name: string }) => {
    if (restockItems.some(i => i.productId === product.id)) return;
    
    const res = await productApi.getById(product.id);
    if (!res.success || !res.data) { return }
    
    const fullProduct = res.data;
    setRestockItems(prev => [...prev, {
      productId: fullProduct.id, productName: fullProduct.name, quantity: 1, 
      costPrice: fullProduct.costPrice, wholesalePrice: fullProduct.wholesalePrice, _warehouseStock: fullProduct.warehouseStock 
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

  
  const isVisitEmpty = opnameItems.length === 0 && restockItems.filter(i => i.quantity > 0).length === 0;

  
  const billingItems = useMemo(() => {
    const items: any[] = [];
    opnameItems.forEach(item => {
      if (item.sold > 0) {
        items.push({ id: `${item.productId}_sold`, name: item.productName, type: 'sold', qty: item.sold, price: item.wholesalePrice });
      }
    });
    // Tidak memasukkan restockItems ke billingItems karena sistem titipan (bayar belakangan)
    return items;
  }, [opnameItems]);

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

  const handlePrevStepFromRestock = () => {
    if (opnameItems.length > 0) setStep(1);
    else navigate(`/stores/${id}`);
  };

  const handleFinish = async () => {
    if (!id || !store || isVisitEmpty) return;
    setIsSubmitting(true);
    try {
      const mergedItemsMap = new Map<number, OpnameItem>();

      opnameItems.forEach(item => {
        mergedItemsMap.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          sold: item.sold,
          returned: item.returned,
          remained: item.remained,
          costPrice: item.costPrice,
          wholesalePrice: item.wholesalePrice
        });
      });

      restockItems.forEach(item => {
        if (item.quantity > 0) {
          const existing = mergedItemsMap.get(item.productId);
          if (existing) {
            existing.remained += item.quantity;
            existing.wholesalePrice = item.wholesalePrice;
            existing.costPrice = item.costPrice;
          } else {
            mergedItemsMap.set(item.productId, {
              productId: item.productId,
              productName: item.productName,
              sold: 0,
              returned: 0,
              remained: item.quantity,
              costPrice: item.costPrice,
              wholesalePrice: item.wholesalePrice
            });
          }
        }
      });

      
      const finalItems = Array.from(mergedItemsMap.values()).filter(item => item.remained > 0);

      const restockData = restockItems
        .filter(item => item.quantity > 0)
        .map(item => ({ productId: item.productId, productName: item.productName, quantity: item.quantity }));

      const amountPaidNum = parseInt(amountPaidStr.replace(/\D/g, '')) || 0;
      const totalBilled = currentDebt + subtotal;
      const remainingDebt = Math.max(0, totalBilled - amountPaidNum);
      const actualAmountPaid = Math.min(amountPaidNum, totalBilled);

      const result = await visitApi.create({
        storeId: Number(id), 
        storeName: store.name, 
        items: finalItems,
        amountPaid: actualAmountPaid, 
        currentDebt: remainingDebt,
        restockItems: restockData
      });

      if (result.success) {
        navigate(`/stores/${id}`);
      }
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
    <div className="max-w-container-max mx-auto space-y-md ">
      <div className="flex items-center justify-between bg-surface rounded-xl p-md shadow-sm border border-border">
        <div className="flex items-center gap-2  min-w-0">
          <button onClick={handleHeaderPrevStep} className="p-1  hover:bg-surface-container-low rounded-lg transition-colors text-text-secondary shrink-0">
            <ChevronLeft className="w-5 h-5  " />
          </button>
          <div className="min-w-0">
            
            <h2 className="font-h3  text-h3  font-bold text-text-primary truncate max-w-[140px]  ">{store.name}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-1   shrink-0">
          <StepIndicator current={step} target={1} label="Opname" num="1" />
          <div className="w-2   h-[1px] bg-outline-variant hidden "></div>
          <StepIndicator current={step} target={2} label="Restock" num="2" />
          <div className="w-2   h-[1px] bg-outline-variant hidden "></div>
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
          handleAddRestock={handleAddRestock}
          handleRestockQuantity={handleRestockQuantity}
          handleRemoveRestock={handleRemoveRestock}
          onNext={() =>{
            if(isVisitEmpty){return toast.error("Tidak dapat lanjut (kunjungan masih kosong)")}
            setStep(3)
          }}
          onPrev={handlePrevStepFromRestock}
          formatCurrency={formatCurrency}
        />
      )}

      {step === 3 && (
        <StepCheckout 
          billingItems={billingItems}
          displayStockItems={displayStockItems}
          subtotal={subtotal}
          currentDebt={currentDebt}
          isSubmitting={isSubmitting}
          isNextDisabled={isVisitEmpty}
          localAmountPaid={amountPaidStr}
          setLocalAmountPaid={setAmountPaidStr}
          onPrev={() => setStep(2)}
          onFinish={handleFinish}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}