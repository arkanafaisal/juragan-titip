import React, { useState } from 'react';
import { Store, Menu, X } from 'lucide-react';

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Navbar({ onLogin, onRegister }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <div className="text-rose-600"><Store className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.5} /></div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-rose-600">JuraganTitip</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#fitur" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Fitur</a>
            <a href="#panduan" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Panduan</a>
            <a href="#roadmap" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Roadmap</a>
            <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors ml-4">Masuk</button>
            <button onClick={onRegister} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">Mulai Gratis</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-rose-600 p-2 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 shadow-lg">
          <a href="#fitur" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Fitur</a>
          <a href="#panduan" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Panduan</a>
          <a href="#roadmap" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Roadmap</a>
          <hr className="border-gray-100 my-2" />
          <button onClick={onLogin} className="w-full text-left px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Masuk</button>
          <button onClick={onRegister} className="w-full mt-2 bg-rose-600 text-white px-4 py-3.5 rounded-full text-base font-semibold text-center shadow-sm">Mulai Gratis</button>
        </div>
      )}
    </nav>
  );
}
