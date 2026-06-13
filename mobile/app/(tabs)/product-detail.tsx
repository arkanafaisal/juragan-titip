import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  PackagePlus, RefreshCw, 
  Store as StoreIcon, Package, Pencil, Trash2, Scale, SquarePen, ChevronLeft
} from 'lucide-react-native';
import { Card } from '../../components/ui/card';
import { useSettingsStore } from '../../api/settings.api';
import { formatRupiah, formatDate, formatRelativeTime } from '../../utils/formatter.util';
import { useGetProductById, useRecoverProduct, useGetProductInventoryLogs } from '../../api/products.api';

// UI Only Imports
import { ConfirmModal, InfoModal } from '../../components/ui/modal';
import { EditStockModal } from '../../components/products/edit-stock-modal';
import { AddStockModal } from '../../components/products/add-stock-modal';
import { ProcessReturnModal } from '../../components/products/process-return-modal';

import THEME from '../../constants/css.js';

import { ProductInfoCard } from '../../components/products/product-info-card';
import { WarehouseStockCard } from '../../components/products/warehouse-stock-card';
import { ReturnManagementCard } from '../../components/products/return-management-card';
import { ActivityLogs } from '../../components/products/activity-logs';
import { BackButton } from '../../components/shared/back-button';
import { InventoryLogType } from '../../db/schema';


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const categoryLabels = useSettingsStore(state => state.categoryLabels);

  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isProcessReturnOpen, setIsProcessReturnOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [logTypeFilter, setLogTypeFilter] = useState<InventoryLogType>('TITIPAN');
  const [errorInfo, setErrorInfo] = useState<{visible: boolean; title: string; message: string; onContinue?: () => void; buttonText?: string}>({ visible: false, title: '', message: '' });

  const { data: product, isLoading, isError: isProductError, error: productError } = useGetProductById(id ? Number(id) : undefined);
  const { mutate: recoverProduct, isPending: isRecovering } = useRecoverProduct();

  const { data: logs = [], isLoading: isLogsLoading, isError: isLogsError, error: logsError } = useGetProductInventoryLogs(id ? Number(id) : undefined, logTypeFilter);

  const showError = (title: string, message: string, onContinue?: () => void, buttonText?: string) => {
    setIsRestoreModalOpen(false);
    setErrorInfo({ visible: true, title, message, onContinue, buttonText });
  };

  useEffect(() => {
    if (isProductError && productError) {
      showError('Gagal Memuat Produk', (productError as Error).message, () => router.back(), 'Kembali');
    }
  }, [isProductError, productError, router]);

  useEffect(() => {
    if (isLogsError && logsError) {
      showError('Gagal Memuat Riwayat', (logsError as Error).message, undefined, 'Lanjutkan');
    }
  }, [isLogsError, logsError]);

  const handleRestore = () => {
    setIsRestoreModalOpen(true);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-body font-medium text-text-primary">Memuat detail produk...</Text>
      </View>
    );
  }

  if (isProductError || !product) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-body font-medium text-error text-center mb-4">Produk tidak ditemukan atau terjadi kesalahan.</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-on-primary font-bold">KEMBALI</Text>
        </TouchableOpacity>
        <InfoModal
          visible={errorInfo.visible}
          title={errorInfo.title}
          message={errorInfo.message}
          buttonText={errorInfo.buttonText}
          onContinue={errorInfo.onContinue}
          onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
        />
      </View>
    );
  }



  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-4 pb-4">
          
          <BackButton />

          {product.isArchived && (
            <View className="bg-error/10 border border-error/30 rounded-xl p-4 flex-col items-start gap-2 mb-4">
              <Text className="text-body-sm font-bold text-error">
                Perhatian: Produk ini sedang diarsipkan dan tidak muncul di daftar aktif.
              </Text>
              <TouchableOpacity 
                onPress={handleRestore}
                disabled={isRecovering}
                className={`py-1.5 px-4 bg-error rounded-lg mt-1 ${isRecovering ? 'opacity-50' : 'active:opacity-80'}`}
                activeOpacity={0.7}
              >
                <Text className="text-on-error text-body-sm font-bold">
                  {isRecovering ? 'Memulihkan...' : 'Pulihkan Produk'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ProductInfoCard 
            product={product} 
            categoryLabels={categoryLabels} 
            onEdit={() => router.push(`/product-form?id=${product.id}` as any)} 
          />

          <WarehouseStockCard 
            product={product} 
            onCorrection={() => setIsCorrectionOpen(true)} 
            onAddStock={() => setIsAddStockOpen(true)} 
          />

          <ReturnManagementCard 
            product={product} 
            onProcessReturn={() => setIsProcessReturnOpen(true)} 
          />

          <ActivityLogs 
            logs={logs} 
            isLoading={isLogsLoading} 
            filterValue={logTypeFilter}
            onFilterChange={setLogTypeFilter}
          />

        </View>
      </ScrollView>

      <EditStockModal 
        isOpen={isCorrectionOpen} 
        onClose={() => setIsCorrectionOpen(false)} 
        currentStock={product.warehouseStock} 
        productId={product.id}
      />
      <AddStockModal 
        isOpen={isAddStockOpen} 
        onClose={() => setIsAddStockOpen(false)} 
        productId={product.id}
      />
      <ProcessReturnModal 
        isOpen={isProcessReturnOpen} 
        onClose={() => setIsProcessReturnOpen(false)} 
        returnedStock={product.returnedStock} 
        productId={product.id}
      />
      
      <ConfirmModal
        visible={isRestoreModalOpen}
        title="Pulihkan Produk"
        message="Apakah Anda yakin ingin memulihkan produk ini agar kembali aktif?"
        onCancel={() => setIsRestoreModalOpen(false)}
        onConfirm={() => {
          if (product) {
            recoverProduct(product.id, {
              onError: (err) => showError('Gagal Memulihkan', err.message)
            });
          }
          setIsRestoreModalOpen(false);
        }}
        confirmText="Pulihkan"
      />

      <InfoModal
        visible={errorInfo.visible}
        title={errorInfo.title}
        message={errorInfo.message}
        buttonText={errorInfo.buttonText}
        onContinue={errorInfo.onContinue}
        onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
      />
    </View>
  );
}
