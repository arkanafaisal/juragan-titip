import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { 
  Wallet, 
  Navigation, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Inbox
} from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';

import { formatRupiah } from '../../utils/formatter.util';
import { useGetDashboardData } from '../../api/dashboard.api';

export default function DashboardScreen() {
  const { data: dashboardData, isLoading } = useGetDashboardData();

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
    weeklyRevenue: 0,
    totalVisitsThisWeek: 0,
    chartData: [],
    todayHistory: []
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

      {/* 2. PENDAPATAN MINGGU INI */}
      <Card className="w-full flex-col justify-between mb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-8 h-8 rounded-full bg-success/10 items-center justify-center shrink-0">
            <Wallet size={16} color={THEME.colors.success} />
          </View>
          <Text className="font-body-sm text-body-sm font-semibold text-text-secondary">
            Pemasukan 7 Hari Terakhir
          </Text>
        </View>
        <View className="mt-1">
          <Text className="text-3xl font-bold tracking-tight text-text-primary" numberOfLines={1}>
            {formatRupiah(data.weeklyRevenue)}
          </Text>
        </View>
      </Card>

      {/* 3. JOURNEY HOOK */}
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

      {/* 5. RIWAYAT HARI INI */}
      <Card className="mb-6">
        <View className="flex-row items-center gap-2 mb-4">
          <Clock size={16} color={THEME.colors.primary} />
          <Text className="font-h3 text-h3 font-bold text-text-primary">Riwayat Hari Ini</Text>
        </View>
        
        <View className="flex-col">
          {data.todayHistory.length > 0 ? (
            data.todayHistory.map((item, index) => (
              <TouchableOpacity 
                key={item.id}
                className={`flex-row items-center justify-between p-3 rounded-xl border border-outline-variant ${index !== 0 ? 'mt-2' : ''}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-start gap-3 flex-1 pr-2">
                  <Text className="font-data-sm text-data-sm text-text-secondary mt-0.5 w-12 shrink-0">
                    {item.time}
                  </Text>
                  <View className="flex-1">
                    <Text className="font-body-sm text-body-sm font-semibold text-text-primary" numberOfLines={1}>
                      {item.store}
                    </Text>
                    <Text className="font-caption text-caption text-text-secondary mt-0.5">
                      ↳ Masuk: <Text className={`font-semibold ${item.isDebt ? 'text-warning' : 'text-success'}`}>
                        {item.isDebt ? `${formatRupiah(item.amount)} (Piutang)` : formatRupiah(item.amount)}
                      </Text>
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color={THEME.colors['text-muted']} />
              </TouchableOpacity>
            ))
          ) : (
            <View className="py-8 items-center justify-center opacity-70">
              <Inbox size={32} color={THEME.colors['text-secondary']} className="mb-2" />
              <Text className="font-body-sm text-body-sm text-text-secondary">
                Belum ada kunjungan hari ini.
              </Text>
            </View>
          )}
        </View>
      </Card>

    </ScrollView>
  );
}