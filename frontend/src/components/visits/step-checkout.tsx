import { ShoppingCart, Package, Save, Loader2 } from "lucide-react";

interface BillingItem {
  id: string;
  name: string;
  type: 'sold' | 'restock';
  qty: number;
  price: number;
}

interface DisplayStockItem {
  productId: number;
  productName: string;
  initialStock: number;
  sold: number;
  returned: number;
  remained: number;
  restock: number;
  total: number;
}

interface StepCheckoutProps {
  billingItems: BillingItem[];
  displayStockItems: DisplayStockItem[];
  subtotal: number;
  currentDebt: number;
  isSubmitting: boolean;
  isNextDisabled: boolean;
  localAmountPaid: string;
  setLocalAmountPaid: (val: string) => void;
  onPrev: () => void;
  onFinish: () => void;
  formatCurrency: (value: number) => string;
}

export function StepCheckout({ 
  billingItems, displayStockItems, subtotal, 
  currentDebt, isSubmitting, isNextDisabled, 
  localAmountPaid, setLocalAmountPaid,
  onPrev, onFinish, formatCurrency 
}: StepCheckoutProps) {
  
  const totalBilled = currentDebt + subtotal;
  const amountPaidNum = parseInt(localAmountPaid.replace(/\D/g, '')) || 0;
  const diff = totalBilled - amountPaidNum;
  
  const isChange = diff < 0;
  const isFullyPaid = diff === 0;
  const remainingDebt = Math.max(0, diff);
  const changeAmount = isChange ? Math.abs(diff) : 0;

  // Fungsi untuk membatasi input hanya angka murni
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setLocalAmountPaid(numericValue);
  };

  // Fungsi untuk memformat angka menjadi format ribuan (1.500.000) di dalam input
  const formatInputCurrency = (val: string) => {
    if (!val) return "";
    return parseInt(val).toLocaleString('id-ID');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-lg pb-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        
        {/* KARTU KIRI: TAGIHAN & PEMBAYARAN */}
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
            <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold flex items-center gap-xs text-text-primary">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary"/> TAGIHAN (Laku + Restock)
            </h3>
          </div>
          <div className="p-md flex-1 flex flex-col">
            <div className="space-y-sm flex-1">
              {billingItems.length === 0 ? (
                <div className="text-center text-text-secondary font-body-sm text-body-sm py-lg">Tidak ada item tagihan kunjungan ini.</div>
              ) : (
                billingItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start border-b border-dashed border-outline-variant pb-sm last:border-0 last:pb-0">
                    <div>
                      <p className="font-body text-body font-medium text-text-primary flex items-center gap-2">
                        {item.name}
                        {item.type === 'restock' && (
                          <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Baru</span>
                        )}
                      </p>
                      <p className="font-caption text-caption text-text-secondary mt-0.5">
                        {item.type === 'sold' ? 'Laku' : 'Restock'} {item.qty} item × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-data-md text-data-md font-bold text-text-primary mt-1">
                      {formatCurrency(item.qty * item.price)}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-lg border-t-[1.5px] border-text-primary pt-md space-y-xs">
              <div className="flex justify-between font-body text-body">
                <span className="text-text-secondary">Subtotal Tagihan:</span>
                <span className="font-data-md text-data-md font-medium text-text-primary">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-body">
                <span className="text-text-secondary">Piutang Sebelumnya:</span>
                <span className="font-data-md text-data-md font-medium text-text-primary">{formatCurrency(currentDebt)}</span>
              </div>
              
              <div className="flex justify-between font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold mt-sm bg-primary/10 p-sm rounded-lg text-primary items-center">
                <span>TOTAL TAGIHAN:</span>
                <span className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg">{formatCurrency(totalBilled)}</span>
              </div>

              {/* INPUT PEMBAYARAN */}
              <div className="pt-sm">
                <label className="font-body-sm text-body-sm font-medium text-text-secondary block mb-1.5">
                  Jumlah Dibayar (Tunai):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-md text-text-secondary">Rp</span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder="0"
                    value={formatInputCurrency(localAmountPaid)}
                    onChange={handleAmountChange}
                    className="w-full pl-10 pr-3 py-2 sm:py-3 bg-surface border border-outline text-text-primary font-data-md sm:font-data-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary rounded-xl outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* SISA HUTANG DINAMIS */}
              <div className={`flex justify-between font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold mt-sm p-sm rounded-lg items-center transition-colors ${
                isChange ? 'bg-warning/10 text-warning' : (isFullyPaid ? 'bg-success/10 text-success' : 'bg-error/10 text-error')
              }`}>
                <span>{isChange ? 'KEMBALIAN:' : (isFullyPaid ? 'LUNAS:' : 'SISA HUTANG:')}</span>
                <span className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg">
                  {formatCurrency(isChange ? changeAmount : remainingDebt)}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* KARTU KANAN: BARANG DI TOKO */}
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
            <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold flex items-center gap-xs text-text-primary">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-success"/> BARANG DI TOKO (Setelah Visit)
            </h3>
          </div>
          <div className="p-md flex-1 flex flex-col">
            <div className="space-y-sm flex-1">
              {displayStockItems.length === 0 ? (
                 <div className="text-center text-text-secondary font-body-sm text-body-sm py-lg">Tidak ada stok tertinggal di toko.</div>
              ) : (
                displayStockItems.map(item => {
                  const mathParts = [];
                  if (item.initialStock > 0) mathParts.push(`lama ${item.initialStock}`);
                  if (item.returned > 0) mathParts.push(`- retur ${item.returned}`);
                  if (item.sold > 0) mathParts.push(`- laku ${item.sold}`);
                  if (item.restock > 0) mathParts.push(`+ restock ${item.restock}`);
                  const mathExplanation = mathParts.join(' ');

                  return (
                    <div key={item.productId} className="flex justify-between items-center border-b border-dashed border-outline-variant pb-sm last:border-0 last:pb-0">
                      <div>
                        <p className={`font-body text-body font-medium ${item.total > 0 ? 'text-text-primary' : 'text-text-secondary line-through opacity-70'}`}>
                          {item.productName}
                        </p>
                        {mathExplanation && (
                          <p className="font-caption text-caption text-text-secondary mt-0.5">
                            {mathExplanation}
                          </p>
                        )}
                      </div>
                      <p className={`font-data-md sm:font-data-lg text-data-md sm:text-data-lg font-bold ${item.total > 0 ? 'text-success' : 'text-text-muted'}`}>
                        {item.total}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-lg border-t-[1.5px] border-outline-variant pt-md flex justify-between items-center bg-surface-bright -mx-md -mb-md p-md">
              <span className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-secondary">Total Seluruh Item Aktif:</span>
              <span className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary bg-surface-container px-3 py-1 rounded-md">
                 {displayStockItems.reduce((acc, i) => acc + i.total, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AKSI TOMBOL */}
      <div className="flex flex-col sm:flex-row gap-sm sm:gap-md justify-between items-center pt-md">
        <button onClick={onPrev} className="w-full sm:w-auto text-text-secondary hover:text-text-primary px-md py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium transition-colors border border-outline-variant hover:bg-surface-container-low bg-surface text-center">
          Kembali Edit
        </button>
        <div className="w-full sm:flex-1 max-w-[400px] flex flex-col items-center sm:items-end gap-1">
          {isNextDisabled && (
            <span className="text-error font-caption text-caption text-center sm:text-right">
              Tidak dapat diselesaikan (kunjungan masih kosong)
            </span>
          )}
          <button 
            onClick={onFinish} 
            disabled={isSubmitting || isNextDisabled}
            className="w-full bg-primary text-on-primary font-body sm:font-h3 text-body sm:text-h3 py-sm sm:py-md rounded-xl font-bold flex items-center justify-center gap-sm hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
            {isSubmitting ? "Menyimpan Data..." : "SELESAIKAN KUNJUNGAN"}
          </button>
        </div>
      </div>
    </div>
  );
}