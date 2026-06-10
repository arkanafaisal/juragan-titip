import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { PackagePlus, Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { Input } from '../ui/input';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | number;
}

export function AddStockModal({ isOpen, onClose, productId }: AddStockModalProps) {
  const [stock, setStock] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStock('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!productId) return;
    
    const addedStock = parseInt(stock);
    if (isNaN(addedStock) || addedStock <= 0) {
      Alert.alert("Error", "Jumlah stok tidak valid");
      return;
    }

    setIsSaving(true);
    // UI ONLY: Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Sukses", "Stok berhasil ditambahkan! (UI Only)");
      onClose();
    }, 1000);
  };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Tambah Stok</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Masukkan jumlah barang baru dari pabrik/agen.
      </Text>
      
      <View className="mb-6">
        <Input
          value={stock}
          onChangeText={(val) => setStock(val.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="0"
          className="text-center font-bold text-[24px]"
        />
      </View>

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          onPress={onClose} 
          disabled={isSaving}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center ${isSaving ? 'opacity-50' : ''} bg-error`}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-on-error">Batal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isSaving || !stock}
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${(isSaving || !stock) ? 'opacity-50' : ''} bg-primary`}
          activeOpacity={0.8}
        >
          {isSaving ? <Loader2 size={20} color="#ffffff" /> : <PackagePlus size={20} color="#ffffff" />}
          <Text className="font-bold text-on-primary">
            {isSaving ? "MEMPROSES..." : "SIMPAN STOK"}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
