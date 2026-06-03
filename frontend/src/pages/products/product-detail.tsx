import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit2, PackagePlus, RefreshCw, 
  Store, Package, Pencil, Trash2, Scale
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { EditStockModal } from '@/components/products/edit-stock-modal';
import { AddStockModal } from '@/components/products/add-stock-modal';
import { ProcessReturnModal } from '@/components/products/process-return-modal';
import { productApi, type ProductDetailWithLogs } from '@/services/api/products';
import type { InventoryLog } from '@/types';

// ==========================================
// UTILS
// ==========================================
const getLogConfig = (log: InventoryLog) => {
  switch (log.type) {
    case 'OLAH_RETUR':
      return { title: 'OLAH RETUR', desc: `Masuk Gudang: ${log.quantity} Pcs`, icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'BUANG_RUSAK':
      return { title: 'BUANG / AFKIR', desc: `Dibuang/Rusak: ${Math.abs(log.quantity)} Pcs`, icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' };
    case 'TITIPAN':
      return { title: 'TITIPAN TOKO', desc: `${log.storeName || 'Toko'}: -${Math.abs(log.quantity)} Pcs`, icon: Store, color: 'text-orange-500', bg: 'bg-orange-50' };
    case 'KOREKSI':
      return { title: 'KOREKSI STOK', desc: `Penyesuaian: ${log.quantity > 0 ? '+' : ''}${log.quantity} Pcs`, icon: Pencil, color: 'text-slate-500', bg: 'bg-slate-100' };
    case 'KULAKAN':
      return { title: 'KULAKAN AGEN', desc: `Tambah Stok: ${log.quantity} Pcs`, icon: Package, color: 'text-green-500', bg: 'bg-green-50' };
    case 'TARIK_RETUR':
      return { title: 'TARIK RETUR', desc: `${log.storeName || 'Toko'}: ${log.quantity} Pcs`, icon: RefreshCw, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    default:
      return { title: log.type, desc: `${log.quantity} Pcs`, icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' };
  }
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date).replace('.', ':');
};

// ==========================================
// MAIN COMPONENT: ProductDetailPage
// ==========================================
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState<ProductDetailWithLogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isKoreksiOpen, setIsKoreksiOpen] = useState(false);
  const [isTambahStokOpen, setIsTambahStokOpen] = useState(false);
  const [isOlahReturOpen, setIsOlahReturOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    const res = await productApi.getDetailWithLogs(id);
    if (res.success && res.data) {
      setData(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-dvh flex items-center justify-center bg-slate-50">Memuat...</div>;
  }

  if (!data) {
    return <div className="min-h-dvh flex items-center justify-center bg-slate-50">Produk tidak ditemukan</div>;
  }

  const { product, logs } = data;

  return (
    <div className="min-h-dvh bg-slate-50 max-w-[448px] mx-auto font-sans">
      <main className="space-y-3 pb-6"> 
        
        {/* KEMBALI BUTTON */}
        <div className="mb-1">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 font-semibold active:text-blue-600 px-1 py-1 -ml-1 rounded-lg active:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>
        </div>

        {/* SECTION: IDENTITAS & HARGA */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold text-slate-800 leading-tight pr-2">
              {product.name}
            </h2>
            <button 
              onClick={() => navigate(`/products/${product.id}/edit`)}
              className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg shrink-0 active:bg-slate-100 active:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-slate-500 mb-2 font-medium">
            {product.category}
          </div>
          
          {product.description && (
            <div className="bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100 text-sm">
              <p className="leading-relaxed text-slate-700">
                <span className="font-bold text-slate-800 mr-1">Deskripsi:</span>
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between pb-1.5 border-b border-slate-100 border-dashed">
              <span className="text-slate-500 font-medium">Modal</span>
              <span className="font-bold text-slate-800">Rp {product.costPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-100 border-dashed">
              <span className="text-slate-500 font-medium">Jual (Toko)</span>
              <span className="font-bold text-blue-600">Rp {product.wholesalePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Harga Ecer</span>
              <span className="font-bold text-slate-800">
                {product.retailPrice ? `Rp ${product.retailPrice.toLocaleString('id-ID')}` : '-'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: STOK UTAMA */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Stok Utama
          </h3>
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-black text-slate-800 leading-none">{product.warehouseStock}</span>
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
            Terdapat <span className="font-bold text-red-500">{product.returnedStock} Pcs</span> barang retur di tangan Anda.
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
            {logs.length === 0 ? (
              <p className="text-xs text-center text-slate-500">Belum ada riwayat aktivitas</p>
            ) : (
              logs.map((log, index) => {
                const config = getLogConfig(log);
                const Icon = config.icon;
                
                return (
                  <div key={log.id} className="flex gap-2.5 relative">
                    {index !== logs.length - 1 && (
                      <div className="absolute left-3.5 top-8 w-px h-full -ml-px bg-slate-100 z-0"></div>
                    )}
                    
                    <div className={`mt-0.5 p-1.5 rounded-full z-10 shrink-0 h-fit ${config.bg} ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col mb-0.5">
                        <span className="text-xs font-bold text-slate-700 leading-tight">{config.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        <span className="text-slate-300 mr-1">↳</span>{config.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>

      {/* RENDER BOTTOM SHEETS */}
      <EditStockModal 
        isOpen={isKoreksiOpen} 
        onClose={() => {
          setIsKoreksiOpen(false);
          loadData();
        }} 
        currentStock={product.warehouseStock} 
        productId={product.id}
      />
      <AddStockModal 
        isOpen={isTambahStokOpen} 
        onClose={() => {
          setIsTambahStokOpen(false);
          loadData();
        }} 
      />
      <ProcessReturnModal 
        isOpen={isOlahReturOpen} 
        onClose={() => {
          setIsOlahReturOpen(false);
          loadData();
        }} 
        returnedStock={product.returnedStock} 
      />
    </div>
  );
}

