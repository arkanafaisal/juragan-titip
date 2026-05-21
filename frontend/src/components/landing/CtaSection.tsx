import React from 'react';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CtaSectionProps {
  onRegister: () => void;
}

export default function CtaSection({ onRegister }: CtaSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 jt-bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Zap className="h-10 w-10 mx-auto mb-6 text-rose-200" />
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t('cta.title')}</h2>
        <p className="text-lg md:text-xl text-rose-100 mb-8 md:mb-10 max-w-xl mx-auto">{t('cta.desc')}</p>
        <button onClick={onRegister} className="h-14 px-10 bg-white hover:jt-bg-surface jt-text-primary rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
          {t('cta.btn')}
        </button>
      </div>
    </section>
  );
}
