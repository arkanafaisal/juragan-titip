import React, { useState, useEffect } from 'react';
import { productApi } from '@/services/api/products';
import { Loader2 } from 'lucide-react';

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

  const handleSubmit = async () => {
    const stockVal = parseInt(newStock);
    if (isNaN(stockVal) || stockVal < 0) return;
    
    setIsSubmitting(true);
    const res = await productApi.adjustStock(productId, stockVal, reason);
    setIsSubmitting(false);
    
    if (res.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/50 backdrop-blur-sm max-w-[448px] mx-auto font-body text-body text-on-surface antialiased">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-surface-container-lowest rounded-t-3xl p-lg pb-24 animate-in slide-in-from-bottom-10 duration-200 shadow-xl">
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-5"></div>
        <h3 className="font-h3 text-h3 font-bold text-on-surface mb-1">Koreksi Stok Utama</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">Tercatat di aplikasi: <span className="font-bold text-primary">{currentStock} Pcs</span></p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-body-sm text-body-sm font-medium text-on-surface-variant mb-1.5">Jumlah stok FISIK saat ini?</label>
            <div className="relative">
              <input 
                type="number" 
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                placeholder={currentStock.toString()} 
                min="0"
                className="w-full px-gutter py-md pr-14 font-data-md text-data-md font-bold border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold">Pcs</span>
            </div>
          </div>
          <div>
            <label className="block font-body-sm text-body-sm font-medium text-on-surface-variant mb-1.5">Alasan (Opsional)</label>
            <input 
              type="text" 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Misal: Salah ketik, Barang hilang" 
              className="w-full px-gutter py-md border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
            />
          </div>
        </div>

        <div className="flex gap-sm mt-lg">
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="flex-1 py-sm px-md rounded-xl font-body-sm text-body-sm font-bold text-on-error bg-error hover:bg-error/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            Batal
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-[2] flex items-center justify-center gap-xs py-sm px-md bg-primary text-on-primary hover:bg-primary/90 rounded-xl font-body-sm text-body-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? "MEMPROSES..." : "SESUAIKAN STOK"}
          </button>
        </div>
      </div>
    </div>
  );
}
