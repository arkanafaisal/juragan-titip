import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SquarePen } from 'lucide-react-native';
import { Card } from '../ui/card';
import THEME from '../../constants/css';
import { formatRupiah } from '../../utils/formatter.util';

interface ProductInfoCardProps {
  product: any;
  categoryLabels: Record<string, string>;
  onEdit: () => void;
}

export function ProductInfoCard({ product, categoryLabels, onEdit }: ProductInfoCardProps) {
  return (
    <Card className="flex-col mb-4">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-h2 font-bold text-text-primary flex-1 mr-2">{product.name}</Text>
        <TouchableOpacity 
          onPress={onEdit}
          disabled={product.isArchived}
          className="p-1.5 shrink-0"
          activeOpacity={0.7}
        >
          <SquarePen size={THEME.iconSize['md']} color={product.isArchived ? THEME.colors['outline'] : THEME.colors['warning']} />
        </TouchableOpacity>
      </View>
      
      <Text className={`text-body-sm mb-4 ${product.description ? 'text-text-primary' : 'text-text-secondary italic'}`}>
        {product.description || 'Tidak ada deskripsi'}
      </Text>
      
      <View className="flex-col mt-2 space-y-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-secondary shrink-0">Kategori</Text>
          <Text className="text-text-primary font-medium capitalize text-right flex-1 ml-4" numberOfLines={1}>
            {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-secondary">Modal</Text>
          <Text className="text-text-primary font-medium">{formatRupiah(product.costPrice)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-secondary">Jual (Toko)</Text>
          <Text className="text-primary font-medium">{formatRupiah(product.wholesalePrice)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-text-secondary">Harga Ecer</Text>
          <Text className={`${product.retailPrice ? 'font-medium text-text-primary font-medium' : 'text-right flex-1 text-text-secondary italic text-body-sm'}`}>
            {product.retailPrice ? formatRupiah(product.retailPrice) : 'Belum diatur'}
          </Text>
        </View>
      </View>
    </Card>
  );
}
