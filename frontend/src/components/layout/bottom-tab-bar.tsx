import { Home, Package, Store, Banknote, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import React, { useState } from "react";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isFormRoute = /^\/stores\/(new|[^/]+\/edit|[^/]+\/visit)$/.test(location.pathname);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === location.pathname) {
      e.preventDefault();
      return;
    }
    if (isFormRoute) {
      e.preventDefault();
      setPendingPath(path);
    }
  };

  const confirmNavigation = () => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <>
      <nav className="shrink-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center px-1 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/dashboard" onClick={(e) => handleNavClick(e, "/dashboard")} className="flex flex-col items-center justify-center flex-1 shrink-0 min-w-0 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
          <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/dashboard") ? "bg-primary-fixed text-primary-container" : ""}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className={`font-caption text-[10px] truncate w-full text-center px-1 ${isActive("/dashboard") ? "font-medium text-primary-container" : ""}`}>Beranda</span>
        </Link>
        
        <Link to="/products" onClick={(e) => handleNavClick(e, "/products")} className="flex flex-col items-center justify-center flex-1 shrink-0 min-w-0 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
          <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/products") ? "bg-primary-fixed text-primary-container" : ""}`}>
            <Package className="w-5 h-5" />
          </div>
          <span className={`font-caption text-[10px] truncate w-full text-center px-1 ${isActive("/products") ? "font-medium text-primary-container" : ""}`}>Produk</span>
        </Link>

        <Link to="/stores" onClick={(e) => handleNavClick(e, "/stores")} className="flex flex-col items-center justify-center flex-1 shrink-0 min-w-0 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
          <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/stores") ? "bg-primary-fixed text-primary-container" : ""}`}>
            <Store className="w-5 h-5" />
          </div>
          <span className={`font-caption text-[10px] truncate w-full text-center px-1 ${isActive("/stores") ? "font-medium text-primary-container" : ""}`}>Toko</span>
        </Link>

        <Link to="/finance" onClick={(e) => handleNavClick(e, "/finance")} className="flex flex-col items-center justify-center flex-1 shrink-0 min-w-0 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
          <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/finance") ? "bg-primary-fixed text-primary-container" : ""}`}>
            <Banknote className="w-5 h-5" />
          </div>
          <span className={`font-caption text-[10px] truncate w-full text-center px-1 ${isActive("/finance") ? "font-medium text-primary-container" : ""}`}>Uang</span>
        </Link>

        <Link to="/settings" onClick={(e) => handleNavClick(e, "/settings")} className="flex flex-col items-center justify-center flex-1 shrink-0 min-w-0 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
          <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/settings") ? "bg-primary-fixed text-primary-container" : ""}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className={`font-caption text-[10px] truncate w-full text-center px-1 ${isActive("/settings") ? "font-medium text-primary-container" : ""}`}>Pengaturan</span>
        </Link>
      </nav>

      <ConfirmationModal
        isOpen={!!pendingPath}
        onClose={() => setPendingPath(null)}
        onConfirm={confirmNavigation}
        title="Tinggalkan Halaman?"
        description="Perubahan yang belum diselesaikan mungkin akan hilang jika Anda meninggalkan halaman ini sekarang."
        confirmText="Tetap Tinggalkan"
        isDanger={true}
      />
    </>
  );
}