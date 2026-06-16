import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { 
  Navigation, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';

import { useGetDashboardData } from '../../api/dashboard.api';
import { useGetCriticalStockProducts } from '../../api/products.api';
import { useGetOverdueStores } from '../../api/stores.api';
import { useSettingsStore } from '../../api/settings.api';

const getRelativeDateString = (dateStr: string | null) => {
  if (!dateStr) return 'Belum Pernah';
  
  const visitDate = new Date(dateStr);
  const now = new Date();
  
  visitDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = now.getTime() - visitDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  
  const relativeText = diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Kemarin' : `${diffDays} hari lalu`;
  const staticText = visitDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  
  return `${relativeText} (${staticText})`;
};

export default function DashboardScreen() {
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetDashboardData();
  const { data: overdueStores = [] } = useGetOverdueStores();
  const { data: criticalStock = { outOfStock: [], lowStock: [] }, isLoading: isLoadingStock } = useGetCriticalStockProducts();
  const storeOverdueDays = useSettingsStore(state => state.storeOverdueDays);
  const lowStockThreshold = useSettingsStore(state => state.lowStockThreshold);

  const isLoading = isLoadingDashboard || isLoadingStock;

  const todayDate = new Intl.DateTimeFormat('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(new Date());

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; 
  const barWidth = 28;
  const spacing = Math.max((chartWidth - (7 * barWidth)) / 7, 10);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  const data = dashboardData || {
    totalVisitsThisWeek: 0,
    chartData: [],
    recentHistory: []
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HEADER & GREETING */}
      <View className="flex-col gap-1 mb-6">
        <Text className="font-h1 text-h1 font-bold text-text-primary">
          Halo, Juragan! 👋
        </Text>
        <Text className="font-body-sm text-body-sm text-text-secondary">
          {todayDate}
        </Text>
      </View>

      {/* 2. TOKO OVERDUE */}
      <View className={`mb-6 p-4 rounded-2xl shadow-sm ${overdueStores.length > 0 ? 'bg-warning/70' : 'bg-success'}`}>
        <View className="mb-4">
          <Text className={`font-h3 text-h3 font-bold ${overdueStores.length > 0 ? 'text-on-warning' : 'text-on-success'}`}>
            {overdueStores.length} Toko Perlu Dikunjungi <Text className="font-body-sm text-body-sm font-normal opacity-80">{`(> ${storeOverdueDays} hari)`}</Text>
          </Text>
        </View>
        
        {overdueStores.length > 0 ? (
          <ScrollView 
            style={{ maxHeight: 165 }} 
            nestedScrollEnabled 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View className="flex-row flex-wrap gap-2">
              {overdueStores.map((store) => (
                <Link href={`/store-detail?id=${store.id}`} asChild key={store.id}>
                  <TouchableOpacity 
                    className="p-3 rounded-xl bg-surface-container-lowest flex-grow max-w-[48%]"
                    style={{ minWidth: '48%' }}
                    activeOpacity={0.7}
                  >
                    <Text 
                      className="font-body-sm text-body-sm font-semibold text-text-primary" 
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {store.name}
                    </Text>
                    <Text className="font-caption text-[10px] text-text-secondary mt-1" numberOfLines={1}>
                      {getRelativeDateString(store.lastVisitAt)}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="items-center justify-center py-4">
            <Text className="text-3xl mb-2">🎉</Text>
            <Text className="font-body-sm text-body-sm font-bold text-on-success text-center">
              Luar Biasa!
            </Text>
            <Text className="font-caption text-caption text-on-success text-center mt-1">
              Semua toko sudah Anda kunjungi tepat waktu.
            </Text>
          </View>
        )}
      </View>

      {/* 3. PERINGATAN STOK */}
      <View className={`mb-6 p-4 rounded-2xl shadow-sm ${(criticalStock.outOfStock.length > 0 || criticalStock.lowStock.length > 0) ? 'bg-error/70' : 'bg-success'}`}>
        <View className="mb-4">
          <Text className={`font-h3 text-h3 font-bold ${(criticalStock.outOfStock.length > 0 || criticalStock.lowStock.length > 0) ? 'text-on-error' : 'text-on-success'}`}>
            {criticalStock.outOfStock.length} Habis, {criticalStock.lowStock.length} Menipis <Text className="font-body-sm text-body-sm font-normal opacity-80">{`(≤ ${lowStockThreshold})`}</Text>
          </Text>
        </View>
        
        {(criticalStock.outOfStock.length > 0 || criticalStock.lowStock.length > 0) ? (
          <ScrollView 
            style={{ maxHeight: 125, overflow: 'hidden' }} 
            nestedScrollEnabled 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <View className="flex-row flex-wrap gap-2">
              {criticalStock.outOfStock.map(p => (
                <Link href={`/product-detail?id=${p.id}`} asChild key={p.id}>
                  <TouchableOpacity 
                    className="p-3 rounded-xl bg-surface-container-lowest flex-row items-center justify-between flex-grow max-w-[48%]" 
                    style={{ minWidth: '48%' }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-1 pr-2">
                      <Text className="font-body-sm text-body-sm font-semibold text-text-primary" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{p.name}</Text>
                    </View>
                    <View className="bg-error shrink-0 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] font-bold text-white">Habis</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
              {criticalStock.lowStock.map(p => (
                <Link href={`/product-detail?id=${p.id}`} asChild key={p.id}>
                  <TouchableOpacity 
                    className="p-3 rounded-xl bg-surface-container-lowest flex-row items-center justify-between flex-grow max-w-[48%]" 
                    style={{ minWidth: '48%' }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-1 pr-2">
                      <Text className="font-body-sm text-body-sm font-semibold text-text-primary" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{p.name}</Text>
                    </View>
                    <View className="bg-warning shrink-0 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] font-bold text-on-warning">Sisa {p.warehouseStock}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="items-center justify-center py-4">
            <Text className="text-3xl mb-2">📦</Text>
            <Text className="font-body-sm text-body-sm font-bold text-on-success text-center">
              Stok Aman!
            </Text>
            <Text className="font-caption text-caption text-on-success text-center mt-1">
              Tidak ada produk yang kehabisan stok.
            </Text>
          </View>
        )}
      </View>

      {/* 4. JOURNEY HOOK */}
      <Link href="/journey" asChild>
        <TouchableOpacity className="w-full mb-4" activeOpacity={0.8}>
          {/* Gunakan View biasa, bukan Card, agar bg-primary tidak ditimpa oleh default Card (white) */}
          <View className="bg-primary rounded-2xl shadow-sm overflow-hidden p-5">
            {/* Ornamen Background diletakkan di atas agar berada di layer bawah secara Native */}
            <View className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-2 mb-1">
                  <Navigation size={20} color={THEME.colors['on-primary']} /> 
                  <Text className="font-h2 text-h2 font-bold text-on-primary">
                    Mulai Rute Keliling
                  </Text>
                </View>
                <Text className="font-body-sm text-body-sm text-on-primary opacity-80 mt-1">
                  Temukan dan kunjungi toko terdekat dari lokasimu sekarang.
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center shrink-0">
                <ArrowRight size={20} color={THEME.colors['on-primary']} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>

      {/* 4. GRAFIK KUNJUNGAN MINGGU INI */}
      <Card className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-h3 text-h3 font-bold text-text-primary">Kunjungan</Text>
            <Text className="font-caption text-caption text-text-secondary">7 Hari Terakhir (Total: {data.totalVisitsThisWeek})</Text>
          </View>
          <View className="p-2 bg-surface-container-low rounded-lg">
            <TrendingUp size={16} color={THEME.colors.primary} />
          </View>
        </View>
        
        <View className="h-[150px] w-full mt-2">
          {data.totalVisitsThisWeek === 0 ? (
            <View className="flex-1 items-center justify-center opacity-70">
              <Inbox size={32} color={THEME.colors['text-secondary']} className="mb-2" />
              <Text className="font-caption text-caption text-text-secondary">Belum ada kunjungan dalam 7 hari terakhir</Text>
            </View>
          ) : (
            <BarChart
              data={data.chartData.map(d => ({
                value: d.value,
                label: d.label,
                frontColor: d.value > 0 ? THEME.colors.primary : THEME.colors['surface-container-high'],
                topLabelComponent: () => (
                  <Text className="font-caption text-[10px] text-text-secondary mb-1">{d.value}</Text>
                )
              }))}
              barWidth={barWidth}
              spacing={spacing}
              initialSpacing={0}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: THEME.colors['text-secondary'], fontSize: 12 }}
              height={120}
              isAnimated
            />
          )}
        </View>
      </Card>

      {/* 5. RIWAYAT KUNJUNGAN */}
      <Card>
        <View className="flex-row items-center gap-2 mb-4">
          <Clock size={16} color={THEME.colors.primary} />
          <Text className="font-h3 text-h3 font-bold text-text-primary">Riwayat 7 Hari Terakhir</Text>
        </View>
        
        <ScrollView 
          style={{ height: 350 }}
          className="overflow-hidden" 
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={data.recentHistory.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : {}}
        >
          {data.recentHistory.length > 0 ? (
            data.recentHistory.map((item, index) => (
              <Link href={`/visit-invoice?id=${item.id}`} asChild key={item.id}>
                <TouchableOpacity 
                  className={`flex-row items-center justify-between px-3 rounded-xl border border-outline-variant ${index !== 0 ? 'mt-2' : ''}`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2 py-2">
                  <Text className="font-data-sm text-data-sm text-text-secondary w-[70px] shrink-0">
                    {item.time}
                  </Text>
                  <View className="flex-1">
                    <Text className="font-body-sm text-body-sm font-semibold text-text-primary" numberOfLines={1}>
                      {item.store}
                    </Text>
                  </View>
                </View>

                <View className="flex-col items-start shrink-0 pl-2 max-w-[120px]">
                  {item.restockedItems.length > 0 ? (
                    item.restockedItems.slice(0, 3).map((prod, idx) => (
                      <Text key={idx} className="text-[10px] leading-[14px] text-text-secondary text-right" numberOfLines={1}>
                        <Text className="font-semibold text-text-primary">+{prod.quantity}</Text> {prod.name}
                      </Text>
                    ))
                  ) : (
                    <Text className="text-[10px] text-text-muted text-right">
                      -
                    </Text>
                  )}
                </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <View className="items-center justify-center opacity-70">
              <Inbox size={32} color={THEME.colors['text-secondary']} className="mb-2" />
              <Text className="font-body-sm text-body-sm text-text-secondary">
                Belum ada kunjungan dalam 7 hari terakhir.
              </Text>
            </View>
          )}
        </ScrollView>
      </Card>

    </ScrollView>
  );
}