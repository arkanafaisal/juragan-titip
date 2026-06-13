import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PackagePlus, Pencil } from 'lucide-react-native';
import { Card } from '../ui/card';
import THEME from '../../constants/css';

interface WarehouseStockCardProps {
  product: any;
  onCorrection: () => void;
  onAddStock: () => void;
}

export function WarehouseStockCard({ product, onCorrection, onAddStock }: WarehouseStockCardProps) {
  return (
    <Card className="flex-col mb-4">
      <Text className="text-h3 font-bold text-text-primary mb-2 uppercase">Stok Gudang</Text>
      <View className="flex-row items-end gap-1 mb-4">
        <Text className="text-[40px] font-bold text-text-primary leading-[48px]">{product.warehouseStock}</Text>
        <Text className="text-body text-text-secondary mb-1">Pcs</Text>
      </View>
      
      <View className="flex-row gap-2">
        <TouchableOpacity 
          onPress={onCorrection}
          disabled={product.isArchived}
          className={`flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl shrink-0 ${product.isArchived ? 'bg-surface-variant' : 'bg-warning'}`}
          activeOpacity={0.8}
        >
          <Pencil size={THEME.iconSize['sm']} color={product.isArchived ? THEME.colors['on-surface-variant'] : THEME.colors['on-warning']} />
          <Text className={`font-bold ${product.isArchived ? 'text-on-surface-variant' : 'text-on-warning'}`}>Koreksi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onAddStock}
          disabled={product.isArchived}
          className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 shadow-sm ${product.isArchived ? 'bg-surface-variant' : 'bg-primary'}`}
          activeOpacity={0.8}
        >
          <PackagePlus size={THEME.iconSize['md']} color={product.isArchived ? THEME.colors['on-surface-variant'] : THEME.colors['on-primary']} />
          <Text className={`font-bold ${product.isArchived ? 'text-on-surface-variant' : 'text-on-primary'}`}>Tambah Stok</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
