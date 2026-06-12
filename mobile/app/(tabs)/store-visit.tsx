import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import THEME from '../../constants/css';

import { StepOpname, OpnameItem } from '../../components/visits/step-opname';
import { StepRestock, RestockItem, ProductLight } from '../../components/visits/step-restock';
import { StepCheckout, BillingItem, StockItem } from '../../components/visits/step-checkout';
import { ConfirmModal } from '../../components/ui/modal';

// Komponen Step Indicator
const StepIndicator = ({ current, target, label, num }: any) => {
  const isPast = current > target;
  const isActive = current === target;
  
  return (
    <View className="flex-row items-center gap-1">
      {isPast ? (
        <CheckCircle2 size={THEME.iconSize.xl} color={THEME.colors.success} />
      ) : (
        <View className={`w-8 h-8 rounded-full items-center justify-center ${isActive ? 'bg-primary' : 'bg-surface-container-high'}`}>
          <Text className={`text-h3 font-bold ${isActive ? 'text-on-primary' : 'text-text-secondary'}`}>
            {num}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function StoreVisitScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Dummy data
  const storeName = "Toko Dummy " + (params.id || "123");
  const [currentDebt] = useState(150000); // 150k debt dummy
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountPaidStr, setAmountPaidStr] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);

  // DUMMY STATE
  const [opnameItems, setOpnameItems] = useState<OpnameItem[]>([
    { productId: 1, productName: 'Roti Bakar Sari', initialStock: 10, sold: 0, returned: 0, remained: 10, costPrice: 4000, wholesalePrice: 5000 },
    { productId: 2, productName: 'Kripik Pisang', initialStock: 5, sold: 0, returned: 0, remained: 5, costPrice: 8000, wholesalePrice: 10000 },
  ]);

  const [allProducts] = useState<ProductLight[]>([
    { id: 1, name: 'Roti Bakar Sari', costPrice: 4000, wholesalePrice: 5000, warehouseStock: 100 },
    { id: 2, name: 'Kripik Pisang', costPrice: 8000, wholesalePrice: 10000, warehouseStock: 50 },
    { id: 3, name: 'Kacang Garuda', costPrice: 2000, wholesalePrice: 2500, warehouseStock: 200 },
    { id: 4, name: 'Minuman Ale-Ale', costPrice: 1000, wholesalePrice: 1500, warehouseStock: 300 },
  ]);

  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);

  // Format IDR
  const formatCurrency = (value: number) => {
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  // ================= STEP 1: OPNAME LOGIC =================
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

  // ================= STEP 2: RESTOCK LOGIC =================
  const suggestedProducts = useMemo(() => {
    const restockedIds = restockItems.map(i => i.productId);
    return opnameItems
      .filter(i => !restockedIds.includes(i.productId) && i.remained <= 2)
      .map(i => ({ id: i.productId, name: i.productName }));
  }, [opnameItems, restockItems]);

  const handleAddRestock = (product: { id: number; name: string }) => {
    if (restockItems.some(i => i.productId === product.id)) return;
    
    const fullProduct = allProducts.find(p => p.id === product.id);
    if (!fullProduct) return;
    
    setRestockItems(prev => [...prev, {
      productId: fullProduct.id, 
      productName: fullProduct.name, 
      quantity: 1, 
      costPrice: fullProduct.costPrice, 
      wholesalePrice: fullProduct.wholesalePrice, 
      _warehouseStock: fullProduct.warehouseStock 
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

  // ================= STEP 3: CHECKOUT LOGIC =================
  const isVisitEmpty = opnameItems.length === 0 && restockItems.filter(i => i.quantity > 0).length === 0;

  const billingItems = useMemo(() => {
    const items: BillingItem[] = [];
    opnameItems.forEach(item => {
      if (item.sold > 0) {
        items.push({ id: `${item.productId}_sold`, name: item.productName, type: 'sold', qty: item.sold, price: item.wholesalePrice });
      }
    });
    return items;
  }, [opnameItems]);

  const displayStockItems = useMemo(() => {
    const map = new Map<number, StockItem>();
    
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

  // NAVIGATION HANDLERS
  const handleHeaderPrevStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      if (opnameItems.length > 0) setStep(1);
      else router.back();
    }
    else if (step === 1) router.back();
  };

  const handlePrevStepFromRestock = () => {
    if (opnameItems.length > 0) setStep(1);
    else router.back();
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 1500);
  };

  return (
    <View className="flex-1 bg-background">
      {/* HEADER WIZARD */}
      <View className="flex-row items-center justify-between bg-surface p-4 border-b border-outline-variant mb-4">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity 
            onPress={handleHeaderPrevStep} 
            className="p-1 rounded-lg"
          >
            <ChevronLeft size={THEME.iconSize.lg} color={THEME.colors['text-secondary']} />
          </TouchableOpacity>
          <Text className="font-h4 text-h4 font-bold text-text-primary truncate flex-1" numberOfLines={1}>
            {storeName}
          </Text>
        </View>
        
        <View className="flex-row items-center ml-2 shrink-0">
          <StepIndicator current={step} target={1} label="Opname" num="1" />
          <View className={`w-2 h-[1px] ${step < 2? 'bg-outline-variant' :  step == 2? 'bg-primary' : 'bg-success'}`} />
          <StepIndicator current={step} target={2} label="Restock" num="2" />
          <View className={`w-2 h-[1px] ${step < 3? 'bg-outline-variant' : 'bg-primary'}`} />
          <StepIndicator current={step} target={3} label="Checkout" num="3" />
        </View>
      </View>

      {/* CONTENT PER STEP */}
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

      <ConfirmModal
        visible={showWarningModal}
        title="Toko Sudah Dikunjungi"
        message="Sistem mencatat sudah ada nota kunjungan untuk toko ini hari ini. Lanjutkan buat nota ganda?"
        onCancel={() => {
          setShowWarningModal(false);
          router.back();
        }}
        onConfirm={() => setShowWarningModal(false)}
        confirmText="Tetap Lanjutkan"
      />
    </View>
  );
}
