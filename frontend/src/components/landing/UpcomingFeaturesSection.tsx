import React from 'react';
import { BarChart3, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UpcomingFeaturesSection() {
  const { t } = useTranslation();

  const upcoming = [
    { icon: <BarChart3 />, title: t('roadmap.list.0.title'), desc: t('roadmap.list.0.desc') },
    { icon: <MessageCircle />, title: t('roadmap.list.1.title'), desc: t('roadmap.list.1.desc') },
  ];

  return (
    <section id="roadmap" className="py-12 md:py-16 bg-gray-50/50 border-t jt-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest jt-text-primary mb-3 block">{t('roadmap.badge')}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 jt-text-heading">{t('roadmap.title')}</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">{t('roadmap.desc')}</p>
          </div>
          <div className="flex flex-col gap-4">
            {upcoming.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 md:p-6 rounded-3xl border jt-border-light hover:border-rose-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="shrink-0 w-10 h-10 rounded-full jt-bg-surface flex items-center justify-center jt-text-light">{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}</div>
                <div>
                  <h4 className="text-base font-bold mb-2 jt-text-heading">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
