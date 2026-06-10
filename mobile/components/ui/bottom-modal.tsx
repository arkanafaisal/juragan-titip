import React, { ReactNode } from 'react';
import { Modal, View, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomModal({ visible, onClose, children }: BottomModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={onClose} 
          />
          <View className="bg-surface rounded-t-[24px] px-6 pb-6 pt-2">
            <View className="w-10 h-1.5 bg-outline-variant rounded-full mx-auto mb-6" />
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
