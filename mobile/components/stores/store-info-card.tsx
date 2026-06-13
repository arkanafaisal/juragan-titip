import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SquarePen, MapPin, User, Phone, Navigation, History, StickyNote } from 'lucide-react-native';
import { Card } from '../ui/card';
import { MapPicker } from '../shared/map-picker';
import THEME from '../../constants/css';

interface StoreInfoCardProps {
  store: any;
  onEdit: () => void;
  onVisit: () => void;
  formatDate: (iso: string) => string;
}

export function StoreInfoCard({ store, onEdit, onVisit, formatDate }: StoreInfoCardProps) {
  return (
    <Card className="flex-col !p-0 overflow-hidden">
      <View className="p-4 flex-col justify-between">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 pr-2">
            <View className={`self-start flex-row items-center gap-1 px-2 py-0.5 rounded-full mb-2 ${store.lastVisitAt ? 'bg-primary/10' : 'bg-surface-variant'}`}>
              <History size={12} color={store.lastVisitAt ? THEME.colors.primary : THEME.colors['text-secondary']} />
              <Text className={`font-caption text-[10px] font-medium ${store.lastVisitAt ? 'text-primary' : 'text-text-secondary'}`}>
                {store.lastVisitAt ? `Terakhir: ${formatDate(store.lastVisitAt)}` : "Belum pernah dikunjungi"}
              </Text>
            </View>
            <Text className="font-h2 text-h2 text-text-primary tracking-tight">{store.name}</Text>
          </View>
          <TouchableOpacity 
            onPress={onEdit}
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
            onPress={onVisit}
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
  );
}
