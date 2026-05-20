import { useState } from 'react';
import { Search, Plus, Tags } from 'lucide-react';
import type { Produk } from '../../types/dashboard';

interface ProdukViewProps {
  produkData: Produk[];
}

export default function ProdukView({ produkData }: ProdukViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduk = produkData.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">Katalog Produk</h2>
          <p className="text-sm text-gray-500">Kelola master data produk dan harga dasar agar mudah dipilih saat menitipkan barang.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Pencarian */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none w-full"
            />
          </div>
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Modal / Pcs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Jual / Pcs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estimasi Laba (Margin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProduk.length > 0 ? filteredProduk.map((item) => {
                const margin = item.jual - item.modal;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Tags className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{item.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{formatRupiah(item.modal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{formatRupiah(item.jual)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-lg border border-green-100">
                        + {formatRupiah(margin)}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
