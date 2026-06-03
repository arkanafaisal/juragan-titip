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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 max-w-[448px] mx-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-white rounded-t-3xl p-5 pb-24 animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5"></div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">Koreksi Stok Utama</h3>
        <p className="text-sm text-slate-500 mb-5">Tercatat di aplikasi: <span className="font-bold text-slate-800">{currentStock} Pcs</span></p>
        
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Jumlah stok FISIK saat ini?</label>
            <div className="relative">
              <input 
                type="number" 
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                placeholder={currentStock.toString()} 
                min="0"
                className="w-full p-3 pr-14 text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" 
              />
              <span className="absolute right-3 top-3.5 text-slate-400 font-bold">Pcs</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Alasan (Opsional)</label>
            <input 
              type="text" 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Misal: Salah ketik, Barang hilang" 
              className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" 
            />
          </div>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="flex-1 py-3 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl font-bold disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-slate-800 active:bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? "MENYIMPAN..." : "SESUAIKAN STOK"}
          </button>
        </div>
      </div>
    </div>
  );
}
