import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SquarePen, MapPin, User, Phone, Navigation, Package, Wallet, TrendingUp, History, StickyNote, ArrowLeft } from 'lucide-react-native';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';
import { MapPicker } from '../../components/shared/map-picker';
import { useGetStoreById } from '../../api/stores.api';

export default function StoreDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [activeTab, setActiveTab] = useState<'titipan' | 'riwayat'>('titipan');

  const { data, isLoading, isError, error } = useGetStoreById(id ? Number(id) : undefined);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (isError || !data?.store) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Package size={48} color={THEME.colors['outline-variant']} className="mb-4" />
        <Text className="font-body text-body text-text-secondary text-center mb-4">
          {error?.message || "Toko tidak ditemukan."}
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="px-4 py-2 bg-primary/10 rounded-lg">
          <Text className="text-primary font-medium">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { store, activeItems, visitHistory } = data;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 flex-col gap-4 pb-8">
          
          <TouchableOpacity onPress={() => router.back()} className="self-start flex-row items-center gap-1 bg-surface px-3 py-1.5 rounded-full border border-outline-variant" activeOpacity={0.7}>
            <ArrowLeft size={16} color={THEME.colors['text-secondary']} />
            <Text className="text-text-secondary font-medium text-body-sm">Kembali</Text>
          </TouchableOpacity>

          <Card className="flex-col !p-0 overflow-hidden">
            <View className="p-4 flex-col justify-between">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-2">
                  <View className={`self-start flex-row items-center gap-1 px-2 py-0.5 rounded-full mb-2 ${store.lastVisitAt ? 'bg-primary/10' : 'bg-surface-variant'}`}>
                    <History size={12} color={store.lastVisitAt ? THEME.colors.primary : THEME.colors['text-secondary']} />
                    <Text className={`font-caption text-[10px] font-medium ${store.lastVisitAt ? 'text-primary' : 'text-text-secondary'}`}>
                      {store.lastVisitAt ? `Terakhir: ${new Date(store.lastVisitAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : "Belum pernah dikunjungi"}
                    </Text>
                  </View>
                  <Text className="font-h2 text-h2 text-text-primary tracking-tight">{store.name}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => router.push(`/store-form?id=${store.id}` as any)}
                  className="p-2 bg-warning/10 rounded-xl"
                  activeOpacity={0.7}
                >
                  <SquarePen size={20} color={THEME.colors.warning} />
                </TouchableOpacity>
              </View>

              <View className="space-y-2 mt-2">
                <View className="flex-row items-start gap-2">
                  <MapPin size={16} color={THEME.colors['text-secondary']} className="mt-0.5 shrink-0" />
                  <Text className="flex-1 font-body text-body-sm text-text-secondary">{store.address}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <User size={16} color={THEME.colors['text-secondary']} className="shrink-0" />
                  <Text className="flex-1 font-body text-body-sm text-text-secondary">{store.ownerName}</Text>
                </View>
                {!!store.phone && (
                  <View className="flex-row items-center gap-2">
                    <Phone size={16} color={THEME.colors['text-secondary']} className="shrink-0" />
                    <Text className="flex-1 font-body text-body-sm text-text-secondary">{store.phone}</Text>
                  </View>
                )}
                <View className="flex-row items-start gap-2">
                  <StickyNote size={16} color={THEME.colors['text-secondary']} className="mt-0.5 shrink-0" />
                  <Text className={`flex-1 font-body text-body-sm ${!store.notes ? 'italic text-text-muted' : 'text-text-secondary'}`}>
                    {store.notes || "Tidak ada catatan."}
                  </Text>
                </View>
              </View>
              
              <View className="mt-4 flex-col gap-2">
                <TouchableOpacity 
                  onPress={() => router.push(`/store-visit?id=${store.id}` as any)}
                  className="w-full bg-primary rounded-lg py-3 px-4 flex-row items-center justify-center gap-2 shadow-sm"
                  activeOpacity={0.8}
                >
                  <Navigation size={16} color={THEME.colors['on-primary']} />
                  <Text className="text-on-primary font-semibold text-body-sm">MULAI KUNJUNGAN</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => Linking.openURL(`https://maps.google.com/?q=${store.latitude},${store.longitude}`)}
                  className="w-full bg-on-background/85 border border-outline-variant rounded-lg py-3 px-4 flex-row items-center justify-center gap-2"
                  activeOpacity={0.7}
                >
                  <MapPin size={16} color={THEME.colors['on-primary']} />
                  <Text className="text-on-primary font-semibold text-body-sm">BUKA DI MAPS</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-full bg-surface-variant border-t border-outline-variant">
              <MapPicker initialLatitude={store.latitude} initialLongitude={store.longitude} readonly={true} height={192} />
            </View>
          </Card>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-error p-3 rounded-xl flex-col">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Wallet size={16} color={THEME.colors['on-error']} />
                <Text className="text-caption font-medium text-on-error">Hutang</Text>
              </View>
              <Text className="font-h2 text-h3 font-bold text-on-error">
                {store.debt > 0 ? `Rp ${store.debt.toLocaleString("id-ID")}` : "Rp 0"}
              </Text>
            </View>
            
            <View className="flex-1 bg-success p-3 rounded-xl flex-col">
              <View className="flex-row items-center gap-1.5 mb-1">
                <TrendingUp size={16} color={THEME.colors['on-success']} />
                <Text className="text-caption font-medium text-on-success">Nilai Aset</Text>
              </View>
              <Text className="font-h2 text-h3 font-bold text-on-success">
                {store.assetValue > 0 ? `Rp ${store.assetValue.toLocaleString("id-ID")}` : "Rp 0"}
              </Text>
            </View>
          </View>

          <Card className="flex-col p-0 overflow-hidden">
            <View className='mb-2'>
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={() => setActiveTab('titipan')}
                  className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'titipan' ? 'bg-primary shadow-sm' : ''}`}
                >
                  <Text className={`font-semibold text-body-sm ${activeTab === 'titipan' ? 'text-on-primary' : 'text-text-secondary'}`}>
                    Titipan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setActiveTab('riwayat')}
                  className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'riwayat' ? 'bg-primary shadow-sm' : ''}`}
                >
                  <Text className={`font-semibold text-body-sm ${activeTab === 'riwayat' ? 'text-on-primary' : 'text-text-secondary'}`}>
                    Riwayat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              {activeTab === 'titipan' ? (
                activeItems && activeItems.length > 0 ? (
                  <View className="space-y-2">
                    {activeItems.map((item, idx) => (
                      <View key={idx} className="flex-row justify-between items-center p-3 border border-outline-variant rounded-lg bg-surface">
                        <Text className="font-body text-body-sm text-text-primary font-medium">{item.productName}</Text>
                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                          <Text className="font-medium text-caption text-primary">Sisa: {item.remained}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="py-8 flex-col items-center justify-center">
                    <Package size={48} color={THEME.colors['outline-variant']} className="mb-2" />
                    <Text className="font-body text-body-sm text-text-secondary text-center">Belum ada barang titipan aktif.</Text>
                  </View>
                )
              ) : (
                visitHistory && visitHistory.length > 0 ? (
                  <View className="space-y-2">
                    <Text className="text-[10px] text-text-muted italic mb-1">Menampilkan riwayat kunjungan terakhir.</Text>
                    {visitHistory.map((visit) => (
                      <TouchableOpacity 
                        key={visit.id}
                        className="flex-row justify-between items-center p-3 border border-outline-variant rounded-lg bg-surface active:opacity-70"
                        onPress={() => {}}
                      >
                        <View className="flex-col gap-0.5">
                          <Text className="font-body text-body-sm text-text-primary font-medium">
                            {new Date(visit.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                          </Text>
                          <Text className="font-caption text-[10px] text-text-secondary">VST-{visit.id.toString().padStart(5, '0')}</Text>
                        </View>
                        <View className="flex-col items-end gap-0.5">
                          <Text className="font-body text-body-sm text-text-primary font-bold">
                            Rp {visit.amountPaid.toLocaleString("id-ID")}
                          </Text>
                          <Text className="font-caption text-[10px] text-text-secondary">Pembayaran</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="py-8 flex-col items-center justify-center">
                    <History size={48} color={THEME.colors['outline-variant']} className="mb-2" />
                    <Text className="font-body text-body-sm text-text-secondary text-center">Belum ada riwayat kunjungan.</Text>
                  </View>
                )
              )}
            </View>
          </Card>

        </View>
      </ScrollView>
    </View>
  );
}
