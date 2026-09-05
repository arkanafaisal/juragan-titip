import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import THEME from '../../constants/css';
import { BackButton } from '../../components/shared/back-button';
import { InfoModal } from '../../components/ui/modal';
import { StoreInfoCard } from '../../components/stores/store-info-card';
import { FinancialSummary } from '../../components/stores/financial-summary';
import { StoreTabsSection } from '../../components/stores/store-tabs-section';

import { useGetStoreById, useToggleArchiveStore } from '../../api/stores.api';
import { useGetStoreVisitsAnalysis } from '../../api/visits.api';
import { useSettingsStore } from '../../api/settings.api';

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function StoreDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storeCategoryLabels = useSettingsStore(state => state.storeCategoryLabels);

  const { data: storeData, isLoading: isStoreLoading, isError: isStoreError, error: storeError } = useGetStoreById(id ? Number(id) : undefined);
  const { data: analysisData, isLoading: isAnalysisLoading } = useGetStoreVisitsAnalysis(id ? Number(id) : undefined);
  const toggleArchiveStore = useToggleArchiveStore();

  const handleRestoreStore = () => {
    if (storeData) {
      toggleArchiveStore.mutate({ id: storeData.id, isArchived: false });
    }
  };

  if (isStoreLoading || isAnalysisLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (isStoreError || !storeData) {
    return (
      <View className="flex-1 bg-background">
        <InfoModal
          visible={true}
          title="Gagal Memuat"
          message={storeError?.message || "Data toko tidak ditemukan."}
          onClose={() => router.back()}
          buttonText="Kembali"
        />
      </View>
    );
  }

  const store = storeData;
  const activeItems = analysisData?.activeItems || [];
  const visitHistory = analysisData?.visitHistory || [];

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 flex-col gap-4 pb-8">
          
          {store.isArchived && (
            <View className="flex-row items-center justify-between p-3 bg-warning/20 border border-warning/50 rounded-xl mb-1">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-text-primary text-sm">Toko Diarsipkan</Text>
                <Text className="text-xs text-text-secondary">Toko ini disembunyikan dari daftar utama.</Text>
              </View>
              <TouchableOpacity 
                onPress={handleRestoreStore}
                disabled={toggleArchiveStore.isPending}
                className="bg-warning px-3 py-2 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-on-warning font-bold text-xs">PULIHKAN</Text>
              </TouchableOpacity>
            </View>
          )}

          <BackButton />

          <StoreInfoCard 
            store={store} 
            categoryLabels={storeCategoryLabels}
            onEdit={() => router.push(`/store-form?id=${store.id}` as any)} 
            onVisit={() => router.push(`/store-visit?id=${store.id}` as any)} 
            formatDate={formatDate} 
          />

          <FinancialSummary 
            debt={store.debt} 
            assetValue={store.assetValue} 
          />

          <StoreTabsSection 
            activeItems={activeItems} 
            visitHistory={visitHistory} 
            formatDate={formatDate} 
          />

        </View>
      </ScrollView>
    </View>
  );
}
