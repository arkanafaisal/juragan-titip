import React from 'react';
import { Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-rose-600" />
          <span className="font-bold text-base tracking-tight text-gray-900">JuraganTitip</span>
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-500">
          <a href="#" className="hover:text-rose-600 transition-colors">{t('footer.links.help')}</a>
          <a href="#" className="hover:text-rose-600 transition-colors">{t('footer.links.privacy')}</a>
          <a href="#" className="hover:text-rose-600 transition-colors">{t('footer.links.terms')}</a>
        </div>
      </div>
    </footer>
  );
}
