import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react-native';

import THEME from '../../constants/css';
import { StepOpname } from '../../components/visits/step-opname';
import { StepRestock, ProductLight } from '../../components/visits/step-restock';
import { StepCheckout } from '../../components/visits/step-checkout';
import { ConfirmModal, InfoModal } from '../../components/ui/modal';

import { useGetStoreById } from '../../api/stores.api';
import { useGetProducts } from '../../api/products.api';
import { useGetLastVisit, useCreateVisit } from '../../api/visits.api';
import { visitFormSchema, VisitFormValues } from '../../schemas/visit.schema';



export default function StoreVisitScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const storeIdNum = parseInt(params.id as string) || 0;
  
  // 1. Fetch Store
  const { data: storeData, isLoading: isStoreLoading } = useGetStoreById(storeIdNum);
  const store = storeData;
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
        } else if (step === 2) {
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

      if (lastVisit && lastVisit.items) {
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

      setIsInitialized(true);
    }
  }, [store, lastVisit, isVisitLoading, isProductsLoading, isInitialized, reset, storeIdNum]);

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
    else if (step === 2) setStep(1);
    else if (step === 1) setShowCancelModal(true);
  };

  const handleNextToCheckout = () => {
    const totalRestocked = restockItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    
    if (opnameItems?.length === 0 && totalRestocked === 0) {
      Toast.show({
        type: 'error',
        text1: 'Toko Kosong',
        text2: 'Tidak ada barang di toko saat ini. Anda harus menitipkan minimal 1 barang baru.'
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
      <VisitHeader storeName={storeName} step={step} onPrevStep={handleHeaderPrevStep} />
      
      <FormProvider {...methods}>
        {step === 1 && (
          <StepOpname/>
        )}

        {step === 2 && (
          <StepRestock 
            allProducts={allProducts}
            suggestedProducts={suggestedProducts}
          />
        )}

        {step === 3 && (
          <StepCheckout 
            currentDebt={currentDebt}
          />
        )}
      </FormProvider>

      {/* FIXED FOOTER DARI PARENT */}
      <FixedFooter 
        step={step}
        setStep={setStep}
        handleNextToCheckout={handleNextToCheckout}
        isPending={createVisit.isPending}
        onFinish={handleSubmit(onValidSubmit, onInvalidSubmit)}
      />

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


interface VisitHeaderProps {
  storeName: string;
  step: 1 | 2 | 3;
  onPrevStep: () => void;
}

function VisitHeader({ storeName, step, onPrevStep }: VisitHeaderProps) {
  const headerText = {
    header: ["Cek Titipan Lama (Opname)", "Titip Barang Baru (Restock)", "Tagihan dan rincian produk"],
    subHeader: ["Berapa banyak barang yang laku dan yang harus ditarik/retur?", "Pilih barang dari gudang untuk dititipkan ke toko ini.", "Periksa kembali ringkasan sebelum menyimpan kunjungan."]
  }
  return (
    <View className='border-b border-outline-variant bg-surface'>
      <View className="flex-row items-center justify-between  px-4 py-2">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity 
            onPress={onPrevStep} 
            className="p-1 rounded-lg"
          >
            <ChevronLeft size={THEME.iconSize.lg} color={THEME.colors['text-secondary']} />
          </TouchableOpacity>
          <Text className="font-h4 text-h4 font-bold text-text-primary truncate flex-1" numberOfLines={1}>
            {storeName}
          </Text>
        </View>
        
        <View className="flex-row items-center ml-2 shrink-0">
          <StepIndicator current={step} target={1} num="1" />
          <View className={`w-2 h-[1px] ${step < 2? 'bg-outline-variant' :  step == 2? 'bg-primary' : 'bg-success'}`} />
          <StepIndicator current={step} target={2} num="2" />
          <View className={`w-2 h-[1px] ${step < 3? 'bg-outline-variant' : 'bg-primary'}`} />
          <StepIndicator current={step} target={3} num="3" />
        </View>
      </View>

      <View className="mb-2 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">{headerText.header[step-1]}</Text>
        <Text className="text-body-sm text-text-secondary">{headerText.subHeader[step-1]}</Text>
      </View>
    </View>
  );
};


interface FixedFooterProps {
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  handleNextToCheckout: () => void;
  isPending: boolean;
  onFinish: () => void;
}

function FixedFooter({
  step,
  setStep,
  handleNextToCheckout,
  isPending,
  onFinish
}: FixedFooterProps) {
  return (
    <View className="absolute bottom-0 inset-x-0 px-4 py-2 bg-surface border-t border-outline-variant flex-row gap-3">
      {step === 1 && (
        <TouchableOpacity 
          onPress={() => setStep(2)}
          className="w-full bg-success py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-on-success font-bold">Lanjutkan ke Restock</Text>
          <ArrowRight size={20} color={THEME.colors['on-success']} />
        </TouchableOpacity>
      )}
      
      {step === 2 && (
        <>
          <TouchableOpacity 
            onPress={() => setStep(1)}
            className="flex-1 bg-error py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft size={20} color={THEME.colors['on-error']} />
            <Text className="text-on-error font-bold">Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleNextToCheckout}
            className="flex-1 bg-success py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-on-success font-bold">Lanjut</Text>
            <ArrowRight size={20} color={THEME.colors['on-success']} />
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TouchableOpacity 
            onPress={() => setStep(2)}
            className="flex-1 bg-error py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
            disabled={isPending}
          >
            <ArrowLeft size={20} color={THEME.colors['on-error']} />
            <Text className="text-on-error font-bold">Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onFinish}
            disabled={isPending}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${isPending ? 'bg-surface-variant' : 'bg-success'}`}
            activeOpacity={0.8}
          >
            {isPending ? <Loader2 size={20} color={THEME.colors['on-primary']} className="animate-spin" /> : <CheckCircle2 size={20} color={THEME.colors['on-success']} />}
            <Text className={`${isPending ? 'text-text-secondary' : 'text-on-success'} font-bold`}>Selesaikan</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}










interface StepIndicatorProps {
  current: number;
  target: number;
  num: string | number;
}

function StepIndicator ({ current, target, num }: StepIndicatorProps) {
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