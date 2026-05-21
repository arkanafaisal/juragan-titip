import { useState, useMemo } from 'react';
import { ArrowUpDown, PlusCircle, MapPin, Clock, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consignment } from '../../types/dashboard';
import LocationModal from './LocationModal';

interface ConsignmentViewProps {
  titipanData: Consignment[];
  onChangeMenu: () => void;
}

export default function ConsignmentView({ titipanData, onChangeMenu }: ConsignmentViewProps) {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLocationMap, setSelectedLocationMap] = useState<Consignment | null>(null);

  const sortedData = useMemo(() => {
    return [...titipanData].sort((a, b) => {
      const dateA = new Date(a.nextRestock).getTime();
      const dateB = new Date(b.nextRestock).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [titipanData, sortOrder]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(t('i18n.locale') === 'en' ? 'en-US' : 'id-ID', options);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">{t('dashboard.titipan.title')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.titipan.desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <ArrowUpDown className="h-4 w-4 text-gray-400 shrink-0" />
            <select 
              className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none w-full appearance-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">{t('dashboard.titipan.sortNewest')}</option>
              <option value="oldest">{t('dashboard.titipan.sortOldest')}</option>
            </select>
          </div>
          <button 
            onClick={onChangeMenu}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            {t('dashboard.titipan.btnAdd')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.titipan.table.product')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.titipan.table.qty')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.titipan.table.location')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.titipan.table.lastRestock')}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.titipan.table.nextRestock')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.length > 0 ? sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">{item.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-800 font-bold text-sm rounded-lg">
                      {item.jumlah}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedLocationMap(item)}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl shrink-0 transition-colors shadow-sm"
                        title={t('dashboard.titipan.viewMap')}
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-600 truncate block" title={item.lokasi}>
                        {item.lokasi}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-500">{formatDate(item.lastRestock)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-bold text-sm rounded-lg">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(item.nextRestock)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
                    {t('dashboard.titipan.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500 font-medium">
          <span>{t('dashboard.titipan.showingCount', { count: sortedData.length })}</span>
        </div>
      </div>

      {/* MODAL PETA VIEW ONLY */}
      {selectedLocationMap && (
        <LocationModal 
          data={selectedLocationMap} 
          onClose={() => setSelectedLocationMap(null)} 
        />
      )}
    </>
  );
}
