import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { Input } from '../ui/input';

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: number;
  productId: number;
}

export function EditStockModal({ isOpen, onClose, currentStock, productId }: EditStockModalProps) {
  const [newStock, setNewStock] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewStock(currentStock.toString());
      setReason('');
    }
  }, [isOpen, currentStock]);

  const handleSubmit = () => {
    const stockVal = parseInt(newStock);
    if (isNaN(stockVal) || stockVal < 0) return;
    
    setIsSubmitting(true);
    // UI ONLY: Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Sukses", "Stok berhasil dikoreksi! (UI Only)");
      onClose();
    }, 1000);
  };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Koreksi Stok Utama</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Tercatat di aplikasi: <Text className="font-bold text-primary">{currentStock} Pcs</Text>
      </Text>
      
      <View className="space-y-4 mb-6">
        <Input
          label="Jumlah stok FISIK saat ini?"
          value={newStock}
          onChangeText={(val) => setNewStock(val.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder={currentStock.toString()}
          containerClassName="mb-4"
        />
        
        <Input
          label="Alasan (Opsional)"
          value={reason}
          onChangeText={setReason}
          placeholder="Misal: Salah ketik, Barang hilang"
        />
      </View>

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          onPress={onClose} 
          disabled={isSubmitting}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center ${isSubmitting ? 'opacity-50' : ''} bg-error`}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-on-error">Batal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={isSubmitting}
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${isSubmitting ? 'opacity-50' : ''} bg-primary`}
          activeOpacity={0.8}
        >
          {isSubmitting && <Loader2 size={20} color="#ffffff" />}
          <Text className="font-bold text-on-primary">
            {isSubmitting ? "MEMPROSES..." : "SESUAIKAN STOK"}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
