import React from 'react';
import { X, Save, Archive } from 'lucide-react';

export function EditProductModal({ onClose, product }: { onClose: () => void, product: any }) {
  return (
    <main className="p-3 space-y-4 pb-4 animate-in fade-in slide-in-from-right-4 duration-200">
      
      {/* HEADER EDIT */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onClose} className="flex items-center gap-1.5 text-slate-600 font-semibold px-1 py-1 -ml-1 rounded-lg active:bg-slate-100">
          <X className="w-5 h-5" /> Batal
        </button>
        <h2 className="font-bold text-slate-800">Edit Produk</h2>
        <div className="w-16"></div> {/* Spacer balance */}
      </div>

      {/* INFORMASI DASAR */}
      <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Dasar</h3>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
          <input type="text" defaultValue={product.name} className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
          <input type="text" defaultValue={product.category} className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi (Opsional)</label>
          <textarea rows={2} defaultValue={product.description} className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </section>

      {/* PENGATURAN HARGA */}
      <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Harga</h3>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Harga Modal (Kulakan)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
            <input type="number" defaultValue={product.costPrice} className="w-full p-2.5 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Grosir/Toko)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
            <input type="number" defaultValue={product.wholesalePrice} className="w-full p-2.5 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Harga Eceran (Ke Konsumen)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
            <input type="number" defaultValue={product.retailPrice} className="w-full p-2.5 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
      </section>

      {/* BUTTONS ACTION */}
      <div className="space-y-2 mt-4">
        <button className="w-full py-3 bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> SIMPAN PERUBAHAN
        </button>
        <button className="w-full py-3 bg-red-50 text-red-600 active:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2">
          <Archive className="w-4 h-4" /> ARSIPKAN PRODUK
        </button>
      </div>
    </main>
  );
}
