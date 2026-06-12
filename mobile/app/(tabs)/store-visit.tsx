import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import THEME from '../../constants/css';
import { StepOpname } from '../../components/visits/step-opname';
import { StepRestock, ProductLight } from '../../components/visits/step-restock';
import { StepCheckout } from '../../components/visits/step-checkout';
import { ConfirmModal, InfoModal } from '../../components/ui/modal';

import { useGetStoreById } from '../../api/stores.api';
import { useGetProducts } from '../../api/products.api';
import { useGetLastVisit, useCreateVisit } from '../../api/visits.api';
import { visitFormSchema, VisitFormValues } from '../../schemas/visit.schema';

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
  
  const storeIdNum = parseInt(params.id as string) || 0;
  
  // 1. Fetch Store
  const { data: storeData, isLoading: isStoreLoading } = useGetStoreById(storeIdNum);
  const store = storeData?.store;
  const storeName = store?.name || "Memuat...";
  
  // 2. Fetch Last Visit
  const { data: lastVisit, isLoading: isVisitLoading } = useGetLastVisit(storeIdNum, store?.lastVisitAt);
  const currentDebt = lastVisit?.debt || 0;
  
  // 3. Fetch All Products (isArchived: false)
  const { data: productsData, isLoading: isProductsLoading } = useGetProducts({ isArchived: 'false' });
  const allProducts: ProductLight[] = useMemo(() => {
    if (!productsData) return [];
    return productsData.map(p => ({
      id: p.id,
      name: p.name,
      costPrice: p.costPrice,
      wholesalePrice: p.wholesalePrice,
      warehouseStock: p.warehouseStock
    }));
  }, [productsData]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset inisialisasi setiap kali halaman ini dibuka/difokuskan
  useFocusEffect(
    useCallback(() => {
      setIsInitialized(false);
      setStep(1);
      // Eksekusi ini setelah methods dideklarasikan, jadi kita panggil di bawah jika methods belum ada.
    }, [storeIdNum])
  );

  // RHF Setup
  const methods = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      storeId: storeIdNum,
      storeName: '',
      opnameItems: [],
      restockItems: [],
      checkout: {
        amountPaid: 0,
        subtotalLaku: 0,
        oldDebt: 0
      }
    }
  });

  const { reset, watch, handleSubmit } = methods;
  const opnameItems = watch('opnameItems');
  const restockItems = watch('restockItems');

  useFocusEffect(
    useCallback(() => {
      reset(); // Hapus form state lama seketika
    }, [reset, storeIdNum])
  );

  // Mencegat Navigasi (Hardware Back)
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (step === 3) {
          setStep(2);
        } else if (step === 2 && opnameItems?.length > 0) {
          setStep(1);
        } else {
          setShowCancelModal(true);
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => backHandler.remove();
    }, [step, opnameItems?.length])
  );

  // Initialize Form Data
  useEffect(() => {
    if (store && !isInitialized && !isVisitLoading && !isProductsLoading) {
      let mapped: any[] = [];
      let skipOpname = false;

      if (!store.lastVisitAt || !lastVisit) {
        skipOpname = true;
      } else if (lastVisit && lastVisit.items) {
        mapped = lastVisit.items.map((item: any) => {
          const remainedPrev = (item.initialStock - item.sold - item.returned) + item.restocked;
          return {
            productId: item.productId,
            productName: item.product?.name || 'Produk Dihapus',
            initialStock: remainedPrev,
            sold: 0,
            returned: 0,
            remained: remainedPrev,
            costPrice: item.product?.costPrice || 0,
            wholesalePrice: item.product?.wholesalePrice || item.price
          };
        }).filter((i: any) => i.initialStock > 0);

        if (mapped.length === 0) skipOpname = true;
      }

      reset({
        storeId: storeIdNum,
        storeName: store.name,
        opnameItems: mapped,
        restockItems: [],
        checkout: {
          amountPaid: 0,
          subtotalLaku: 0,
          oldDebt: lastVisit?.debt || 0
        }
      });

      if (skipOpname && step === 1) {
        setStep(2);
      }
      setIsInitialized(true);
    }
  }, [store, lastVisit, isVisitLoading, isProductsLoading, isInitialized, step, reset, storeIdNum]);

  // Suggestions for Restock (Items from last visit that are not yet in restock list)
  const suggestedProducts = useMemo(() => {
    if (!lastVisit?.items) return [];
    const restockedIds = restockItems?.map(i => i.productId) || [];
    return lastVisit.items
      .map(item => allProducts.find(p => p.id === item.productId))
      .filter(p => p && !restockedIds.includes(p.id)) as ProductLight[];
  }, [lastVisit, allProducts, restockItems]);

  const handleHeaderPrevStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      if (opnameItems?.length > 0) setStep(1);
      else setShowCancelModal(true);
    }
    else if (step === 1) setShowCancelModal(true);
  };

  const handleNextToCheckout = () => {
    const isFirstVisit = !store?.lastVisitAt;
    const totalRemained = opnameItems?.reduce((acc, item) => acc + item.remained, 0) || 0;
    const totalRestocked = restockItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    
    if (isFirstVisit && totalRemained + totalRestocked === 0) {
      Toast.show({
        type: 'error',
        text1: 'Kunjungan Perdana',
        text2: 'Kunjungan pertama harus menitipkan minimal 1 barang baru.'
      });
      return;
    }
    setStep(3);
  };

  const createVisit = useCreateVisit();

  const onValidSubmit = async (data: VisitFormValues) => {
    try {
      await createVisit.mutateAsync(data);
      reset();
      setIsInitialized(false);
      router.back();
    } catch (e) {
      // Error is handled by toast in API hook
    }
  };

  const onInvalidSubmit = (errors: any) => {
    let msg = '';
    
    if (errors.checkout?.amountPaid) msg += `• Pembayaran: ${errors.checkout.amountPaid.message}\n`;
    if (errors.opnameItems) {
      if (Array.isArray(errors.opnameItems)) {
        errors.opnameItems.forEach((err: any, idx: number) => {
           if (err?.sold) msg += `• Opname Baris ${idx+1} Laku: ${err.sold.message}\n`;
           if (err?.returned) msg += `• Opname Baris ${idx+1} Retur: ${err.returned.message}\n`;
           if (err?.root) msg += `• Opname Baris ${idx+1}: ${err.root.message}\n`;
        });
      } else if (errors.opnameItems.message) {
        msg += `• Opname: ${errors.opnameItems.message}\n`;
      }
    }
    if (errors.restockItems) {
      if (Array.isArray(errors.restockItems)) {
        errors.restockItems.forEach((err: any, idx: number) => {
           if (err?.quantity) msg += `• Restock Baris ${idx+1} Qty: ${err.quantity.message}\n`;
        });
      } else if (errors.restockItems.message) {
        msg += `• Restock: ${errors.restockItems.message}\n`;
      }
    }
    
    setErrorModalMessage(msg.trim() || 'Terdapat isian yang tidak valid. Mohon periksa kembali.');
    setShowErrorModal(true);
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

      <FormProvider {...methods}>
        {step === 1 && (
          <StepOpname 
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepRestock 
            allProducts={allProducts}
            suggestedProducts={suggestedProducts}
            onNext={handleNextToCheckout}
            onPrev={() => {
              if (opnameItems?.length > 0) setStep(1);
              else router.back();
            }}
            formatCurrency={(val: number) => 'Rp ' + val.toLocaleString('id-ID')}
          />
        )}

        {step === 3 && (
          <StepCheckout 
            currentDebt={currentDebt}
            isSubmitting={createVisit.isPending}
            onPrev={() => setStep(2)}
            onFinish={handleSubmit(onValidSubmit, onInvalidSubmit)}
            formatCurrency={(val: number) => 'Rp ' + val.toLocaleString('id-ID')}
          />
        )}
      </FormProvider>

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

      <ConfirmModal
        visible={showCancelModal}
        title="Batalkan Kunjungan?"
        message="Data kunjungan yang belum disimpan akan hilang. Yakin ingin membatalkan?"
        onCancel={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          reset();
          setIsInitialized(false);
          router.back();
        }}
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
      />

      <InfoModal
        visible={showErrorModal}
        title="Validasi Gagal"
        message={errorModalMessage}
        onClose={() => setShowErrorModal(false)}
        buttonText="Mengerti"
      />
    </View>
  );
}
