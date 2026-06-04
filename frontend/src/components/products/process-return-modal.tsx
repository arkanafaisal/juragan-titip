import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Scale, Loader2 } from 'lucide-react';
import { productApi } from '@/services/api/products';
import { toast } from 'sonner';
import { BottomDrawer } from '@/components/shared/bottom-drawer';

export function ProcessReturnModal({ 
  isOpen, 
  onClose, 
  returnedStock,
  productId
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  returnedStock: number;
  productId?: string | number;
}) {
  const [resaleQty, setResaleQty] = useState('');
  const [wasteQty, setWasteQty] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setResaleQty('');
      setWasteQty('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!productId) return;
    
    const rQty = parseInt(resaleQty) || 0;
    const wQty = parseInt(wasteQty) || 0;
    
    if (rQty === 0 && wQty === 0) {
      toast.error("Masukkan jumlah barang yang diolah");
      return;
    }
    
    if (rQty + wQty > returnedStock) {
      toast.error("Total melebihi jumlah retur yang ada");
      return;
    }

    setIsSaving(true);
    try {
      const res = await productApi.processReturn(productId, rQty, wQty);
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose}>
      <h3 className="font-h3 text-h3 font-bold text-on-surface mb-1">Sortir Barang Retur</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">Belum Diolah: <span className="font-bold text-error">{returnedStock} Pcs</span></p>
      
      <div className="space-y-4 mb-6">
        <div className="p-md rounded-2xl border border-success/20 bg-success/5">
          <label className="flex items-center gap-1.5 font-body-sm text-body-sm font-bold text-success mb-2">
            <RefreshCw className="w-4 h-4" /> SIAP JUAL LAGI?
          </label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0" 
              value={resaleQty}
              onChange={(e) => setResaleQty(e.target.value)}
              min="0"
              className="w-full px-gutter py-md pr-14 font-data-md text-data-md font-bold border border-success/20 rounded-xl focus:border-success focus:ring-1 focus:ring-success bg-surface-container-lowest outline-none transition-all text-success" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-success/60 font-bold">Pcs</span>
          </div>
        </div>
        
        <div className="p-md rounded-2xl border border-error/20 bg-error/5">
          <label className="flex items-center gap-1.5 font-body-sm text-body-sm font-bold text-error mb-2">
            <Trash2 className="w-4 h-4" /> BASI / RUSAK (Dibuang)?
          </label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0" 
              value={wasteQty}
              onChange={(e) => setWasteQty(e.target.value)}
              min="0"
              className="w-full px-gutter py-md pr-14 font-data-md text-data-md font-bold border border-error/20 rounded-xl focus:border-error focus:ring-1 focus:ring-error bg-surface-container-lowest outline-none transition-all text-error" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-error/60 font-bold">Pcs</span>
          </div>
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
          disabled={isSaving || (!resaleQty && !wasteQty)}
          className="flex-[2] flex items-center justify-center gap-xs py-sm px-md bg-warning text-on-warning hover:bg-warning/90 rounded-xl font-body-sm text-body-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scale className="w-5 h-5" />}
          {isSaving ? "MEMPROSES..." : "SIMPAN SORTIR"}
        </button>
      </div>
    </BottomDrawer>
  );
}
