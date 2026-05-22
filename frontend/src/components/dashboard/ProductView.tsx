import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types/dashboard';

interface ProductViewProps {
  productData: Product[];
}

export default function ProductView({ productData }: ProductViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduct = productData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

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
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center">
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
    </>
  );
}
