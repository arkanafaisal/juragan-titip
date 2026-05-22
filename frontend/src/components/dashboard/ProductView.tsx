// src/components/dashboard/ProductView.tsx
import { Search, Plus, X, Loader2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types/dashboard';
import { useProductView } from '@/hooks/useProductView';

interface ProductViewProps {
  productData: Product[];
  onAddProduct?: (product: Product) => void;
}

export default function ProductView({ productData, onAddProduct }: ProductViewProps) {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    filteredProduct,
    formatRupiah,
    isAddModalOpen,
    setIsAddModalOpen,
    isSubmitting,
    name,
    setName,
    capital,
    setCapital,
    sell,
    setSell,
    handleAddSubmit
  } = useProductView({ productData, onAddProduct });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold jt-text-heading">{t('dashboard.catalog.title')}</h2>
          <p className="text-sm jt-text-muted">{t('dashboard.catalog.desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Pencarian */}
          <div className="flex items-center gap-2 bg-white border jt-border-base rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <Search className="h-4 w-4 jt-text-light shrink-0" />
            <input 
              type="text" 
              placeholder={t('dashboard.catalog.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm font-medium jt-text-body focus:outline-none w-full"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.catalog.btnAdd')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border jt-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b jt-border-light">
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.catalog.table.info')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.catalog.table.capital')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.catalog.table.sell')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.catalog.table.margin')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProduct.length > 0 ? filteredProduct.map((item) => {
                const margin = item.sell - item.capital;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold jt-text-heading text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{formatRupiah(item.capital)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold jt-text-heading">{formatRupiah(item.sell)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 jt-bg-success-soft jt-text-success font-bold text-sm rounded-lg border border-green-100">
                        + {formatRupiah(margin)}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center jt-text-muted font-medium text-sm">
                    {t('dashboard.catalog.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 jt-bg-overlay backdrop-blur-sm" onClick={() => !isSubmitting && setIsAddModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b jt-border-light">
              <h3 className="text-lg font-extrabold jt-text-heading">{t('dashboard.catalog.addModal.title', 'Tambah Produk Baru')}</h3>
              <button onClick={() => !isSubmitting && setIsAddModalOpen(false)} className="p-2 -mr-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="text-left">
                <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.name', 'Nama Produk')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={t('dashboard.catalog.addModal.namePlaceholder', 'Contoh: Keripik Singkong')} className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
              </div>
              <div className="text-left">
                <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.capital', 'Harga Modal / Pcs (Rp)')}</label>
                <input type="number" min="0" value={capital} onChange={e => setCapital(e.target.value)} required placeholder="0" className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
              </div>
              <div className="text-left">
                <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.sell', 'Harga Jual / Pcs (Rp)')}</label>
                <input type="number" min="0" value={sell} onChange={e => setSell(e.target.value)} required placeholder="0" className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className={`w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('dashboard.catalog.addModal.saving', 'Menyimpan...')}</> : <><Save className="h-5 w-5" /> {t('dashboard.catalog.addModal.save', 'Simpan Produk')}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}