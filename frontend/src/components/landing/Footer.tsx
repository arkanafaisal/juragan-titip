import React from 'react';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-rose-600" />
          <span className="font-bold text-base tracking-tight text-gray-900">JuraganTitip</span>
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JuraganTitip. Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-500">
          <a href="#" className="hover:text-rose-600 transition-colors">Bantuan</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Privasi</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Syarat Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
