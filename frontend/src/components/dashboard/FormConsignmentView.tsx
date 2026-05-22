// src/components/dashboard/FormConsignmentView.tsx
import { MapPin, Link2, Info, Calendar, Clock, Loader2, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consignment, Product } from '@/types/dashboard';
import { useFormConsignment } from '@/hooks/useFormConsignment';

interface FormConsignmentViewProps {
  productData: Product[];
  onAddConsignment: (newData: Consignment) => void;
  onChangeMenu: () => void;
}

export default function FormConsignmentView({ productData, onAddConsignment, onChangeMenu }: FormConsignmentViewProps) {
  const { t } = useTranslation();
  const {
    isSubmitting,
    selectedProductId,
    setSelectedProductId,
    amount,
    setAmount,
    addressType,
    setAddressType,
    address,
    setAddress,
    linkMap,
    setLinkMap,
    lastRestock,
    setLastRestock,
    nextRestockDays,
    setNextRestockDays,
    mapRef,
    handleSubmit
  } = useFormConsignment({ productData, onAddConsignment, onChangeMenu });

  return (
    <div className="max-w-3xl mx-auto w-full jt-text-heading">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-xl font-extrabold jt-text-heading">{t('dashboard.form.title')}</h2>
          <p className="text-sm jt-text-muted">{t('dashboard.form.desc')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border jt-border-light shadow-sm p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.form.labelProduct')}</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium"
              >
                <option value="">{t('dashboard.form.placeholderProduct')}</option>
                {productData.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.form.labelQty')}</label>
              <input 
                type="number" min="1" placeholder={t('dashboard.form.placeholderQty')} 
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <hr className="jt-border-light" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-bold jt-text-body">{t('dashboard.form.labelLocation')}</label>
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button 
                  type="button"
                  onClick={() => setAddressType('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${addressType === 'map' ? 'bg-white jt-text-primary shadow-sm' : 'jt-text-muted hover:text-gray-700'}`}
                >
                  <MapPin className="h-3.5 w-3.5" /> {t('dashboard.form.typeMap')}
                </button>
                <button 
                  type="button"
                  onClick={() => setAddressType('link')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${addressType === 'link' ? 'bg-white jt-text-primary shadow-sm' : 'jt-text-muted hover:text-gray-700'}`}
                >
                  <Link2 className="h-3.5 w-3.5" /> {t('dashboard.form.typeLink')}
                </button>
              </div>
            </div>

            <div className="mb-4 text-left">
              <label className="block text-xs font-bold jt-text-muted mb-1.5 uppercase tracking-wider">{t('dashboard.form.labelAddress')}</label>
              <input 
                type="text" 
                placeholder={t('dashboard.form.placeholderAddress')} 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>

            {addressType === 'link' ? (
              <input 
                type="url" placeholder={t('dashboard.form.placeholderLink')} 
                value={linkMap} onChange={(e) => setLinkMap(e.target.value)}
                className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-64 sm:h-72 bg-gray-100 rounded-xl overflow-hidden border jt-border-base z-10" id="map-container">
                  <div ref={mapRef} className="w-full h-full"></div>
                </div>
                <p className="text-xs jt-text-muted flex items-center gap-1.5 font-medium">
                  <Info className="h-3.5 w-3.5 jt-text-primary-light shrink-0" />
                  {t('dashboard.form.mapInstruction')}
                </p>
              </div>
            )}
          </div>

          <hr className="jt-border-light" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.form.labelStart')}</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 jt-text-light" />
                <input 
                  type="date" 
                  value={lastRestock}
                  onChange={(e) => setLastRestock(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium jt-text-body" 
                />
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold jt-text-body">{t('dashboard.form.labelNext')}</label>
              </div>
              
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 h-4 w-4 jt-text-light" />
                <input 
                  type="number" min="1" placeholder={t('dashboard.form.placeholderDays')} 
                  value={nextRestockDays}
                  onChange={(e) => setNextRestockDays(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium jt-text-body" 
                />
                <span className="absolute right-4 top-3.5 text-sm font-bold jt-text-light">{t('dashboard.form.suffixDays')}</span>
              </div>
            </div>
          </div>

          <hr className="jt-border-light" />

          <div className="text-left">
            <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.form.labelStatus')}</label>
            <select disabled className="w-full px-4 py-3 bg-gray-100 border jt-border-base rounded-xl text-sm font-medium jt-text-light cursor-not-allowed appearance-none">
              <option>{t('dashboard.form.statusDraft')}</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> {t('dashboard.form.btnSubmitting')}</>
              ) : (
                <><CheckSquare className="h-5 w-5" /> {t('dashboard.form.btnSubmit')}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}