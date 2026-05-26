import {
  Box,
  LayoutDashboard,
  Package,
  Store,
  Banknote,
  BarChart3,
  Settings,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar.tsx";

export function AppSidebar() {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className={cn(
        "hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full z-40 transition-all duration-300 py-md overflow-x-hidden",
        isCollapsed ? "w-20" : "w-60"
      )}
    >
      {/* Bagian Logo */}
      <div className={cn("flex items-center px-md mb-lg transition-all", isCollapsed ? "justify-center" : "gap-sm justify-start")}>
        <div className="w-8 h-8 rounded-md bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold">
          <Box className="w-5 h-5" />
        </div>
        <div className={cn("transition-opacity duration-200", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 block")}>
          <div className="font-h2 text-h2 font-bold text-primary-container tracking-tight leading-none whitespace-nowrap">
            JuraganTitip
          </div>
        </div>
      </div>

      {/* Navigasi Utama */}
      <div className="flex-1 flex flex-col gap-xs px-sm">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-md px-md py-sm rounded-lg relative group transition-all",
            isActive("/dashboard")
              ? "bg-primary-fixed text-primary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          {isActive("/dashboard") && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-container rounded-r-md"></div>
          )}
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Dashboard</span>
        </Link>
        
        <Link
          to="/products"
          className={cn(
            "flex items-center gap-md px-md py-sm rounded-lg transition-all",
            isActive("/products")
              ? "bg-primary-fixed text-primary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <Package className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Produk</span>
        </Link>

        <Link
          to="/stores"
          className={cn(
            "flex items-center gap-md px-md py-sm rounded-lg transition-all",
            isActive("/stores")
              ? "bg-primary-fixed text-primary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <Store className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Toko</span>
        </Link>

        <Link
          to="/finance"
          className={cn(
            "flex items-center gap-md px-md py-sm rounded-lg transition-all",
            isActive("/finance")
              ? "bg-primary-fixed text-primary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <Banknote className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Keuangan</span>
        </Link>

        <Link
          to="/reports"
          className={cn(
            "flex items-center gap-md px-md py-sm rounded-lg transition-all",
            isActive("/reports")
              ? "bg-primary-fixed text-primary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Laporan</span>
        </Link>
      </div>

      {/* Bagian Bawah (Pengaturan & Profil) */}
      <div className="border-t border-outline-variant pt-sm px-sm flex flex-col gap-xs">
        <Link
          to="/settings"
          className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Pengaturan</span>
        </Link>

        <div className={cn("mt-sm bg-surface-container-low rounded-lg p-sm flex items-center gap-sm cursor-pointer mx-xs border border-outline-variant", isCollapsed ? "justify-center" : "justify-start")}>
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className={cn("transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>
            <div className="font-body-sm text-body-sm font-medium text-on-surface truncate w-[130px]">Ahmad</div>
            <div className="font-caption text-caption text-on-surface-variant truncate w-[130px]">Reseller</div>
          </div>
        </div>
      </div>
    </nav>
  );
}