import React from 'react';
import { View, Text } from 'react-native';
import { RefreshCw, Trash2, Store as StoreIcon, Pencil, Package } from 'lucide-react-native';
import THEME from '../../constants/css';
import { formatDate, formatRelativeTime } from '../../utils/formatter.util';

const getLogConfig = (log: any) => {
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
  logs: any[];
  isLoading: boolean;
}

export function ActivityLogs({ logs, isLoading }: ActivityLogsProps) {
  return (
    <View className="bg-surface p-4 rounded-2xl border border-outline-variant mt-2 mb-4">
      <View className="border-b pb-3 mb-4 border-outline-variant">
        <Text className="text-h3 font-bold text-text-primary uppercase">Riwayat Aktivitas ( 30 hari )</Text>
      </View>

      <View className="flex-col gap-3 relative">
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
    </View>
  );
}
