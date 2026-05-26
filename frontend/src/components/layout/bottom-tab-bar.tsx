import { Home, Package, Store, Banknote, Menu } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomTabBar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-2 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link to="/dashboard" className="flex flex-col items-center justify-center px-3 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/dashboard") ? "bg-primary-fixed text-primary-container" : ""}`}>
          <Home className="w-5 h-5" />
        </div>
        <span className={`font-caption text-[10px] ${isActive("/dashboard") ? "font-medium text-primary-container" : ""}`}>Beranda</span>
      </Link>
      
      <Link to="/products" className="flex flex-col items-center justify-center px-3 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/products") ? "bg-primary-fixed text-primary-container" : ""}`}>
          <Package className="w-5 h-5" />
        </div>
        <span className={`font-caption text-[10px] ${isActive("/products") ? "font-medium text-primary-container" : ""}`}>Produk</span>
      </Link>

      <Link to="/stores" className="flex flex-col items-center justify-center px-3 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/stores") ? "bg-primary-fixed text-primary-container" : ""}`}>
          <Store className="w-5 h-5" />
        </div>
        <span className={`font-caption text-[10px] ${isActive("/stores") ? "font-medium text-primary-container" : ""}`}>Toko</span>
      </Link>

      <Link to="/finance" className="flex flex-col items-center justify-center px-3 py-1 text-on-surface-variant hover:text-primary-container transition-colors">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${isActive("/finance") ? "bg-primary-fixed text-primary-container" : ""}`}>
          <Banknote className="w-5 h-5" />
        </div>
        <span className={`font-caption text-[10px] ${isActive("/finance") ? "font-medium text-primary-container" : ""}`}>Uang</span>
      </Link>

      <button className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:text-primary-container transition-colors">
        <div className="w-12 h-8 flex items-center justify-center mb-1">
          <Menu className="w-5 h-5" />
        </div>
        <span className="font-caption text-[10px]">Lainnya</span>
      </button>
    </nav>
  );
}