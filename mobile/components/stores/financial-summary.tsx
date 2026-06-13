import React from 'react';
import { View, Text } from 'react-native';
import { Wallet, TrendingUp } from 'lucide-react-native';
import THEME from '../../constants/css';

interface FinancialSummaryProps {
  debt: number;
  assetValue: number;
}

export function FinancialSummary({ debt, assetValue }: FinancialSummaryProps) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1 bg-error p-3 rounded-xl flex-col">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Wallet size={16} color={THEME.colors['on-error']} />
          <Text className="text-caption font-medium text-on-error">Hutang</Text>
        </View>
        <Text className="font-h2 text-h3 font-bold text-on-error">
          {debt > 0 ? `Rp ${debt.toLocaleString("id-ID")}` : "Rp 0"}
        </Text>
      </View>
      
      <View className="flex-1 bg-success p-3 rounded-xl flex-col">
        <View className="flex-row items-center gap-1.5 mb-1">
          <TrendingUp size={16} color={THEME.colors['on-success']} />
          <Text className="text-caption font-medium text-on-success">Nilai Aset</Text>
        </View>
        <Text className="font-h2 text-h3 font-bold text-on-success">
          {assetValue > 0 ? `Rp ${assetValue.toLocaleString("id-ID")}` : "Rp 0"}
        </Text>
      </View>
    </View>
  );
}
