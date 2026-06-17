import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { 
  Banknote, 
  Wallet, 
  Package, 
  ArrowRight
} from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';
import { formatRupiah } from '../../utils/formatter.util';
import { 
  useGetFinanceSummary, 
  useGetFinanceIncomeList, 
  useGetFinanceReceivableList, 
  useGetFinanceAssetList 
} from '../../api/finance.api';
import { ActivityIndicator } from 'react-native';

type TabType = 'income' | 'receivables' | 'assets';

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('income');

  const { data: summary, isLoading: isLoadingSummary } = useGetFinanceSummary();
  const { data: incomes = [], isLoading: isLoadingIncomes } = useGetFinanceIncomeList();
  const { data: receivables = [], isLoading: isLoadingReceivables } = useGetFinanceReceivableList();
  const { data: assets = [], isLoading: isLoadingAssets } = useGetFinanceAssetList();

  if (isLoadingSummary) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  const defaultSummary = {
    income: { totalThisMonth: 0, chartData: [{ value: 0 }] },
    receivables: { storeCount: 0, totalDebt: 0 },
    assets: { storeCount: 0, totalAssetValue: 0 }
  };
  const safeSummary = summary || defaultSummary;

  return (
    <ScrollView 
      className="flex-1 bg-background"
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'income' && (
        <View className="flex-1">
          <IncomeChartSection summary={safeSummary} />
          <View className="px-4 pb-8 mt-2 flex-1">
            <IncomeContent incomes={incomes} isLoading={isLoadingIncomes} />
          </View>
        </View>
      )}

      {activeTab === 'receivables' && (
        <View className="flex-1">
          <ReceivablesSummarySection summary={safeSummary} />
          <View className="px-4 pb-8 flex-1">
            <ReceivableContent receivables={receivables} isLoading={isLoadingReceivables} />
          </View>
        </View>
      )}

      {activeTab === 'assets' && (
        <View className="flex-1">
          <AssetsSummarySection summary={safeSummary} />
          <View className="px-4 pb-8 flex-1">
            <AssetContent assets={assets} isLoading={isLoadingAssets} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// --- SUB-COMPONENTS ---

function IncomeChartSection({ summary }: { summary: any }) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; 
  const chartDataLength = summary.income.chartData.length;
  const spacing = chartDataLength > 1 ? chartWidth / (chartDataLength - 1) : chartWidth;
  const maxChartVal = Math.max(...summary.income.chartData.map((d: any) => d.value));
  
  // Memberikan offset agar nilai 0 tidak menempel di dasar SVG dan terpotong
  const zeroOffset = maxChartVal > 0 ? maxChartVal * 0.2 : 20;
  const chartMaxValue = maxChartVal > 0 ? maxChartVal + (zeroOffset * 1.5) : 100;
  
  const displayChartData = summary.income.chartData.map((d: any) => ({
    value: d.value + zeroOffset
  }));

  return (
    <View className="px-4 pt-4 flex-col gap-4">
      {/* 1. Card Pemasukan (Besar + Chart) */}
      <View className="bg-primary rounded-[20px] p-6 shadow-lg overflow-hidden min-h-[180px] flex-col justify-between">
        <View className="relative z-10">
          <View className="flex-row items-center gap-2 mb-2 opacity-90">
            <Banknote size={20} color={THEME.colors['on-primary']} />
            <Text className="font-body text-body-sm font-medium uppercase tracking-wider text-on-primary">
              Margin (30 Hari Terakhir)
            </Text>
          </View>
          <Text className="font-display text-display font-bold tracking-tight text-on-primary" numberOfLines={1}>
            {formatRupiah(summary.income.totalThisMonth)}
          </Text>
        </View>
        
        {/* Recharts Area - Absolute di background */}
        {chartDataLength > 1 && (
          <View className="absolute bottom-0 left-0 right-0 h-[100px] opacity-40">
            <LineChart
              areaChart
              data={displayChartData}
              hideDataPoints
              hideRules
              hideYAxisText
              xAxisThickness={0}
              yAxisThickness={0}
              color="#ffffff"
              startFillColor="#ffffff"
              endFillColor="#ffffff"
              startOpacity={0.8}
              endOpacity={0}
              initialSpacing={0}
              spacing={spacing}
              thickness={3}
              height={100}
              width={chartWidth}
              maxValue={chartMaxValue}
              yAxisOffset={0}
              isAnimated={false}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function ReceivablesSummarySection({ summary }: { summary: any }) {
  return (
    <View className="px-4 pt-2 pb-4 flex-col">
      <Card className="flex-row items-start gap-3 p-4">
        <View className="w-10 h-10 rounded-full bg-error/10 items-center justify-center shrink-0">
          <Wallet size={20} color={THEME.colors.error} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-body-sm text-text-secondary font-medium" numberOfLines={1}>
              Total Hutang Berjalan
            </Text>
            <View className="bg-error/10 px-2 py-1 rounded-md shrink-0">
              <Text className="text-[10px] font-medium text-error">
                {summary.receivables.storeCount} Toko
              </Text>
            </View>
          </View>
          <Text className="font-h3 text-h3 font-bold text-text-primary" numberOfLines={1}>
            {formatRupiah(summary.receivables.totalDebt)}
          </Text>
        </View>
      </Card>
    </View>
  );
}

function AssetsSummarySection({ summary }: { summary: any }) {
  return (
    <View className="px-4 pt-2 pb-4 flex-col">
      <Card className="flex-row items-start gap-3 p-4">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
          <Package size={20} color={THEME.colors.primary} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-body-sm text-text-secondary font-medium" numberOfLines={1}>
              Total Nilai Item Aktif
            </Text>
            <View className="bg-primary/10 px-2 py-1 rounded-md shrink-0">
              <Text className="text-[10px] font-medium text-primary">
                {summary.assets.storeCount} Toko
              </Text>
            </View>
          </View>
          <Text className="font-h3 text-h3 font-bold text-text-primary" numberOfLines={1}>
            {formatRupiah(summary.assets.totalAssetValue)}
          </Text>
        </View>
      </Card>
    </View>
  );
}

function TabNavigation({ activeTab, onTabChange }: { activeTab: TabType, onTabChange: (tab: TabType) => void }) {
  return (
    <View className="bg-background z-20 border-b border-outline-variant">
      <View className="flex-row px-4">
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => onTabChange('income')}
          className={`flex-1 py-3 items-center justify-center border-b-2 ${activeTab === 'income' ? 'border-primary' : 'border-transparent'}`}
        >
          <Text className={`font-body text-body font-bold ${activeTab === 'income' ? 'text-primary' : 'text-text-secondary'}`}>
            Masuk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => onTabChange('receivables')}
          className={`flex-1 py-3 items-center justify-center border-b-2 ${activeTab === 'receivables' ? 'border-primary' : 'border-transparent'}`}
        >
          <Text className={`font-body text-body font-bold ${activeTab === 'receivables' ? 'text-primary' : 'text-text-secondary'}`}>
            Hutang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => onTabChange('assets')}
          className={`flex-1 py-3 items-center justify-center border-b-2 ${activeTab === 'assets' ? 'border-primary' : 'border-transparent'}`}
        >
          <Text className={`font-body text-body font-bold ${activeTab === 'assets' ? 'text-primary' : 'text-text-secondary'}`}>
            Aset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function IncomeContent({ incomes, isLoading }: { incomes: any[], isLoading: boolean }) {
  return (
    <View className="flex-col gap-4">
      <Text className="text-body-sm text-text-secondary px-1">
        Riwayat pembayaran uang tunai dari kunjungan toko.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : incomes.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Belum ada data pembayaran 30 hari terakhir.</Text>
        </View>
      ) : (
        incomes.map((item, idx) => (
          <Card key={idx} className="p-4">
            <View className="mb-3">
              <Text className="font-semibold text-body text-text-primary">
                {item.storeName}
              </Text>
              <Text className="font-caption text-caption text-text-secondary mt-1">
                📅 {item.date}
              </Text>
            </View>
            
            {/* Dashed Border */}
            <View className="w-full my-3" style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderColor: THEME.colors['outline-variant'] }} />
            
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-caption text-caption text-text-secondary mb-0.5">Uang Masuk:</Text>
                <Text className="font-bold text-body text-success">
                  + {formatRupiah(item.amount)}
                </Text>
              </View>
              <Link href={`/(tabs)/visit-invoice?id=${item.visitId}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
                  <Text className="font-body-sm text-body-sm font-semibold text-primary">Lihat Nota</Text>
                  <ArrowRight size={16} color={THEME.colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

function ReceivableContent({ receivables, isLoading }: { receivables: any[], isLoading: boolean }) {
  return (
    <View className="flex-col gap-4">
      <Text className="text-body-sm text-text-secondary px-1">
        Daftar tagihan aktif. Sisa hutang selalu berpindah dan diakumulasikan ke riwayat kunjungan paling akhir.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : receivables.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Tidak ada tagihan aktif.</Text>
        </View>
      ) : (
        receivables.map((item, idx) => (
          <Card key={idx} className="p-4">
            <View className="mb-3">
              <Text className="font-semibold text-body text-text-primary">
                {item.storeName}
              </Text>
            </View>
            
            <View className="w-full my-3" style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderColor: THEME.colors['outline-variant'] }} />
            
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-caption text-caption text-text-secondary mb-0.5">Sisa Hutang:</Text>
                <Text className={`font-bold text-body ${item.status === 'merah' ? 'text-error' : item.status === 'kuning' ? 'text-warning' : 'text-success'}`}>
                  {formatRupiah(item.debt)}
                </Text>
              </View>
              <Link href={`/(tabs)/store-detail?id=${item.storeId}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg" activeOpacity={0.7}>
                  <Text className="font-body-sm text-body-sm font-semibold text-primary">Detail Toko</Text>
                  <ArrowRight size={16} color={THEME.colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

function AssetContent({ assets, isLoading }: { assets: any[], isLoading: boolean }) {
  return (
    <View className="flex-col gap-4">
      <Text className="text-body-sm text-text-secondary px-1">
        Sebaran data nilai dan barang titipan terakhir di masing-masing toko.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : assets.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Belum ada aset titipan yang tercatat.</Text>
        </View>
      ) : (
        assets.map((item, idx) => (
          <Card key={idx} className="p-4">
            <View className="mb-3">
              <Text className="font-semibold text-body text-text-primary">
                {item.storeName}
              </Text>
            </View>
            
            <View className="w-full my-3" style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderColor: THEME.colors['outline-variant'] }} />
            
            <View className="flex-row justify-between items-end">
              <View>
                <Text className="font-caption text-caption text-text-secondary mb-0.5">Estimasi Aset:</Text>
                <Text className="font-bold text-body text-primary">
                  {formatRupiah(item.assetValue)}
                </Text>
              </View>
              <Link href={`/(tabs)/store-detail?id=${item.storeId}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg" activeOpacity={0.7}>
                  <Text className="font-body-sm text-body-sm font-semibold text-primary">Cek Stok</Text>
                  <ArrowRight size={16} color={THEME.colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}
