import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit2, PackagePlus, RefreshCw, 
  Store, Package, Pencil, Trash2, Scale, SquarePen
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { EditStockModal } from '@/components/products/edit-stock-modal';
import { AddStockModal } from '@/components/products/add-stock-modal';
import { ProcessReturnModal } from '@/components/products/process-return-modal';
import { productApi, type ProductDetailWithLogs } from '@/services/api/products';
import { settingsApi } from '@/services/api/settings';
import type { InventoryLog } from '@/types';

// ==========================================
// UTILS
// ==========================================
const getLogConfig = (log: InventoryLog) => {
  switch (log.type) {
    case 'OLAH_RETUR':
      return { title: 'OLAH RETUR', desc: `Masuk Gudang: ${log.quantity} Pcs`, icon: RefreshCw, color: 'text-primary', bg: 'bg-primary/10' };
    case 'BUANG_RUSAK':
      return { title: 'BUANG / AFKIR', desc: `Dibuang/Rusak: ${Math.abs(log.quantity)} Pcs`, icon: Trash2, color: 'text-error', bg: 'bg-error/10' };
    case 'TITIPAN':
      return { title: 'TITIPAN TOKO', desc: `${log.storeName || 'Toko'}: -${Math.abs(log.quantity)} Pcs`, icon: Store, color: 'text-orange-500', bg: 'bg-orange-50' };
    case 'KOREKSI':
      return { title: 'KOREKSI STOK', desc: `Penyesuaian: ${log.quantity > 0 ? '+' : ''}${log.quantity} Pcs`, icon: Pencil, color: 'text-black/60', bg: 'bg-black/5' };
    case 'KULAKAN':
      return { title: 'KULAKAN AGEN', desc: `Tambah Stok: ${log.quantity} Pcs`, icon: Package, color: 'text-success', bg: 'bg-success/10' };
    case 'TARIK_RETUR':
      return { title: 'TARIK RETUR', desc: `${log.storeName || 'Toko'}: ${log.quantity} Pcs`, icon: RefreshCw, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    default:
      return { title: log.type, desc: `${log.quantity} Pcs`, icon: Package, color: 'text-black/60', bg: 'bg-black/5' };
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
      console.log(res.data)
      setData(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-black font-medium">Memuat...</div>;
  }

  if (!data) {
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-black font-medium">Produk tidak ditemukan</div>;
  }

  const { product, logs } = data;
  const categoryLabels = settingsApi.getCategoryLabels();

  return (
    <div className="min-h-dvh bg-surface-container-lowest max-w-[448px] mx-auto">
      <main className="space-y-4"> 
        
        {/* KEMBALI BUTTON */}
        <div className="mb-2 flex items-center">
          <button 
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm font-bold text-black hover:bg-surface-container-low active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span className="text-sm">Kembali</span>
          </button>
        </div>

        {/* SECTION: IDENTITAS & HARGA */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-xl font-black text-black pr-2">
              {product.name}
            </h2>
            <button 
              onClick={() => navigate(`/products/${product.id}/edit`)}
              className="p-1.5 text-warning hover:text-warning/80 hover:bg-warning/30 rounded-xl shrink-0 transition-colors active:scale-95"
            >
              <SquarePen className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-sm text-black/60 mb-4 font-bold capitalize">
            {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
          </div>
          
          {product.description && (
            <div className="bg-black/5 p-3 rounded-xl mb-4 border border-black/5 text-sm">
              <p className="text-black/80">
                <span className="font-bold text-black mr-1">Deskripsi:</span>
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-3 text-sm mt-2">
            <div className="flex justify-between pb-2 border-b border-outline-variant border-dashed">
              <span className="text-black/70 font-bold">Modal</span>
              <span className="font-black text-black">Rp {product.costPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-outline-variant border-dashed">
              <span className="text-black/70 font-bold">Jual (Toko)</span>
              <span className="font-black text-primary">Rp {product.wholesalePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/70 font-bold">Harga Ecer</span>
              <span className={`font-black ${product.retailPrice ? 'text-black' : 'text-black/40 italic text-sm'}`}>
                {product.retailPrice ? `Rp ${product.retailPrice.toLocaleString('id-ID')}` : 'Belum diatur'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: STOK UTAMA */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <h3 className="text-base font-black text-black mb-2 uppercase">
            Stok Utama
          </h3>
          <div className="flex items-end gap-1.5 mb-4">
            <span className="text-4xl font-black text-black leading-none">{product.warehouseStock}</span>
            <span className="text-sm font-bold text-black/50 mb-0.5">Pcs</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsKoreksiOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-warning hover:bg-warning/90 text-on-warning font-bold rounded-xl transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" /> Koreksi
            </button>
            <button 
              onClick={() => setIsTambahStokOpen(true)}
              className="flex-1 py-2.5 px-3 bg-primary hover:bg-primary/90 text-on-primary font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98]"
            >
              <PackagePlus className="w-5 h-5" /> Tambah Stok
            </button>
          </div>
        </section>

        {/* SECTION: MANAJEMEN RETUR */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <h3 className="text-base font-black text-black mb-1 uppercase">
            Manajemen Retur
          </h3>
          <p className="text-xs text-black/70 mb-4 font-medium">
            Terdapat <span className="font-black text-error">{product.returnedStock || 0} Pcs</span> barang retur di tangan Anda.
          </p>
          <button 
            onClick={() => setIsOlahReturOpen(true)}
            disabled={!product.returnedStock || product.returnedStock === 0}
            className="w-full py-3 px-3 bg-success hover:bg-success/90 text-on-success font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:bg-surface-container-high disabled:text-on-surface-variant"
          >
            <Scale className="w-4 h-4" /> OLAH BARANG RETUR
          </button>
        </section>

        {/* SECTION: RIWAYAT AKTIVITAS */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="text-base font-black text-black uppercase">
              Riwayat Aktivitas
            </h3>
          </div>

          <div className="p-4 space-y-5">
            {logs.length === 0 ? (
              <p className="text-sm font-medium text-center text-black/50">Belum ada riwayat aktivitas</p>
            ) : (
              logs.map((log, index) => {
                const config = getLogConfig(log);
                const Icon = config.icon;
                
                return (
                  <div key={log.id} className="flex gap-3 relative">
                    {index !== logs.length - 1 && (
                      <div className="absolute left-4 top-10 w-px h-full -ml-px bg-black/10 z-0"></div>
                    )}
                    
                    <div className={`mt-0.5 p-2 rounded-full z-10 shrink-0 h-fit ${config.bg} ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col mb-1">
                        <span className="text-sm font-black text-black">{config.title}</span>
                        <span className="text-xs text-black/50 font-bold">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-black/80 mt-0.5">
                        <span className="text-black/30 mr-1 font-bold">↳</span>{config.desc}
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
        productId={product.id}
      />
      <ProcessReturnModal 
        isOpen={isOlahReturOpen} 
        onClose={() => {
          setIsOlahReturOpen(false);
          loadData();
        }} 
        returnedStock={product.returnedStock} 
        productId={product.id}
      />
    </div>
  );
}

