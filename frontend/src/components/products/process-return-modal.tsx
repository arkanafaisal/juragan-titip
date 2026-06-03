import React from 'react';
import { RefreshCw, Trash2, Scale } from 'lucide-react';

export function ProcessReturnModal({ isOpen, onClose, returnedStock }: { isOpen: boolean, onClose: () => void, returnedStock: number }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 max-w-[448px] mx-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-white rounded-t-3xl p-5 pb-24 animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5"></div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">Sortir Barang Retur</h3>
        <p className="text-sm text-slate-500 mb-5">Belum Diolah: <span className="font-bold text-red-500">{returnedStock} Pcs</span></p>
        
        <div className="space-y-3 mb-5">
          <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/50">
            <label className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
              <RefreshCw className="w-3.5 h-3.5" /> SIAP JUAL LAGI?
            </label>
            <div className="relative">
              <input type="number" placeholder="0" className="w-full p-2.5 pr-10 text-base font-bold border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none" />
              <span className="absolute right-3 top-3 text-blue-400 font-bold text-sm">Pcs</span>
            </div>
          </div>
          
          <div className="p-3 rounded-xl border border-red-100 bg-red-50/50">
            <label className="flex items-center gap-1.5 text-xs font-bold text-red-900 mb-2">
              <Trash2 className="w-3.5 h-3.5" /> BASI / RUSAK (Dibuang)?
            </label>
            <div className="relative">
              <input type="number" placeholder="0" className="w-full p-2.5 pr-10 text-base font-bold border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none" />
              <span className="absolute right-3 top-3 text-red-400 font-bold text-sm">Pcs</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl font-bold">Batal</button>
          <button onClick={onClose} className="flex-[2] py-3 bg-orange-500 active:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5">
            <Scale className="w-5 h-5" /> SIMPAN SORTIR
          </button>
        </div>
      </div>
    </div>
  );
}
