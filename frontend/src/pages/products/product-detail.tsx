import { useState, useEffect } from 'react';
import { 
  ArrowLeft, PackagePlus, RefreshCw, 
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
      return { title: 'KOREKSI STOK', desc: `Penyesuaian: ${log.quantity > 0 ? '+' : ''}${log.quantity} Pcs`, icon: Pencil, color: 'text-text-secondary', bg: 'bg-surface-container-low' };
    case 'KULAKAN':
      return { title: 'KULAKAN AGEN', desc: `Tambah Stok: ${log.quantity} Pcs`, icon: Package, color: 'text-success', bg: 'bg-success/10' };
    case 'TARIK_RETUR':
      return { title: 'TARIK RETUR', desc: `${log.storeName || 'Toko'}: ${log.quantity} Pcs`, icon: RefreshCw, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    default:
      return { title: log.type, desc: `${log.quantity} Pcs`, icon: Package, color: 'text-text-secondary', bg: 'bg-surface-container-low' };
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
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-text-primary font-medium">Memuat...</div>;
  }

  if (!data) {
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-text-primary font-medium">Produk tidak ditemukan</div>;
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
            className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm  text-text-primary hover:bg-surface-container-low active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span className="text-body-sm">Kembali</span>
          </button>
        </div>

        {/* SECTION: IDENTITAS & HARGA */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-h2  text-text-primary pr-2">
              {product.name}
            </h2>
            <button 
              onClick={() => navigate(`/products/${product.id}/edit`)}
              className="p-1.5 text-warning hover:text-warning/80 hover:bg-warning/30 rounded-xl shrink-0 transition-colors active:scale-95"
            >
              <SquarePen className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-body-sm text-text-secondary mb-4  capitalize">
            {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
          </div>
          
          {product.description && (
            <div className="bg-surface-container-low p-3 rounded-xl mb-4 border border-black/5 text-body-sm">
              <p className="text-text-primary/80">
                <span className=" text-text-primary mr-1">Deskripsi:</span>
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-3 text-data-md mt-2">
            <div className="flex justify-between pb-2 border-b border-outline-variant border-dashed">
              <span className="text-text-secondary ">Modal</span>
              <span className=" text-text-primary">Rp {product.costPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-outline-variant border-dashed">
              <span className="text-text-secondary ">Jual (Toko)</span>
              <span className=" text-primary">Rp {product.wholesalePrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary ">Harga Ecer</span>
              <span className={` ${product.retailPrice ? 'text-text-primary' : 'text-text-muted italic text-body-sm'}`}>
                {product.retailPrice ? `Rp ${product.retailPrice.toLocaleString('id-ID')}` : 'Belum diatur'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: STOK UTAMA */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <h3 className="text-h3  text-text-primary mb-2 uppercase">
            Stok Utama
          </h3>
          <div className="flex items-end gap-1.5 mb-4">
            <span className="text-display  text-text-primary leading-none">{product.warehouseStock}</span>
            <span className="text-body-sm  text-text-muted mb-0.5">Pcs</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsKoreksiOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-warning hover:bg-warning/90 text-on-warning  rounded-xl transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" /> Koreksi
            </button>
            <button 
              onClick={() => setIsTambahStokOpen(true)}
              className="flex-1 py-2.5 px-3 bg-primary hover:bg-primary/90 text-on-primary  rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98]"
            >
              <PackagePlus className="w-5 h-5" /> Tambah Stok
            </button>
          </div>
        </section>

        {/* SECTION: MANAJEMEN RETUR */}
        <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
          <h3 className="text-h3  text-text-primary mb-1 uppercase">
            Manajemen Retur
          </h3>
          <p className="text-caption text-text-secondary mb-4 font-medium">
            Terdapat <span className=" text-error">{product.returnedStock || 0} Pcs</span> barang retur di tangan Anda.
          </p>
          <button 
            onClick={() => setIsOlahReturOpen(true)}
            disabled={!product.returnedStock || product.returnedStock === 0}
            className="w-full py-3 px-3 bg-success hover:bg-success/90 text-on-success  rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:bg-surface-container-high disabled:text-on-surface-variant"
          >
            <Scale className="w-4 h-4" /> OLAH BARANG RETUR
          </button>
        </section>

        {/* SECTION: RIWAYAT AKTIVITAS */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="text-h3  text-text-primary uppercase">
              Riwayat Aktivitas
            </h3>
          </div>

          <div className="p-4 space-y-5">
            {logs.length === 0 ? (
              <p className="text-body-sm font-medium text-center text-text-muted">Belum ada riwayat aktivitas</p>
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
                        <span className="text-body-sm  text-text-primary">{config.title}</span>
                        <span className="text-caption text-text-muted ">{formatDate(log.createdAt)}</span>
                      </div>
                      <p className="text-body-sm font-medium text-text-primary/80 mt-0.5">
                        <span className="text-text-muted mr-1 ">↳</span>{config.desc}
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

