import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Store as StoreIcon, History } from 'lucide-react-native';
import { formatRupiah, formatRelativeTime } from '../../utils/formatter.util';
import THEME from '../../constants/css';

import { Card } from '../ui/card';
import { Store } from '../../db/schema/stores.schema';
import { Product } from '../../db/schema/products.schema';


const getCategoryStyles = (category?: string) => {
  if (category === "1") return { bg: "bg-primary", text: "text-on-primary", border: "border-primary" };
  if (category === "2") return { bg: "bg-success", text: "text-on-success", border: "border-success" };
  if (category === "3") return { bg: "bg-warning", text: "text-on-warning", border: "border-warning" };
  if (category === "4") return { bg: "bg-secondary", text: "text-on-secondary", border: "border-secondary" };
  if (category === "5") return { bg: "bg-background", text: "text-on-background", border: "border-background" };
  return { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant" };
};

interface ItemCardProps {
  store?: Store;
  product?: Product;
  storeCategoryLabels?: Record<string, string>;
  categoryLabels?: Record<string, string>;
  lowStockThreshold?: number;
}

export function ItemCard({ store, product, storeCategoryLabels, categoryLabels, lowStockThreshold = 0 }: ItemCardProps) {
  const router = useRouter();
  
  const data = store || product;
  if (!data) return null;

  const isStore = !!store;
  const labels = storeCategoryLabels || categoryLabels || {};
  
  const catStyle = getCategoryStyles(data.category);
  const displayCategory = data.category ? labels[data.category as keyof typeof labels] || data.category : null;

  const title = data.name;
  const desc = isStore 
    ? `${(data as Store).ownerName} • ${(data as Store).phone || '-'}` 
    : ((data as Product).description || "Belum ada deskripsi");

  return (
    <Card className={`p-0 bg-surface overflow-hidden mb-4 border-2 ${data.category ? catStyle.border : ''}`}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => router.push(isStore ? `/store-detail?id=${data.id}` as any : `/product-detail?id=${data.id}` as any)}
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-h3 font-bold text-text-primary" numberOfLines={1}>{title}</Text>
            <Text className="text-body-sm text-text-secondary mt-1" numberOfLines={1}>{desc}</Text>
          </View>
          <View className="items-end gap-1 shrink-0">
            {displayCategory && (
              <View className={`px-2 py-0.5 rounded ${catStyle.bg} max-w-[120px]`}>
                <Text className={`text-[10px] font-bold tracking-wide uppercase ${catStyle.text}`} numberOfLines={1}>
                  {displayCategory}
                </Text>
              </View>
            )}
            {isStore && (
              <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-md ${
                (data as Store).lastVisitAt ? 'bg-success' : 'bg-error'
              }`}>
                <History size={12} color={(data as Store).lastVisitAt ? THEME.colors['on-success'] : THEME.colors['on-error']} />
                <Text className={`text-[10px] font-caption ${
                  (data as Store).lastVisitAt ? 'text-on-success' : 'text-on-error'
                }`}>
                  {(data as Store).lastVisitAt ? formatRelativeTime((data as Store).lastVisitAt!) : "Belum pernah"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isStore && (
          <View className="flex-row items-start gap-1 mb-4">
            <MapPin size={THEME.iconSize['sm']} color={THEME.colors['outline']} className="mt-0.5" />
            <Text className="text-body-sm text-text-secondary flex-1" numberOfLines={2}>
              {(data as Store).address}
            </Text>
          </View>
        )}

        <View className={`flex-row justify-between mt-4 ${isStore? "mb-2" : ""}`}>
          <View className="flex-col gap-0.5 flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-caption text-text-secondary">{isStore ? "Nilai Aset" : "Jumlah Stok"}</Text>
            </View>
            <Text className={`text-data-md font-bold ${
              isStore
                ? ((data as Store).assetValue > 0 ? 'text-success' : 'text-warning')
                : (data as Product).warehouseStock === 0 ? 'text-error' : (data as Product).warehouseStock > lowStockThreshold ? "text-success" : "text-warning"
              }`}>
                {isStore ? formatRupiah((data as Store).assetValue || 0) : (data as Product).warehouseStock}
            </Text>
          </View>
          
          <View className="flex-col gap-0.5 flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-caption text-text-secondary">{isStore ? "Hutang" : "Jumlah Retur"}</Text>
            </View>
            <Text className={`text-data-md font-bold ${
              isStore 
                ? ((data as Store).debt === 0 ? 'text-success' : (data as Store).debt > 1000000 ? 'text-error' : 'text-warning')
                : (((data as Product).returnedStock || 0) > 0 ? 'text-error' : 'text-success')
            }`}>
              {isStore 
                ? ((data as Store).debt === 0 ? "Rp 0" : formatRupiah((data as Store).debt)) 
                : ((data as Product).returnedStock || 0)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isStore && (
        <View className="bg-surface-bright flex-row gap-3">
          <TouchableOpacity 
            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${(data as Store).latitude},${(data as Store).longitude}`)}
            className="flex-1 border border-outline-variant bg-on-background/85 py-2 rounded-lg flex-row items-center justify-center gap-1"
            activeOpacity={0.7}
          >
            <MapPin size={THEME.iconSize['sm']} color={THEME.colors['on-primary']} />
            <Text className="text-on-primary text-body-sm font-medium">Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push(`/store-visit?id=${data.id}` as any)}
            className="flex-1 bg-primary py-2 rounded-lg flex-row items-center justify-center gap-1"
            activeOpacity={0.7}
          >
            <StoreIcon size={THEME.iconSize['sm']} color={THEME.colors['on-primary']} />
            <Text className="text-on-primary text-body-sm font-medium">Kunjungi</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}
