import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onRegister: () => void;
}

export default function HeroSection({ onRegister }: HeroSectionProps) {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Activity className="h-4 w-4" /><span>Sistem Manajemen Titip Warung</span>
        </div> */}
        <h1 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
          Sistematiskan Bisnis <br className="hidden sm:block" /> Titip Barang Anda.
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Catat stok, pantau tagihan lunas/bon, dan hitung keuntungan per warung dalam satu layar yang ringkas dan bebas pusing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRegister} className="w-full sm:w-auto h-12 md:h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            Mulai Pencatatan <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#panduan" className="w-full sm:w-auto h-12 md:h-14 px-8 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 rounded-full font-bold text-base transition-colors flex items-center justify-center">
            Baca Panduan
          </a>
        </div>
      </div>
    </section>
  );
}
