import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import THEME from '../../constants/css';
import { StepIndicator } from './step-indicator';

interface VisitHeaderProps {
  storeName: string;
  step: number;
  onPrevStep: () => void;
}

export const VisitHeader = ({ storeName, step, onPrevStep }: VisitHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between bg-surface p-4 border-b border-outline-variant mb-4">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity 
          onPress={onPrevStep} 
          className="p-1 rounded-lg"
        >
          <ChevronLeft size={THEME.iconSize.lg} color={THEME.colors['text-secondary']} />
        </TouchableOpacity>
        <Text className="font-h4 text-h4 font-bold text-text-primary truncate flex-1" numberOfLines={1}>
          {storeName}
        </Text>
      </View>
      
      <View className="flex-row items-center ml-2 shrink-0">
        <StepIndicator current={step} target={1} label="Opname" num="1" />
        <View className={`w-2 h-[1px] ${step < 2? 'bg-outline-variant' :  step == 2? 'bg-primary' : 'bg-success'}`} />
        <StepIndicator current={step} target={2} label="Restock" num="2" />
        <View className={`w-2 h-[1px] ${step < 3? 'bg-outline-variant' : 'bg-primary'}`} />
        <StepIndicator current={step} target={3} label="Checkout" num="3" />
      </View>
    </View>
  );
};
