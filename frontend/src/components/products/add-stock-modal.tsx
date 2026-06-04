import { useState, useEffect, useRef } from 'react';
import { PackagePlus, Loader2 } from 'lucide-react';
import { productApi } from '@/services/api/products';
import { toast } from 'sonner';

export function AddStockModal({ 
  isOpen, 
  onClose,
  productId 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  productId?: string | number;
}) {
  const [stock, setStock] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStock('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!productId) return;
    
    const addedStock = parseInt(stock);
    if (isNaN(addedStock) || addedStock <= 0) {
      toast.error("Jumlah stok tidak valid");
      return;
    }

    setIsSaving(true);
    try {
      const res = await productApi.addStock(productId, addedStock);
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/50 backdrop-blur-sm max-w-[448px] mx-auto font-body text-body text-on-surface antialiased">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-surface-container-lowest rounded-t-3xl p-lg pb-24 animate-in slide-in-from-bottom-10 duration-200 shadow-xl">
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-5"></div>
        <h3 className="font-h3 text-base font-bold text-on-surface mb-1">Tambah Stok</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">Masukkan jumlah barang baru dari pabrik/agen.</p>
        
        <div className="mb-6">
          <div className="relative">
            <input 
              ref={inputRef}
              type="number" 
              placeholder="0" 
              value={stock}
              min="1"
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-gutter py-md pr-14 font-data-md text-data-md font-bold border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all text-center" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold">Pcs</span>
          </div>
        </div>

        <div className="flex gap-sm mt-lg">
          <button 
            onClick={onClose} 
            disabled={isSaving}
            className="flex-1 py-sm px-md rounded-xl font-body-sm text-body-sm font-bold text-on-error bg-error hover:bg-error/90 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            Batal
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !stock}
            className="flex-[2] flex items-center justify-center gap-xs py-sm px-md bg-primary text-on-primary hover:bg-primary/90 rounded-xl font-body-sm text-body-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PackagePlus className="w-5 h-5" />}
            {isSaving ? "MEMPROSES..." : "SIMPAN STOK"}
          </button>
        </div>
      </div>
    </div>
  );
}
