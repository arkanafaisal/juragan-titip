import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RefreshCw, Trash2, Store as StoreIcon, Pencil, Package } from 'lucide-react-native';
import THEME from '../../constants/css';
import { formatDate, formatRelativeTime } from '../../utils/formatter.util';

import { InventoryLogType, inventoryLogs } from '../../db/schema';

type InventoryLog = typeof inventoryLogs.$inferSelect;

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

interface ActivityLogsProps {
  logs: InventoryLog[];
  isLoading: boolean;
  filterValue?: InventoryLogType;
  onFilterChange?: (value: InventoryLogType) => void;
}

const FILTER_OPTIONS: { label: string; value: InventoryLogType }[] = [
  { label: 'Titipan', value: 'TITIPAN' },
  { label: 'Tarik Retur', value: 'TARIK_RETUR' },
  { label: 'Olah Retur', value: 'OLAH_RETUR' },
  { label: 'Kulakan', value: 'KULAKAN' },
  { label: 'Buang', value: 'BUANG_RUSAK' },
  { label: 'Koreksi', value: 'KOREKSI' },
];

export function ActivityLogs({ logs, isLoading, filterValue, onFilterChange }: ActivityLogsProps) {
  return (
    <View className="bg-surface p-4 rounded-2xl border border-outline-variant mt-2 mb-4">
      <View className="border-b pb-3 mb-4 border-outline-variant flex-row justify-between items-center">
        <Text className="text-h3 font-bold text-text-primary uppercase">Riwayat Aktivitas ( 30 hari )</Text>
      </View>

      {onFilterChange && (
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {FILTER_OPTIONS.map((opt) => {
              const isActive = filterValue === opt.value;
              return (
                <TouchableOpacity 
                  key={opt.value}
                  onPress={() => onFilterChange && onFilterChange(opt.value)}
                  className={`mr-2 px-3 py-1.5 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-surface border-outline-variant'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-body-sm font-medium ${isActive ? 'text-on-primary' : 'text-text-secondary'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView 
        style={{ height: 350 }}
        className="overflow-hidden" 
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <View className="flex-col gap-3 relative pb-4">
          {isLoading ? (
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
      </ScrollView>
    </View>
  );
}
