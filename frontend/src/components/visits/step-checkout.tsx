import React from "react";
import { ShoppingCart, Package, Save, Loader2 } from "lucide-react";

interface BillingItem {
  id: string;
  name: string;
  type: 'sold' | 'restock';
  qty: number;
  price: number;
}

interface StepCheckoutProps {
  billingItems: BillingItem[];
  activeStockItems: { productId: string; productName: string; total: number; }[];
  subtotal: number;
  totalBilled: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onFinish: () => void;
  formatCurrency: (value: number) => string;
}

export function StepCheckout({ 
  billingItems, activeStockItems, subtotal, 
  totalBilled, isSubmitting, onPrev, onFinish, formatCurrency 
}: StepCheckoutProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-lg pb-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        
        {/* PANEL TAGIHAN */}
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
                <span className="font-data-md text-data-md font-medium text-text-primary">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold mt-sm bg-primary/10 p-sm rounded-lg text-primary items-center">
                <span>TOTAL TAGIHAN:</span>
                <span className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg">{formatCurrency(totalBilled)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL STOK AKTIF */}
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
            <h3 className="font-body sm:font-h3 text-body sm:text-h3 font-bold flex items-center gap-xs text-text-primary">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-success"/> STOK AKTIF DI TOKO (Setelah Visit)
            </h3>
          </div>
          <div className="p-md flex-1 flex flex-col">
            <div className="space-y-sm flex-1">
              {activeStockItems.length === 0 ? (
                 <div className="text-center text-text-secondary font-body-sm text-body-sm py-lg">Tidak ada stok aktif tertinggal di toko.</div>
              ) : (
                activeStockItems.map(item => (
                  <div key={item.productId} className="flex justify-between items-center border-b border-dashed border-outline-variant pb-sm last:border-0 last:pb-0">
                    <p className="font-body text-body font-medium text-text-primary">{item.productName}</p>
                    <p className="font-data-md sm:font-data-lg text-data-md sm:text-data-lg font-bold text-success">
                      {item.total}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-lg border-t-[1.5px] border-outline-variant pt-md flex justify-between items-center bg-surface-bright -mx-md -mb-md p-md">
              <span className="font-body sm:font-h3 text-body sm:text-h3 font-bold text-text-secondary">Total Seluruh Item Aktif:</span>
              <span className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary bg-surface-container px-3 py-1 rounded-md">
                 {activeStockItems.reduce((acc, i) => acc + i.total, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION SUBMIT */}
      <div className="flex flex-col sm:flex-row gap-sm sm:gap-md justify-between items-center pt-md">
        <button onClick={onPrev} className="w-full sm:w-auto text-text-secondary hover:text-text-primary px-md py-sm sm:py-md rounded-lg font-body sm:font-h3 text-body sm:text-h3 font-medium transition-colors border border-outline-variant hover:bg-surface-container-low bg-surface text-center">
          Kembali Edit
        </button>
        <button 
          onClick={onFinish} 
          disabled={isSubmitting}
          className="w-full sm:flex-1 max-w-[400px] bg-primary text-on-primary font-body sm:font-h3 text-body sm:text-h3 py-sm sm:py-md rounded-xl font-bold flex items-center justify-center gap-sm hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
          {isSubmitting ? "Menyimpan Data..." : "SELESAIKAN KUNJUNGAN"}
        </button>
      </div>
    </div>
  );
}