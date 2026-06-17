import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { 
  Banknote, 
  Wallet, 
  Package, 
  ArrowRight,
  Calendar
} from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';
import { formatRupiah } from '../../utils/formatter.util';
import { 
  useGetFinanceIncome, 
  useGetFinanceReceivables, 
  useGetFinanceAssets 
} from '../../api/finance.api';
import { ActivityIndicator } from 'react-native';

type TabType = 'income' | 'receivables' | 'assets';

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('income');
  const [customStart, setCustomStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    d.setHours(0,0,0,0);
    return d;
  });
  const [customEnd, setCustomEnd] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const activePreset = React.useMemo(() => {
    const today = new Date();
    if (customEnd.toDateString() !== today.toDateString()) return 'custom';

    const checkStart = (mode: '7d' | '1m' | '3m') => {
      const targetStart = new Date();
      if (mode === '7d') targetStart.setDate(targetStart.getDate() - 6);
      else if (mode === '1m') targetStart.setMonth(targetStart.getMonth() - 1);
      else if (mode === '3m') targetStart.setMonth(targetStart.getMonth() - 3);
      return customStart.toDateString() === targetStart.toDateString();
    };

    if (checkStart('7d')) return '7d';
    if (checkStart('1m')) return '1m';
    if (checkStart('3m')) return '3m';
    return 'custom';
  }, [customStart, customEnd]);

  const applyPreset = (mode: '7d' | '1m' | '3m') => {
    const end = new Date();
    setCustomEnd(end);
    
    const start = new Date();
    if (mode === '7d') {
      start.setDate(start.getDate() - 6);
    } else if (mode === '1m') {
      start.setMonth(start.getMonth() - 1);
    } else if (mode === '3m') {
      start.setMonth(start.getMonth() - 3);
    }
    start.setHours(0,0,0,0);
    setCustomStart(start);
  };

  const { data: incomeData, isLoading: isLoadingIncomes } = useGetFinanceIncome(customStart, customEnd);
  const { data: receivablesData, isLoading: isLoadingReceivables } = useGetFinanceReceivables();
  const { data: assetsData, isLoading: isLoadingAssets } = useGetFinanceAssets();

  const safeIncomeSummary = incomeData?.summary || { totalThisPeriod: 0, chartData: [{ value: 0 }] };
  const safeReceivablesSummary = receivablesData?.summary || { storeCount: 0, totalDebt: 0 };
  const safeAssetsSummary = assetsData?.summary || { storeCount: 0, totalAssetValue: 0 };

  return (
    <>
    <ScrollView 
      className="flex-1 bg-background"
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'income' && (
        <View className="flex-1">
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row items-center gap-2 bg-surface-container-low p-2 rounded-lg mb-3">
              <TouchableOpacity 
                className="flex-1 py-2 px-2 bg-surface rounded-md border border-outline-variant items-center"
                onPress={() => setShowPicker('start')}
              >
                <Text className="text-[10px] text-text-secondary mb-0.5">Dari Tanggal</Text>
                <Text className="font-body-sm text-body-sm font-medium text-text-primary">
                  {customStart.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <Text className="text-text-secondary">-</Text>
              <TouchableOpacity 
                className="flex-1 py-2 px-2 bg-surface rounded-md border border-outline-variant items-center"
                onPress={() => setShowPicker('end')}
              >
                <Text className="text-[10px] text-text-secondary mb-0.5">Sampai Tanggal</Text>
                <Text className="font-body-sm text-body-sm font-medium text-text-primary">
                  {customEnd.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => applyPreset('7d')}
                className={`px-3 py-1.5 rounded-full border mr-2 ${activePreset === '7d' ? 'bg-primary border-primary' : 'bg-transparent border-outline'}`}
              >
                <Text className={`font-body-sm text-body-sm ${activePreset === '7d' ? 'text-on-primary font-medium' : 'text-text-secondary'}`}>7 Hari Terakhir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => applyPreset('1m')}
                className={`px-3 py-1.5 rounded-full border mr-2 ${activePreset === '1m' ? 'bg-primary border-primary' : 'bg-transparent border-outline'}`}
              >
                <Text className={`font-body-sm text-body-sm ${activePreset === '1m' ? 'text-on-primary font-medium' : 'text-text-secondary'}`}>1 Bulan Terakhir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => applyPreset('3m')}
                className={`px-3 py-1.5 rounded-full border mr-2 ${activePreset === '3m' ? 'bg-primary border-primary' : 'bg-transparent border-outline'}`}
              >
                <Text className={`font-body-sm text-body-sm ${activePreset === '3m' ? 'text-on-primary font-medium' : 'text-text-secondary'}`}>3 Bulan Terakhir</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <IncomeChartSection summary={{ income: safeIncomeSummary }} filterMode={activePreset} customStart={customStart} customEnd={customEnd} />
          <View className="mx-4 my-4 h-[1px] bg-outline-variant/50" />
          <View className="px-4 pb-8 flex-1">
            <IncomeContent incomes={incomeData?.list || []} isLoading={isLoadingIncomes} />
          </View>
        </View>
      )}

      {activeTab === 'receivables' && (
        <View className="flex-1">
          <ReceivablesSummarySection summary={{ receivables: safeReceivablesSummary }} />
          <View className="mx-4 my-4 h-[1px] bg-outline-variant/50" />
          <View className="px-4 pb-8 flex-1">
            <ReceivableContent receivables={receivablesData?.list || []} isLoading={isLoadingReceivables} />
          </View>
        </View>
      )}

      {activeTab === 'assets' && (
        <View className="flex-1">
          <AssetsSummarySection summary={{ assets: safeAssetsSummary }} />
          <View className="mx-4 my-4 h-[1px] bg-outline-variant/50" />
          <View className="px-4 pb-8 flex-1">
            <AssetContent assets={assetsData?.list || []} isLoading={isLoadingAssets} />
          </View>
        </View>
      )}
    </ScrollView>
    {showPicker && (
      <DateTimePicker
        value={showPicker === 'start' ? customStart : customEnd}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowPicker(null);
          if (selectedDate) {
            if (showPicker === 'start') {
              // Validasi: Dari Tanggal tidak boleh lebih dari Sampai Tanggal
              if (selectedDate > customEnd) {
                setCustomEnd(new Date(selectedDate));
              }
              setCustomStart(selectedDate);
            } else {
              // Validasi: Sampai Tanggal tidak boleh kurang dari Dari Tanggal
              if (selectedDate < customStart) {
                setCustomStart(new Date(selectedDate));
              }
              setCustomEnd(selectedDate);
            }
          }
        }}
      />
    )}
    </>
  );
}

// --- SUB-COMPONENTS ---

function IncomeChartSection({ summary, filterMode, customStart, customEnd }: { summary: any, filterMode: string, customStart?: Date, customEnd?: Date }) {
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
              Margin ({filterMode === '7d' ? '7 Hari Terakhir' : filterMode === '1m' ? '1 Bulan Terakhir' : filterMode === '3m' ? '3 Bulan Terakhir' : (customStart && customEnd ? `${customStart.toLocaleDateString('id-ID', { day: '2-digit', month: 'long' })} - ${customEnd.toLocaleDateString('id-ID', { day: '2-digit', month: 'long' })}` : 'Kustom')})
            </Text>
          </View>
          <Text className="font-display text-display font-bold tracking-tight text-on-primary" numberOfLines={1}>
            {formatRupiah(summary.income.totalThisPeriod)}
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
    <View className="px-4 mt-4 flex-col">
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
    <View className="px-4 mt-4 flex-col">
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
    <View className="flex-col pb-4">
      <Text className="text-body-sm text-text-secondary px-1 mb-4">
        Riwayat pembayaran uang tunai dari kunjungan toko. Ketuk kartu untuk melihat nota.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : incomes.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Belum ada data pembayaran pada periode ini.</Text>
        </View>
      ) : (
        <View className="flex-col gap-2">
          {incomes.map((item, idx) => {
            const showDateHeader = idx === 0 || incomes[idx - 1].date !== item.date;

            return (
              <React.Fragment key={idx}>
                {showDateHeader && (
                  <Text className={`font-body-sm text-body-sm font-bold text-text-secondary ml-1 mb-1 ${idx > 0 ? 'mt-3' : ''}`}>
                    {item.date}
                  </Text>
                )}
                <Link href={`/(tabs)/visit-invoice?id=${item.visitId}`} asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Card className="p-3 flex-row items-center justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="font-semibold text-body-sm text-text-primary" numberOfLines={1}>
                          {item.storeName}
                        </Text>
                      </View>
                      <View className="items-end shrink-0">
                        <Text className="font-bold text-body-sm text-success">
                          + {formatRupiah(item.amount)}
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </Link>
              </React.Fragment>
            );
          })}
        </View>
      )}
    </View>
  );
}

function ReceivableContent({ receivables, isLoading }: { receivables: any[], isLoading: boolean }) {
  return (
    <View className="flex-col gap-4">
      <Text className="text-body-sm text-text-secondary px-1">
        Daftar tagihan aktif. Sisa hutang selalu berpindah dan diakumulasikan ke riwayat kunjungan paling akhir. Ketuk kartu untuk melihat detail toko.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : receivables.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Tidak ada tagihan aktif.</Text>
        </View>
      ) : (
        receivables.map((item, idx) => (
          <Link href={`/(tabs)/store-detail?id=${item.storeId}`} asChild key={idx}>
            <TouchableOpacity activeOpacity={0.7}>
              <Card className="p-3 flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-body-sm text-text-primary" numberOfLines={1}>
                    {item.storeName}
                  </Text>
                </View>
                <View className="items-end shrink-0">
                  <Text className="font-bold text-body-sm text-error">
                    {formatRupiah(item.debt)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Link>
        ))
      )}
    </View>
  );
}

function AssetContent({ assets, isLoading }: { assets: any[], isLoading: boolean }) {
  return (
    <View className="flex-col gap-4">
      <Text className="text-body-sm text-text-secondary px-1">
        Sebaran data nilai dan barang titipan terakhir di masing-masing toko. Ketuk kartu untuk melihat stok.
      </Text>
      
      {isLoading ? (
        <ActivityIndicator className="py-8" color={THEME.colors.primary} />
      ) : assets.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-text-secondary font-body-sm text-body-sm">Belum ada aset titipan yang tercatat.</Text>
        </View>
      ) : (
        assets.map((item, idx) => (
          <Link href={`/(tabs)/store-detail?id=${item.storeId}`} asChild key={idx}>
            <TouchableOpacity activeOpacity={0.7}>
              <Card className="p-3 flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-body-sm text-text-primary" numberOfLines={1}>
                    {item.storeName}
                  </Text>
                </View>
                <View className="items-end shrink-0">
                  <Text className="font-bold text-body-sm text-primary">
                    {formatRupiah(item.assetValue)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Link>
        ))
      )}
    </View>
  );
}
