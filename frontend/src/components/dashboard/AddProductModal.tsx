// src/components/dashboard/AddProductModal.tsx
import React from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  name: string;
  setName: (val: string) => void;
  capital: string;
  setCapital: (val: string) => void;
  sell: string;
  setSell: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  isSubmitting,
  name,
  setName,
  capital,
  setCapital,
  sell,
  setSell,
  onSubmit
}: AddProductModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 jt-bg-overlay backdrop-blur-sm" onClick={() => !isSubmitting && onClose()}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b jt-border-light">
          <h3 className="text-lg font-extrabold jt-text-heading">{t('dashboard.catalog.addModal.title')}</h3>
          <button onClick={() => !isSubmitting && onClose()} className="p-2 -mr-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="text-left">
            <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.name')}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={t('dashboard.catalog.addModal.namePlaceholder')} className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
          </div>
          <div className="text-left">
            <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.capital')}</label>
            <input type="number" min="0" value={capital} onChange={e => setCapital(e.target.value)} required placeholder="0" className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
          </div>
          <div className="text-left">
            <label className="block text-sm font-bold jt-text-body mb-2">{t('dashboard.catalog.addModal.sell')}</label>
            <input type="number" min="0" value={sell} onChange={e => setSell(e.target.value)} required placeholder="0" className="w-full px-4 py-3 jt-bg-surface border jt-border-base rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className={`w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
              {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('dashboard.catalog.addModal.saving')}</> : <><Save className="h-5 w-5" /> {t('dashboard.catalog.addModal.save')}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}