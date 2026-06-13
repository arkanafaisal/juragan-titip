import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ onPress, label = 'kembali', className = '' }: BackButtonProps) {
  const router = useRouter();
  
  return (
    <View className={`mb-2 flex-row items-center ${className}`}>
      <TouchableOpacity 
        onPress={onPress || (() => router.back())}
        className="flex-row items-center justify-center px-4 py-2 bg-error rounded-xl shadow-sm active:opacity-80"
        activeOpacity={0.7}
      >
        <Text className="text-body-sm font-bold text-on-error">{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
