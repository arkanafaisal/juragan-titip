import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

// ==========================================
// 1. BASE MODAL (FONDASI)
// Mengurus overlay transparan dan container dasar
// ==========================================
interface BaseModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export function BaseModal({ visible, children, onClose }: BaseModalProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full max-w-[400px]"
          >
            <View className="bg-primary p-6 rounded-2xl shadow-lg w-full">
              {children}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ==========================================
// 2. CONFIRM MODAL (Contoh: Keluar Aplikasi)
// Tombol: Kiri (Batal), Kanan (Ya/Aksi)
// ==========================================
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({ visible, title, message, onCancel, onConfirm, confirmText = 'Ya', cancelText = 'Batal' }: ConfirmModalProps) {
  return (
    <BaseModal visible={visible} onClose={onCancel}>
      <Text className="text-h2 font-bold text-on-primary text-center">{title}</Text>
      <Text className="text-body text-on-primary text-center mt-2">{message}</Text>
      
      <View className="flex-row gap-3 mt-6">
        <TouchableOpacity 
          onPress={onCancel} 
          className="flex-1 bg-success py-3 rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-on-success text-h3 font-bold">{cancelText}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onConfirm} 
          className="flex-1 bg-error py-3 rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-on-error text-h3 font-bold">{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

// ==========================================
// 3. INPUT CONFIRM MODAL (Contoh: Reset DB)
// Wajib mengetik kata kunci sebelum tombol Ya aktif
// ==========================================
interface InputConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  expectedInput: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
}

export function InputConfirmModal({ visible, title, message, expectedInput, onCancel, onConfirm, confirmText = 'Reset' }: InputConfirmModalProps) {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === expectedInput;

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm();
      setInputValue(''); // Reset input setelah sukses
    }
  };

  const handleCancel = () => {
    setInputValue(''); // Reset input saat dibatalkan
    onCancel();
  };

  return (
    <BaseModal visible={visible} onClose={handleCancel}>
      <Text className="text-h2 font-bold text-on-primary">{title}</Text>
      <Text className="text-body text-on-primary mt-2">{message}</Text>
      
      <View className="mt-4">
        <Text className="text-caption font-medium text-on-primary mb-1">Ketik "{expectedInput}" untuk konfirmasi</Text>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={expectedInput}
          placeholderTextColor="#9ca3af"
          className="border border-outline-variant bg-surface-container-lowest rounded-xl p-3 text-body text-text-primary"
          autoCapitalize="none"
        />
      </View>
      
      <View className="flex-row gap-3 mt-6">
        <TouchableOpacity 
          onPress={handleCancel} 
          className="flex-1 bg-success py-3 rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-on-success text-h3 font-bold">Batal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleConfirm} 
          disabled={!isMatch}
          className={`flex-1 py-3 rounded-xl items-center justify-center ${isMatch ? 'bg-error' : 'bg-outline-variant'}`}
          activeOpacity={isMatch ? 0.8 : 1}
        >
          <Text className={isMatch ? 'text-on-error text-h3 font-bold' : 'text-surface text-h3 font-bold'}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

// ==========================================
// 4. INFO MODAL (Satu Tombol)
// Tombol: Full Width (Kuning/Warning atau Primary)
// ==========================================
interface InfoModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onContinue?: () => void;
  buttonText?: string;
}

export function InfoModal({ visible, title, message, onClose, onContinue, buttonText = 'Tutup' }: InfoModalProps) {
  const handlePress = () => {
    onClose();
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <Text className="text-h2 font-bold text-on-primary text-center">{title}</Text>
      <Text className="text-body text-on-primary text-center mt-2">{message}</Text>
      
      <View className="mt-6">
        <TouchableOpacity 
          onPress={handlePress} 
          className="w-full bg-warning py-3 rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-on-warning text-h3 font-bold">{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}