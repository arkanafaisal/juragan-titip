import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Produk } from '../../types/dashboard';

interface ProdukViewProps {
  produkData: Produk[];
}

export default function ProdukView({ produkData }: ProdukViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduk = produkData.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">{t('dashboard.catalog.title')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.catalog.desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Pencarian */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder={t('dashboard.catalog.searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none w-full"
            />
          </div>
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            {t('dashboard.catalog.btnAdd')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.catalog.table.info')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.catalog.table.modal')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.catalog.table.sell')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.catalog.table.margin')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProduk.length > 0 ? filteredProduk.map((item) => {
                const margin = item.jual - item.modal;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm">{item.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{formatRupiah(item.modal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{formatRupiah(item.jual)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-lg border border-green-100">
                        + {formatRupiah(margin)}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
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
