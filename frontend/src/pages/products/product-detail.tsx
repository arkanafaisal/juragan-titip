import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, PackagePlus, RefreshCw, 
  Store, RotateCcw, Package, Tag, AlignLeft 
} from 'lucide-react';

// --- MOCK DATA (Ganti dengan tarikan dari Dexie nanti) ---
const mockProduct = {
  id: 12,
  name: 'ROTI BAKAR COKELAT',
  category: 'Makanan Basah',
  description: 'Roti tahan 5 hari. Jangan taruh di tempat yang terkena sinar matahari.',
  costPrice: 5000,
  wholesalePrice: 7000,
  retailPrice: 8000,
  warehouseStock: 150,
  returnedStock: 12,
};

const mockLogs = [
  { id: 1, type: 'RESTORE', date: '14 Mei 2026', title: 'OLAH RETUR', desc: 'Masuk ke Gudang: 5 Pcs', icon: RefreshCw, color: 'text-blue-500' },
  { id: 2, type: 'RETURN', date: '12 Mei 2026', title: 'TOKO MAKMUR', desc: 'Barang Ditarik/Retur: 7 Pcs', icon: Store, color: 'text-orange-500' },
  { id: 3, type: 'IN', date: '10 Mei 2026', title: 'KULAKAN AGEN', desc: 'Tambah Stok: 50 Pcs', icon: Package, color: 'text-green-500' },
];

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState<'KULAKAN' | 'TITIPAN' | 'RETUR'>('KULAKAN');
  
  // State untuk Modals (Nanti dikembangkan jadi Bottom Sheet sesungguhnya)
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showProcessReturnModal, setShowProcessReturnModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto pb-10 shadow-lg font-sans">
      
      {/* 1. HEADER */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
        <button className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Detail Produk</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 active:bg-slate-200 text-blue-600">
          <Edit2 className="w-5 h-5" />
        </button>
      </header>

      <main className="p-4 space-y-4">
        
        {/* 2. IDENTITAS & HARGA (Read Only) */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
            🍞 {mockProduct.name}
          </h2>
          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <Tag className="w-4 h-4" /> {mockProduct.category}
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100 text-sm">
            <div className="flex items-start gap-2 text-slate-600">
              <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="leading-relaxed">{mockProduct.description}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 border-dashed">
              <span className="text-slate-500">Modal</span>
              <span className="font-semibold text-slate-800">Rp {mockProduct.costPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 border-dashed">
              <span className="text-slate-500">Jual (Toko)</span>
              <span className="font-semibold text-blue-600">Rp {mockProduct.wholesalePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Harga Ecer</span>
              <span className="font-semibold text-slate-800">Rp {mockProduct.retailPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </section>

        {/* 3. STOK UTAMA (KULAKAN) */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1 uppercase tracking-wider">
            <Package className="w-4 h-4" /> Stok Utama (Siap Jual)
          </h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black text-slate-800">{mockProduct.warehouseStock}</span>
            <span className="text-lg font-bold text-slate-500 mb-1">Pcs</span>
          </div>
          <button 
            onClick={() => setShowAddStockModal(true)}
            className="w-full py-3 px-4 bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <PackagePlus className="w-5 h-5" /> TAMBAH STOK (KULAKAN)
          </button>
        </section>

        {/* 4. MANAJEMEN RETUR */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
          <h3 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" /> Manajemen Retur & Sisa
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Terdapat <span className="font-bold text-red-500">{mockProduct.returnedStock} Pcs</span> barang retur di tangan Anda saat ini.
          </p>
          <button 
            onClick={() => setShowProcessReturnModal(true)}
            className="w-full py-3 px-4 bg-orange-100 active:bg-orange-200 text-orange-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" /> OLAH JADI STOK JUAL
          </button>
        </section>

        {/* 5. RIWAYAT AKTIVITAS (LOGS) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 pb-0 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              📋 Riwayat Aktivitas (Bulan Ini)
            </h3>
            
            {/* TABS (Dipaksa pas di layar HP tanpa scroll) */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
              {['KULAKAN', 'TITIPAN', 'RETUR'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-1.5 text-xs sm:text-sm font-bold rounded-md transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 active:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* LIST LOGS */}
          <div className="p-4 space-y-4">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className={`mt-0.5 ${log.color}`}>
                  <log.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{log.date}</span>
                    <span className="text-xs font-semibold text-slate-400 uppercase">- {log.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1">
                    <span className="text-slate-400">↳</span> {log.desc}
                  </p>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 mt-2 text-sm font-semibold text-blue-600 active:text-blue-800">
              Lihat Lebih Banyak
            </button>
          </div>
        </section>

      </main>

      {/* MODALS PLACEHOLDER (Untuk diintegrasikan ke komponen Modal sesungguhnya) */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
           <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-sm animate-in slide-in-from-bottom-10">
             <h3 className="font-bold text-lg mb-4">Tambah Stok Utama</h3>
             <p className="text-sm text-slate-500 mb-4">Masukan jumlah stok baru yang dibeli/diterima.</p>
             <input type="number" placeholder="Contoh: 50" className="w-full p-3 border rounded-xl mb-4" />
             <div className="flex gap-2">
               <button onClick={() => setShowAddStockModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Batal</button>
               <button onClick={() => setShowAddStockModal(false)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
             </div>
           </div>
        </div>
      )}

      {showProcessReturnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
           <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-sm animate-in slide-in-from-bottom-10">
             <h3 className="font-bold text-lg mb-4">Olah Barang Retur</h3>
             <p className="text-sm text-slate-500 mb-4">Dari <span className="font-bold text-red-500">12 Pcs</span> barang retur, berapa yang masih bagus dan siap dijual lagi?</p>
             <input type="number" placeholder="Contoh: 5" className="w-full p-3 border rounded-xl mb-4" />
             <div className="flex gap-2">
               <button onClick={() => setShowProcessReturnModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Batal</button>
               <button onClick={() => setShowProcessReturnModal(false)} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Olah Stok</button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}