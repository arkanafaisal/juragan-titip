import React from 'react';
import { PackageSearch, CheckSquare, Clock } from 'lucide-react';

export default function CurrentFeaturesSection() {
  const features = [
    { icon: <PackageSearch />, title: "Data Produk & Pemetaan Warung", desc: "Kelola daftar produk beserta rincian jumlah stoknya, serta pantau di warung mana saja barang tersebut didistribusikan dalam satu database terpusat." },
    { icon: <CheckSquare />, title: "Tagihan Piutang & Kalkulasi Laba", desc: "Tandai otomatis warung yang masih berstatus bon atau sudah lunas. Sistem akan langsung merekap margin keuntungan bersih Anda pada periode tersebut." },
    { icon: <Clock />, title: "Penjadwalan Restock Otomatis", desc: "Tidak ada lagi warung yang terlewat. Atur tanggal pengiriman terakhir dan sistem akan mengingatkan jadwal penarikan barang kadaluarsa atau restock." },
  ];

  return (
    <section id="fitur" className="pt-12 pb-12 md:pb-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">Operasional Lapangan Lebih Terukur</h2>
          <p className="text-base text-gray-600 max-w-2xl">Modul inti yang dirancang seringkas mungkin agar input data bisa dilakukan dengan cepat dari HP saat Anda sedang berada di lapangan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-rose-100 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-rose-100 flex items-center justify-center text-rose-600">{React.cloneElement(feat.icon as React.ReactElement, { className: "h-6 w-6" })}</div>
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
