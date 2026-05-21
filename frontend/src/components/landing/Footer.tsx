import React from 'react';
import { Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t jt-border-light py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 jt-text-primary" />
          <span className="font-bold text-base tracking-tight jt-text-heading">JuraganTitip</span>
        </div>
        <div className="jt-text-muted text-sm">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </div>
        <div className="flex gap-6 text-sm font-semibold jt-text-muted">
          <a href="#" className="hover:jt-text-primary transition-colors">{t('footer.links.help')}</a>
          <a href="#" className="hover:jt-text-primary transition-colors">{t('footer.links.privacy')}</a>
          <a href="#" className="hover:jt-text-primary transition-colors">{t('footer.links.terms')}</a>
        </div>
      </div>
    </footer>
  );
}
