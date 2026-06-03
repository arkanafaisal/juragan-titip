import React from 'react';
import { PackagePlus } from 'lucide-react';

export function AddStockModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 max-w-[448px] mx-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* pb-24 untuk mendorong konten ke atas Bottom Tab Bar global */}
      <div className="relative w-full bg-white rounded-t-3xl p-5 pb-24 animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5"></div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">Tambah Stok</h3>
        <p className="text-sm text-slate-500 mb-5">Masukkan jumlah barang baru dari pabrik/agen.</p>
        
        <div className="mb-6">
          <div className="relative">
            <input type="number" placeholder="0" className="w-full p-3 pr-14 text-2xl font-black border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-center" autoFocus />
            <span className="absolute right-4 top-4 text-slate-400 font-bold">Pcs</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl font-bold">Batal</button>
          <button onClick={onClose} className="flex-[2] py-3 bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5">
            <PackagePlus className="w-5 h-5" /> SIMPAN STOK
          </button>
        </div>
      </div>
    </div>
  );
}
