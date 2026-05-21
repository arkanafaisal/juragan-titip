import React from 'react';
import { PackageSearch, CheckSquare, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CurrentFeaturesSection() {
  const { t } = useTranslation();

  const features = [
    { icon: <PackageSearch />, title: t('features.list.0.title'), desc: t('features.list.0.desc') },
    { icon: <CheckSquare />, title: t('features.list.1.title'), desc: t('features.list.1.desc') },
    { icon: <Clock />, title: t('features.list.2.title'), desc: t('features.list.2.desc') },
  ];

  return (
    <section id="fitur" className="pt-12 pb-12 md:pb-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">{t('features.badge')}</h2>
          <p className="text-base text-gray-600 max-w-2xl">{t('features.desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-rose-100 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-rose-100 flex items-center justify-center text-rose-600">{React.cloneElement(feat.icon as React.ReactElement<{className: string}>, { className: "h-6 w-6" })}</div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">{feat.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
