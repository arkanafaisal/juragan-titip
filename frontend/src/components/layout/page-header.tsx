import React, { useState, useRef, useEffect } from "react";
import { Menu, Calendar, Bell, User, Settings, LogOut } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Link, useLocation } from "react-router";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function PageHeader() {
  const location = useLocation();
  const todayDate = format(new Date(), "dd MMM yyyy", { locale: idLocale });
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();
  
  // State & Ref untuk Dropdown Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle klik di luar untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi Parser Dinamis URL
  const getDynamicTitle = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    const section = parts[0];
    const actionOrId = parts[1];
    const subAction = parts[2];

    const sectionMap: Record<string, string> = {
      products: "Produk",
      stores: "Toko",
      finance: "Keuangan",
      reports: "Laporan",
      settings: "Pengaturan"
    };

    const subject = sectionMap[section] || section;

    // Overrides spesifik halaman yang unik
    if (section === "dashboard") return "Dashboard";
    if (section === "finance") {
      if (actionOrId === "receivables") return "Daftar Piutang";
      if (actionOrId === "invoices") {
          if (!subAction) return "Daftar Faktur";
          return "Detail Faktur";
      }
    }
    if (section === "reports") {
      if (actionOrId === "stores") return "Performa Toko";
      if (actionOrId === "tracking") return "Lacak Barang";
      if (actionOrId === "financial") return "Laporan Keuangan";
      return "Laporan";
    }
    if (section === "settings") {
      if (actionOrId === "profile") return "Profil";
      if (actionOrId === "preferences") return "Preferensi";
      return "Pengaturan";
    }

    // Pola CRUD umum (Daftar, Tambah, Detail, Edit)
    if (!actionOrId) return `Daftar ${subject}`;
    if (actionOrId === "new") return `Tambah ${subject}`;
    if (!subAction) return `Detail ${subject}`;
    if (subAction === "edit") return `Edit Data ${subject}`;
    if (subAction === "visit" && section === "stores") return "Kunjungan Toko";

    return "JuraganTitip";
  };

  const dynamicTitle = getDynamicTitle(location.pathname);
  // Mengecilkan ukuran font untuk judul yang panjang di perangkat mobile
  const isLongTitle = dynamicTitle.length > 15;

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-md h-16 shrink-0 z-30 sticky top-0">
      
      {/* Wrapper min-w-0 penting agar teks bisa di-truncate jika mentok */}
      <div className="flex items-center gap-sm min-w-0 pr-2">
        <button 
          onClick={toggle}
          className="hidden md:block p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="text-h1 font-bold text-primary-container tracking-tight truncate">
          {dynamicTitle}
        </div>
      </div>

      <div className="flex items-center gap-sm shrink-0">
        <div className="hidden md:flex items-center gap-xs text-on-surface-variant bg-surface-bright px-sm py-xs rounded-md border border-outline-variant mr-sm">
          <Calendar className="w-4 h-4" />
          <span className="font-data-md text-data-md">{todayDate}</span>
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>
        
        {/* WRAPPER RELATIVE UNTUK USER ICON & DROPDOWN */}
        <div className="md:hidden relative ml-1" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          >
            <User className="w-4 h-4" />
          </button>

          {/* LAYER DROPDOWN MELAYANG */}
          {isProfileOpen && (
            <div className="absolute top-[calc(100%+12px)] right-0 flex flex-col w-[240px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-md py-sm border-b border-outline-variant flex flex-col">
                <span className="font-body text-body font-medium text-on-surface truncate">
                  {user?.name}
                </span>
                <span className="font-caption text-caption text-on-surface-variant truncate">
                  {user?.email}
                </span>
              </div>
              <div className="p-xs">
                <Link to="/settings" className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors text-left w-full">
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="font-body-sm text-body-sm">Pengaturan</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-sm px-md py-sm text-error hover:bg-error/10 rounded-lg transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="font-body-sm text-body-sm">Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}