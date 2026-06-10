import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View 
      className={`bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant ${className}`.trim()} 
      {...props}
    >
      {children}
    </View>
  );
}
