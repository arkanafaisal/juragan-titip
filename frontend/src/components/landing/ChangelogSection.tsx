import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Wrench, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Release {
  version: string;
  date: string;
  title: string;
  isMajor: boolean;
  items: string[];
}

const changelogData: Release[] = [
  { version: "v1.0.0", date: "19 Mei 2026", title: "Rilis Publik Perdana (MVP)", isMajor: true, items: ["Peluncuran resmi sistem untuk wirausaha skala kecil & menengah.", "Penambahan fitur pengingat jadwal penarikan otomatis.", "Perbaikan UI/UX berdasarkan masukan dari tahap Beta."] },
  { version: "v0.9.5", date: "5 Mei 2026", title: "Optimalisasi Kalkulasi & Kecepatan", isMajor: false, items: ["Memperbaiki bug pembulatan desimal pada kalkulasi margin laba.", "Meningkatkan kecepatan muat (loading) data warung hingga 40%.", "Penyesuaian responsivitas layout untuk perangkat layar kecil."] },
  { version: "v0.9.0", date: "15 April 2026", title: "Sistem Keuangan & Tagihan", isMajor: true, items: ["Modul penandaan tagihan (Bon/Lunas) untuk setiap titik warung.", "Kalkulator otomatis untuk menghitung laba kotor & bersih.", "Penambahan ringkasan kas (summary) di dashboard utama."] },
  { version: "v0.8.5", date: "28 Maret 2026", title: "Dukungan Mode Cache", isMajor: false, items: ["Sistem kini menyimpan data sementara (cache) agar tetap bisa dibuka meski sinyal internet lemah di lapangan.", "Memperbaiki isu gagal simpan koordinat map warung."] },
  { version: "v0.8.0", date: "10 Maret 2026", title: "Versi Beta Internal", isMajor: true, items: ["Pembuatan modul awal: database pendaftaran lokasi warung.", "Manajemen inventaris (input nama, harga, dan kuantitas produk).", "Sinkronisasi data multi-perangkat via Cloud dasar."] }
];

export default function ChangelogSection() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const majorReleases = changelogData.filter(release => release.isMajor).slice(0, 3);

  return (
    <section id="changelog" className="py-12 md:py-16 bg-white border-t jt-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight jt-text-heading">{t('changelog.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {majorReleases.map((release, index) => (
            <div key={index} className="bg-gray-50/50 border jt-border-light rounded-3xl p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
              <div className="mb-4 pb-4 border-b border-gray-200/60 relative z-10">
                <span className="block text-xs font-semibold jt-text-muted mb-2">{release.date}</span>
                <h3 className="text-lg font-bold jt-text-heading leading-tight">{release.title}</h3>
              </div>
              <ul className="space-y-2.5 mt-auto relative z-10">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div><span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-10 text-center">
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 jt-bg-primary-soft hover:bg-rose-100 jt-text-primary-hover rounded-full font-bold text-sm transition-colors">
            {t('changelog.btnMore')} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isModalOpen && <ChangelogModal releases={changelogData} onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}

interface ChangelogModalProps {
  releases: Release[];
  onClose: () => void;
}

export function ChangelogModal({ releases, onClose }: ChangelogModalProps) {
  const { t } = useTranslation();
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 sm:px-8 border-b jt-border-light shrink-0">
          <div>
            <h3 className="text-xl font-extrabold jt-text-heading">{t('changelog.modal.title')}</h3>
            <p className="text-sm jt-text-muted mt-1">{t('changelog.modal.desc')}</p>
          </div>
          <button onClick={onClose} className="p-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors focus:outline-none"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8">
          {releases.map((release, index) => (
            <div key={index} className="relative pl-6 sm:pl-8">
              {index !== releases.length - 1 && <div className="absolute left-[7px] sm:left-[11px] top-8 bottom-[-2rem] w-0.5 bg-gray-100"></div>}
              <div className={`absolute left-0 sm:left-1 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${release.isMajor ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg font-bold jt-text-heading">{release.version}</span>
                {!release.isMajor && <span className="p-1.5 bg-gray-100 jt-text-muted rounded-md flex items-center" title="Rilis Minor"><Wrench className="h-3.5 w-3.5" /></span>}
                {release.isMajor && <span className="p-1.5 jt-bg-primary-soft jt-text-primary rounded-md flex items-center" title="Rilis Mayor"><Star className="h-3.5 w-3.5" /></span>}
                <span className="text-sm font-medium jt-text-muted ml-auto">{release.date}</span>
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-3">{release.title}</h4>
              <ul className="space-y-2">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></div><span className="text-sm leading-relaxed">{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t jt-border-light jt-bg-surface rounded-b-[2rem] text-center shrink-0">
          <p className="text-xs jt-text-muted font-medium">{t('changelog.modal.footer')}</p>
        </div>
      </div>
    </div>
  );
}
