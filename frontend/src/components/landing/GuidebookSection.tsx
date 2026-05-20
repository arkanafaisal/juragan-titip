import React from 'react';
import { MapPin, PackagePlus, Wallet, BookOpen } from 'lucide-react';

export default function GuidebookSection() {
  const steps = [
    { icon: <MapPin />, title: "1. Daftarkan Titik Warung", desc: "Masukkan nama warung dan lokasi. Anda hanya perlu melakukan ini sekali di awal kerja sama." },
    { icon: <PackagePlus />, title: "2. Input Barang Titipan", desc: "Pilih produk, masukkan jumlah yang dititipkan, dan tentukan harga dasar serta harga jual." },
    { icon: <Wallet />, title: "3. Pantau & Tarik Laba", desc: "Saat jadwal restock tiba, perbarui sisa barang. Sistem otomatis menghitung uang yang harus ditagih." }
  ];

  return (
    <section id="panduan" className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full mb-4">
            <BookOpen className="h-4 w-4 text-rose-600" /><span className="text-xs font-bold uppercase tracking-widest text-rose-600">Buku Panduan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">3 Langkah Mudah Memulai</h2>
          <p className="text-base text-gray-600">Tidak butuh waktu lama untuk memindahkan catatan manual Anda. Prosesnya kami buat sesederhana mungkin.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-200">{React.cloneElement(step.icon as React.ReactElement<{className: string}>, { className: "h-7 w-7" })}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
