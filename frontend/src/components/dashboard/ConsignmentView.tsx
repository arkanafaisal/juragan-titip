// src/components/dashboard/ConsignmentView.tsx
import { ArrowUpDown, PlusCircle, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consignment, Product } from '@/types/dashboard';
import LocationModal from '@/components/dashboard/LocationModal';
import { useConsignmentView } from '@/hooks/useConsignmentView';

interface ConsignmentViewProps {
  titipanData: Consignment[];
  productData: Product[];
  onChangeMenu: () => void;
}

export default function ConsignmentView({ titipanData, productData, onChangeMenu }: ConsignmentViewProps) {
  const { t } = useTranslation();
  const {
    sortOrder,
    setSortOrder,
    selectedLocationMap,
    setSelectedLocationMap,
    sortedData,
    formatDate
  } = useConsignmentView({ titipanData });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold jt-text-heading">{t('dashboard.titipan.title')}</h2>
          <p className="text-sm jt-text-muted">{t('dashboard.titipan.desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border jt-border-base rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <ArrowUpDown className="h-4 w-4 jt-text-light shrink-0" />
            <select 
              className="bg-transparent text-sm font-semibold jt-text-body focus:outline-none w-full appearance-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">{t('dashboard.titipan.sortNewest')}</option>
              <option value="oldest">{t('dashboard.titipan.sortOldest')}</option>
            </select>
          </div>
          <button 
            onClick={onChangeMenu}
            className="jt-bg-primary hover:jt-bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            {t('dashboard.titipan.btnAdd')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border jt-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b jt-border-light">
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.titipan.table.product')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.titipan.table.qty')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.titipan.table.location')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.titipan.table.lastRestock')}</th>
                <th className="px-6 py-4 text-xs font-bold jt-text-muted uppercase tracking-wider">{t('dashboard.titipan.table.nextRestock')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.length > 0 ? sortedData.map((item) => {
                const product = productData.find(p => p.id === item.productId);
                return (
                  <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold jt-text-heading text-sm">{product ? product.name : `Produk ID #${item.productId}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-800 font-bold text-sm rounded-lg">
                        {item.sum}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedLocationMap(item)}
                          className="p-2 jt-bg-primary-soft jt-text-primary hover:bg-rose-100 rounded-xl shrink-0 transition-colors shadow-sm"
                          title={t('dashboard.titipan.viewMap')}
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-600 truncate block" title={item.address}>
                          {item.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium jt-text-muted">{formatDate(item.lastRestock)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 jt-bg-primary-soft jt-text-primary-hover font-bold text-sm rounded-lg">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(item.nextRestock)}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center jt-text-muted font-medium text-sm">
                    {t('dashboard.titipan.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50/50 border-t jt-border-light px-6 py-4 flex items-center justify-between text-sm jt-text-muted font-medium">
          <span>{t('dashboard.titipan.showingCount', { count: sortedData.length })}</span>
        </div>
      </div>

      {selectedLocationMap && (
        <LocationModal 
          data={selectedLocationMap} 
          onClose={() => setSelectedLocationMap(null)} 
        />
      )}
    </>
  );
}