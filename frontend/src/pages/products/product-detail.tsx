import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, PackagePlus, RefreshCw, 
  Store, Package, Pencil, Trash2, X, Save, 
  Archive, Scale
} from 'lucide-react';

// ==========================================
// 1. DUMMY DATA
// ==========================================
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
  { id: 1, type: 'OLAH_RETUR', date: '14 Mei 2026, 15:30', title: 'OLAH RETUR', desc: 'Masuk Gudang: 5 Pcs', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, type: 'BUANG_RUSAK', date: '14 Mei 2026, 15:32', title: 'BUANG / AFKIR', desc: 'Dibuang/Rusak: 7 Pcs', icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 3, type: 'TITIPAN', date: '12 Mei 2026, 10:15', title: 'TITIPAN TOKO', desc: 'Toko Makmur: -10 Pcs', icon: Store, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 4, type: 'KOREKSI', date: '10 Mei 2026, 08:00', title: 'KOREKSI STOK', desc: 'Penyesuaian: -10 Pcs', icon: Pencil, color: 'text-slate-500', bg: 'bg-slate-100' },
  { id: 5, type: 'KULAKAN', date: '10 Mei 2026, 07:55', title: 'KULAKAN AGEN', desc: 'Tambah Stok: 160 Pcs', icon: Package, color: 'text-green-500', bg: 'bg-green-50' },
];

// ==========================================
// 2. MAIN COMPONENT: ProductDetailPage
// ==========================================
export default function ProductDetailPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isKoreksiOpen, setIsKoreksiOpen] = useState(false);
  const [isTambahStokOpen, setIsTambahStokOpen] = useState(false);
  const [isOlahReturOpen, setIsOlahReturOpen] = useState(false);

  // Jika tombol Edit ditekan, Render form Edit secara inline 
  // agar 100% menghormati Global Header & Bottom Tab
  if (isEditOpen) {
    return <EditProductView onClose={() => setIsEditOpen(false)} product={mockProduct} />;
  }

  return (
    <div className="min-h-dvh bg-slate-50 max-w-[448px] mx-auto font-sans">
      {/* pb-24 memberi jarak ekstra agar konten tidak tertutup Bottom Tab global */}
      <main className="space-y-3 pb-6"> 
        
        {/* KEMBALI BUTTON */}
        <div className="mb-1">
          <button className="flex items-center gap-1.5 text-slate-600 font-semibold active:text-blue-600 px-1 py-1 -ml-1 rounded-lg active:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>
        </div>

        {/* SECTION: IDENTITAS & HARGA */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          {/* Header Identitas & Edit Button ditarik ke dalam sini */}
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold text-slate-800 leading-tight pr-2">
              {mockProduct.name}
            </h2>
            <button 
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg shrink-0 active:bg-slate-100 active:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-slate-500 mb-2 font-medium">
            {mockProduct.category}
          </div>
          
          <div className="bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100 text-sm">
            <p className="leading-relaxed text-slate-700">
              <span className="font-bold text-slate-800 mr-1">Deskripsi:</span>
              {mockProduct.description}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between pb-1.5 border-b border-slate-100 border-dashed">
              <span className="text-slate-500 font-medium">Modal</span>
              <span className="font-bold text-slate-800">Rp {mockProduct.costPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-100 border-dashed">
              <span className="text-slate-500 font-medium">Jual (Toko)</span>
              <span className="font-bold text-blue-600">Rp {mockProduct.wholesalePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Harga Ecer</span>
              <span className="font-bold text-slate-800">Rp {mockProduct.retailPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </section>

        {/* SECTION: STOK UTAMA */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Stok Utama
          </h3>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-black text-slate-800 leading-none">{mockProduct.warehouseStock}</span>
            <span className="text-sm font-bold text-slate-500 mb-0.5">Pcs</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsKoreksiOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" /> Koreksi
            </button>
            <button 
              onClick={() => setIsTambahStokOpen(true)}
              className="flex-1 py-2.5 px-3 bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <PackagePlus className="w-5 h-5" /> Tambah Stok
            </button>
          </div>
        </section>

        {/* SECTION: MANAJEMEN RETUR */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
          <h3 className="text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider">
            Manajemen Retur
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Terdapat <span className="font-bold text-red-500">{mockProduct.returnedStock} Pcs</span> barang retur di tangan Anda.
          </p>
          <button 
            onClick={() => setIsOlahReturOpen(true)}
            className="w-full py-2.5 px-3 bg-orange-50 active:bg-orange-100 border border-orange-200 text-orange-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4" /> OLAH BARANG RETUR
          </button>
        </section>

        {/* SECTION: RIWAYAT AKTIVITAS */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Riwayat Aktivitas
            </h3>
          </div>

          <div className="p-3 space-y-4">
            {mockLogs.map((log, index) => (
              <div key={log.id} className="flex gap-2.5 relative">
                {index !== mockLogs.length - 1 && (
                  <div className="absolute left-3.5 top-8 w-px h-full -ml-px bg-slate-100 z-0"></div>
                )}
                
                <div className={`mt-0.5 p-1.5 rounded-full z-10 shrink-0 h-fit ${log.bg} ${log.color}`}>
                  <log.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col mb-0.5">
                    <span className="text-xs font-bold text-slate-700 leading-tight">{log.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    <span className="text-slate-300 mr-1">↳</span>{log.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* RENDER BOTTOM SHEETS */}
      <KoreksiStokModal 
        isOpen={isKoreksiOpen} 
        onClose={() => setIsKoreksiOpen(false)} 
        currentStock={mockProduct.warehouseStock} 
      />
      <TambahStokModal 
        isOpen={isTambahStokOpen} 
        onClose={() => setIsTambahStokOpen(false)} 
      />
      <OlahReturModal 
        isOpen={isOlahReturOpen} 
        onClose={() => setIsOlahReturOpen(false)} 
        returnedStock={mockProduct.returnedStock} 
      />
    </div>
  );
}

// ==========================================
// 3. SUB-COMPONENTS (INLINE VIEW & BOTTOM SHEETS)
// ==========================================

/** 
 * INLINE VIEW: EDIT PRODUK 
 * Di-render menggantikan halaman utama agar Header dan Bottom Tab aman.
 */
function EditProductView({ onClose, product }: { onClose: () => void, product: any }) {
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

/** 
 * MODAL: KOREKSI STOK (BOTTOM SHEET) 
 */
function KoreksiStokModal({ isOpen, onClose, currentStock }: { isOpen: boolean, onClose: () => void, currentStock: number }) {
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
              <input type="number" placeholder="140" className="w-full p-3 pr-14 text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" />
              <span className="absolute right-3 top-3.5 text-slate-400 font-bold">Pcs</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Alasan (Opsional)</label>
            <input type="text" placeholder="Misal: Salah ketik" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl font-bold">Batal</button>
          <button onClick={onClose} className="flex-[2] py-3 bg-slate-800 active:bg-slate-900 text-white rounded-xl font-bold">SESUAIKAN STOK</button>
        </div>
      </div>
    </div>
  );
}

/** 
 * MODAL: TAMBAH STOK (BOTTOM SHEET) 
 */
function TambahStokModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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

/** 
 * MODAL: SORTIR / OLAH RETUR (BOTTOM SHEET) 
 */
function OlahReturModal({ isOpen, onClose, returnedStock }: { isOpen: boolean, onClose: () => void, returnedStock: number }) {
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