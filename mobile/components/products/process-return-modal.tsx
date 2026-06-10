import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { RefreshCw, Trash2, Scale, Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { Input } from '../ui/input';

interface ProcessReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnedStock: number;
  productId?: string | number;
}

export function ProcessReturnModal({ isOpen, onClose, returnedStock, productId }: ProcessReturnModalProps) {
  const [resaleQty, setResaleQty] = useState('');
  const [wasteQty, setWasteQty] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setResaleQty('');
      setWasteQty('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!productId) return;
    
    const rQty = parseInt(resaleQty) || 0;
    const wQty = parseInt(wasteQty) || 0;
    
    if (rQty === 0 && wQty === 0) {
      Alert.alert("Error", "Masukkan jumlah barang yang diolah");
      return;
    }
    
    if (rQty + wQty > returnedStock) {
      Alert.alert("Error", "Total melebihi jumlah retur yang ada");
      return;
    }

    setIsSaving(true);
    // UI ONLY: Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Sukses", "Barang retur berhasil diolah! (UI Only)");
      onClose();
    }, 1000);
  };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Sortir Barang Retur</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Belum Diolah: <Text className="font-bold text-error">{returnedStock} Pcs</Text>
      </Text>
      
      <View className="space-y-4 mb-6">
        <View className="p-4 rounded-2xl border border-success bg-[#f0fdf4]">
          <View className="flex-row items-center gap-1.5 mb-2">
            <RefreshCw size={16} color="#10b981" />
            <Text className="font-body-sm font-bold text-success">SIAP JUAL LAGI?</Text>
          </View>
          <Input
            value={resaleQty}
            onChangeText={(val) => setResaleQty(val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
            className="text-success font-bold"
            containerClassName="mb-0"
          />
        </View>
        
        <View className="p-4 rounded-2xl border border-error bg-[#fef2f2]">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Trash2 size={16} color="#ef4444" />
            <Text className="font-body-sm font-bold text-error">BASI / RUSAK (Dibuang)?</Text>
          </View>
          <Input
            value={wasteQty}
            onChangeText={(val) => setWasteQty(val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
            className="text-error font-bold"
            containerClassName="mb-0"
          />
        </View>
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
          disabled={isSaving || (!resaleQty && !wasteQty)}
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${(isSaving || (!resaleQty && !wasteQty)) ? 'opacity-50' : ''} bg-warning`}
          activeOpacity={0.8}
        >
          {isSaving ? <Loader2 size={20} color="#ffffff" /> : <Scale size={20} color="#ffffff" />}
          <Text className="font-bold text-on-warning">
            {isSaving ? "MEMPROSES..." : "SIMPAN SORTIR"}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
