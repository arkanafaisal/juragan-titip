import React, { useState } from 'react';
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
import { ConfirmModal } from '../../components/ui/modal';
import { EditStockModal } from '../../components/products/edit-stock-modal';
import { AddStockModal } from '../../components/products/add-stock-modal';
import { ProcessReturnModal } from '../../components/products/process-return-modal';

import THEME from '../../constants/css.js';
import { InventoryLog } from '@/db/schema';

const getLogConfig = (log: InventoryLog) => {
  switch (log.type) {
    case 'OLAH_RETUR':
      return { title: 'OLAH RETUR', desc: `Masuk Gudang: ${log.quantity} Pcs`, icon: RefreshCw, color: THEME.colors['success'] };
    case 'BUANG_RUSAK':
      return { title: 'BUANG / AFKIR', desc: `Dibuang/Rusak: ${Math.abs(log.quantity)} Pcs`, icon: Trash2, color: THEME.colors['error'] };
    case 'TITIPAN':
      return { title: 'TITIPAN TOKO', desc: `${log.storeName || 'Toko'}: -${Math.abs(log.quantity)} Pcs`, icon: StoreIcon, color: THEME.colors['primary'] };
    case 'KOREKSI':
      return { title: 'KOREKSI STOK', desc: `Penyesuaian: ${log.quantity > 0 ? '+' : ''}${log.quantity} Pcs`, icon: Pencil, color: THEME.colors['warning'] };
    case 'KULAKAN':
      return { title: 'KULAKAN AGEN', desc: `Tambah Stok: ${log.quantity} Pcs`, icon: Package, color: THEME.colors['primary'] };
    case 'TARIK_RETUR':
      return { title: 'TARIK RETUR', desc: `${log.storeName || 'Toko'}: ${log.quantity} Pcs`, icon: RefreshCw, color: THEME.colors['warning'] };
    default:
      return { title: log.type, desc: `${log.quantity} Pcs`, icon: Package, color: THEME.colors['text-secondary'] };
  }
};


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const categoryLabels = useSettingsStore(state => state.categoryLabels);

  const [isKoreksiOpen, setIsKoreksiOpen] = useState(false);
  const [isTambahStokOpen, setIsTambahStokOpen] = useState(false);
  const [isOlahReturOpen, setIsOlahReturOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const { data: product, isLoading, isError } = useGetProductById(id ? Number(id) : undefined);
  const { mutate: recoverProduct, isPending: isRecovering } = useRecoverProduct();

  const { data: logs = [], isLoading: isLogsLoading } = useGetProductInventoryLogs(id ? Number(id) : undefined);

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

  if (isError || !product) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-body font-medium text-error text-center mb-4">Produk tidak ditemukan atau terjadi kesalahan.</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-on-primary font-bold">KEMBALI</Text>
        </TouchableOpacity>
      </View>
    );
  }



  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-4 pb-4">
          
          <View className="mb-2 flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="flex-row items-center justify-center px-4 py-2 bg-error rounded-xl shadow-sm active:opacity-80"
              activeOpacity={0.7}
            >
              <Text className="text-body-sm font-bold text-on-error">kembali</Text>
            </TouchableOpacity>
          </View>

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

          <Card className="flex-col mb-4">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-h2 font-bold text-text-primary flex-1 mr-2">{product.name}</Text>
              <TouchableOpacity 
                onPress={() => router.push(`/product-form?id=${product.id}`)}
                disabled={product.isArchived}
                className="p-1.5 shrink-0"
                activeOpacity={0.7}
              >
                <SquarePen size={THEME.iconSize['md']} color={product.isArchived ? THEME.colors['outline'] : THEME.colors['warning']} />
              </TouchableOpacity>
            </View>
            
            <Text className="text-body-sm text-text-secondary mb-4 capitalize">
              {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
            </Text>
            
            <View className="flex-col mt-2 space-y-3">
              <View className="flex-row justify-between items-start gap-4 mb-2">
                <Text className="text-text-secondary shrink-0">Deskripsi</Text>
                <Text className={`text-right flex-1 ${product.description ? 'text-text-primary' : 'text-text-secondary italic text-body-sm'}`}>
                  {product.description || 'Tidak ada deskripsi'}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Modal</Text>
                <Text className="text-text-primary font-medium">{formatRupiah(product.costPrice)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Jual (Toko)</Text>
                <Text className="text-primary font-medium">{formatRupiah(product.wholesalePrice)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Harga Ecer</Text>
                <Text className={`${product.retailPrice ? 'font-medium text-text-primary font-medium' : 'text-right flex-1 text-text-secondary italic text-body-sm'}`}>
                  {product.retailPrice ? formatRupiah(product.retailPrice) : 'Belum diatur'}
                </Text>
              </View>
            </View>
          </Card>

          <Card className="flex-col mb-4">
            <Text className="text-h3 font-bold text-text-primary mb-2 uppercase">Stok Gudang</Text>
            <View className="flex-row items-end gap-1 mb-4">
              <Text className="text-[40px] font-bold text-text-primary leading-[48px]">{product.warehouseStock}</Text>
              <Text className="text-body text-text-secondary mb-1">Pcs</Text>
            </View>
            
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setIsKoreksiOpen(true)}
                disabled={product.isArchived}
                className={`flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl shrink-0 ${product.isArchived ? 'bg-surface-variant' : 'bg-warning'}`}
                activeOpacity={0.8}
              >
                <Pencil size={THEME.iconSize['sm']} color={product.isArchived ? THEME.colors['on-surface-variant'] : THEME.colors['on-warning']} />
                <Text className={`font-bold ${product.isArchived ? 'text-on-surface-variant' : 'text-on-warning'}`}>Koreksi</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsTambahStokOpen(true)}
                disabled={product.isArchived}
                className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 shadow-sm ${product.isArchived ? 'bg-surface-variant' : 'bg-primary'}`}
                activeOpacity={0.8}
              >
                <PackagePlus size={THEME.iconSize['md']} color={product.isArchived ? THEME.colors['on-surface-variant'] : THEME.colors['on-primary']} />
                <Text className={`font-bold ${product.isArchived ? 'text-on-surface-variant' : 'text-on-primary'}`}>Tambah Stok</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card className="flex-col mb-4">
            <Text className="text-h3 font-bold text-text-primary mb-1 uppercase">Manajemen Retur</Text>
            <Text className="text-caption text-text-secondary mb-4 font-medium">
              Terdapat <Text className="text-error font-bold">{product.returnedStock || 0} Pcs</Text> barang retur di tangan Anda.
            </Text>
            <TouchableOpacity 
              onPress={() => setIsOlahReturOpen(true)}
              disabled={product.isArchived || !product.returnedStock || product.returnedStock === 0}
              className={`w-full py-3 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? 'bg-surface-variant' : 'bg-success'}`}
              activeOpacity={0.8}
            >
              <Scale size={THEME.iconSize['sm']} color={(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? THEME.colors['on-surface-variant'] : THEME.colors['on-success']} />
              <Text className={`font-bold ${(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? 'text-on-surface-variant' : 'text-on-success'}`}>
                OLAH BARANG RETUR
              </Text>
            </TouchableOpacity>
          </Card>

          <View className="bg-surface p-4 rounded-2xl border border-outline-variant mt-2 mb-4">
            <View className="border-b pb-3 mb-4 border-outline-variant">
              <Text className="text-h3 font-bold text-text-primary uppercase">Riwayat Aktivitas ( 30 hari )</Text>
            </View>

            <View className="flex-col gap-3 relative">
              {isLogsLoading ? (
                <Text className="text-body-sm font-medium text-center text-text-secondary py-4">Memuat riwayat...</Text>
              ) : logs.length === 0 ? (
                <Text className="text-body-sm font-medium text-center text-text-secondary py-4">Belum ada riwayat aktivitas</Text>
              ) : (
                logs.map((log, index) => {
                  const config = getLogConfig(log);
                  const Icon = config.icon;
                  
                  return (
                    <View key={log.id} className="flex-row gap-3">
                      <View className="items-center z-10">
                        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: THEME.colors['surface-container'] }}>
                          <Icon size={THEME.iconSize['sm']} color={config.color} />
                        </View>
                        {index !== logs.length - 1 && (
                          <View className="w-[1.5px] h-full bg-outline-variant absolute top-8" />
                        )}
                      </View>
                      
                      <View className="flex-1 pb-2">
                        <View className="flex-col mb-1">
                          <Text className="text-body-sm font-bold text-text-primary">{config.title}</Text>
                          <Text className="text-caption text-text-secondary">
                            {formatDate(log.createdAt)} • {formatRelativeTime(log.createdAt)}
                          </Text>
                        </View>
                        <Text className="text-body-sm font-medium text-text-primary">
                          <Text className="text-text-secondary">↳ </Text>{config.desc}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>

        </View>
      </ScrollView>

      <EditStockModal 
        isOpen={isKoreksiOpen} 
        onClose={() => setIsKoreksiOpen(false)} 
        currentStock={product.warehouseStock} 
        productId={product.id}
      />
      <AddStockModal 
        isOpen={isTambahStokOpen} 
        onClose={() => setIsTambahStokOpen(false)} 
        productId={product.id}
      />
      <ProcessReturnModal 
        isOpen={isOlahReturOpen} 
        onClose={() => setIsOlahReturOpen(false)} 
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
            recoverProduct(product.id);
          }
          setIsRestoreModalOpen(false);
        }}
        confirmText="Pulihkan"
      />

    </View>
  );
}
