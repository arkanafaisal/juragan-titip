import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Scale } from 'lucide-react-native';
import { Card } from '../ui/card';
import THEME from '../../constants/css';

interface ReturnManagementCardProps {
  product: any;
  onProcessReturn: () => void;
}

export function ReturnManagementCard({ product, onProcessReturn }: ReturnManagementCardProps) {
  return (
    <Card className="flex-col mb-4">
      <Text className="text-h3 font-bold text-text-primary mb-1 uppercase">Manajemen Retur</Text>
      <Text className="text-caption text-text-secondary mb-4 font-medium">
        Terdapat <Text className="text-error font-bold">{product.returnedStock || 0} Pcs</Text> barang retur di tangan Anda.
      </Text>
      <TouchableOpacity 
        onPress={onProcessReturn}
        disabled={product.isArchived || !product.returnedStock || product.returnedStock === 0}
        className={`w-full py-3 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? 'bg-surface-variant' : 'bg-success'}`}
        activeOpacity={0.8}
      >
        <Scale size={THEME.iconSize['sm']} color={(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? THEME.colors['on-surface-variant'] : THEME.colors['on-success']} />
        <Text className={`font-bold ${(product.isArchived || !product.returnedStock || product.returnedStock === 0) ? 'text-on-surface-variant' : 'text-on-success'}`}>
          OLAH BARANG RETUR
        </Text>
      </TouchableOpacity>
    </Card>
  );
}
