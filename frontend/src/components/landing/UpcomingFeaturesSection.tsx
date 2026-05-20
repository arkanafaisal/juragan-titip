import React from 'react';
import { BarChart3, MessageCircle } from 'lucide-react';

export default function UpcomingFeaturesSection() {
  const upcoming = [
    { icon: <BarChart3 />, title: "Analitik Data & Pencarian Lanjutan", desc: "Visualisasi metrik tren performa warung terbaik dan pencarian riwayat data menggunakan kombinasi filter yang spesifik." },
    { icon: <MessageCircle />, title: "Automasi WhatsApp & Export Excel", desc: "Kirim rincian tagihan ke pemilik warung via WA dengan sekali klik, dan unduh rekapitulasi data format XLSX untuk pembukuan eksternal." },
  ];

  return (
    <section id="roadmap" className="py-12 md:py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-3 block">Roadmap Mendatang</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900">Persiapan Skala Besar</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Kami sedang menyiapkan fitur-fitur ini agar aplikasi tidak hanya menjadi buku catatan, tetapi juga asisten bisnis proaktif Anda.</p>
          </div>
          <div className="flex flex-col gap-4">
            {upcoming.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 md:p-6 rounded-3xl border border-gray-100 hover:border-rose-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}</div>
                <div>
                  <h4 className="text-base font-bold mb-2 text-gray-900">{item.title}</h4>
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
