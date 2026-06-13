import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import THEME from '../../constants/css';

interface StepIndicatorProps {
  current: number;
  target: number;
  label?: string;
  num: string | number;
}

export const StepIndicator = ({ current, target, label, num }: StepIndicatorProps) => {
  const isPast = current > target;
  const isActive = current === target;
  
  return (
    <View className="flex-row items-center gap-1">
      {isPast ? (
        <CheckCircle2 size={THEME.iconSize.xl} color={THEME.colors.success} />
      ) : (
        <View className={`w-8 h-8 rounded-full items-center justify-center ${isActive ? 'bg-primary' : 'bg-surface-container-high'}`}>
          <Text className={`text-h3 font-bold ${isActive ? 'text-on-primary' : 'text-text-secondary'}`}>
            {num}
          </Text>
        </View>
      )}
    </View>
  );
};
