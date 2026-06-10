import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, className, containerClassName = "", ...props }: InputProps) {
  return (
    <View className={`flex-col gap-1 w-full ${containerClassName}`}>
      {label && (
        <Text className="text-caption font-medium text-text-secondary">
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full bg-surface-variant border ${
          error ? 'border-error' : 'border-outline-variant'
        } rounded-lg px-3 py-2 font-body text-body text-text-primary ${className || ''}`}
        placeholderTextColor="#737686"
        {...props}
      />
      {error && (
        <Text className="text-[10px] font-bold text-error mt-0.5">
          {error}
        </Text>
      )}
    </View>
  );
}
