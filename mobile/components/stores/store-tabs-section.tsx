import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package, History } from 'lucide-react-native';
import { Card } from '../ui/card';
import THEME from '../../constants/css';

interface StoreTabsSectionProps {
  activeItems: any[];
  visitHistory: any[];
  formatDate: (iso: string) => string;
}

export function StoreTabsSection({ activeItems, visitHistory, formatDate }: StoreTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'titipan' | 'riwayat'>('titipan');

  return (
    <Card className="flex-col p-0 overflow-hidden">
      <View className='mb-2'>
        <View className="flex-row">
          <TouchableOpacity 
            onPress={() => setActiveTab('titipan')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'titipan' ? 'bg-primary' : ''}`}
          >
            <Text className={`font-semibold text-body-sm ${activeTab === 'titipan' ? 'text-on-primary' : 'text-text-secondary'}`}>
              Titipan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('riwayat')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'riwayat' ? 'bg-primary' : ''}`}
          >
            <Text className={`font-semibold text-body-sm ${activeTab === 'riwayat' ? 'text-on-primary' : 'text-text-secondary'}`}>
              Riwayat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="py-4">
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
              <Package size={48} color={THEME.colors['outline-variant']} />
              <Text className="font-body text-body-sm text-text-secondary text-center mt-2">Tidak ada barang titipan aktif.</Text>
            </View>
          )
        ) : (
          visitHistory && visitHistory.length > 0 ? (
            <View className="flex-col gap-2">
              <Text className="font-caption text-[10px] text-text-muted mb-2 italic px-1">Menampilkan maksimal 10 riwayat kunjungan terakhir.</Text>
              {visitHistory.map((visit) => (
                <TouchableOpacity 
                  key={visit.id} 
                  className="w-full flex-row justify-between items-center p-3 border border-outline-variant rounded-lg bg-surface"
                  activeOpacity={0.7}
                >
                  <View className="flex-col gap-1">
                    <Text className="font-body text-body text-text-primary font-medium">
                      {formatDate(visit.createdAt)}
                    </Text>
                    <Text className="font-caption text-[10px] text-text-secondary">
                      Dokumen: VST-{visit.id.toString().padStart(5, '0')}
                    </Text>
                  </View>
                  <View className="flex-col gap-1 items-end">
                    <Text className="font-body text-body text-text-primary font-bold">
                      Rp {visit.amountPaid.toLocaleString("id-ID")}
                    </Text>
                    <Text className="font-caption text-[10px] text-text-secondary">
                      Pembayaran
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="py-8 flex-col items-center justify-center">
              <History size={48} color={THEME.colors['outline-variant']} />
              <Text className="font-body text-body-sm text-text-secondary text-center mt-2">Tidak ada riwayat kunjungan</Text>
            </View>
          )
        )}
      </View>
    </Card>
  );
}
