import React, { useState } from "react";
import {
  Box,
  LayoutDashboard,
  Package,
  Store,
  Banknote,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar.tsx";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { ProfileMenu } from "@/components/layout/profile-menu";

export function AppSidebar() {
  const { isCollapsed } = useSidebar();
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
      <nav
        className={cn(
          "hidden  flex-col bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full z-40 transition-all duration-300 py-md",
          isCollapsed ? "w-20" : "w-60"
        )}
      >
        
        <div className={cn("flex items-center px-md mb-lg transition-none", isCollapsed ? "justify-center" : "gap-sm justify-start")}>
          <div className="w-8 h-8 rounded-md bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold">
            <Box className="w-5 h-5" />
          </div>
          <div className={cn("transition-opacity duration-200", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 block")}>
            <div className="font-h2 text-h2 font-bold text-primary-container tracking-tight leading-none whitespace-nowrap">
              JuraganTitip
            </div>
          </div>
        </div>

        
        <div className={cn("flex-1 flex flex-col gap-xs px-sm transition-none", isCollapsed ? "items-center" : "gap-sm items-start")}>
          <Link
            to="/dashboard"
            onClick={(e) => handleNavClick(e, "/dashboard")}
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
            onClick={(e) => handleNavClick(e, "/products")}
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
            onClick={(e) => handleNavClick(e, "/stores")}
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
            onClick={(e) => handleNavClick(e, "/finance")}
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
            to="/settings"
            onClick={(e) => handleNavClick(e, "/settings")}
            className={cn(
              "flex items-center gap-md px-md py-sm rounded-lg transition-all",
              isActive("/settings")
                ? "bg-primary-fixed text-primary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Pengaturan</span>
          </Link>
        </div>

        
        <div className="border-t border-outline-variant pt-sm px-sm flex flex-col gap-xs items-center">
          {/* <Link
            to="/settings"
            onClick={(e) => handleNavClick(e, "/settings")}
            className={cn(
              "flex items-center gap-md px-md py-sm transition-all rounded-lg",
              isActive("/settings")
                ? "bg-primary-fixed text-primary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={cn("whitespace-nowrap transition-opacity", isCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>Pengaturan</span>
          </Link> */}

          <ProfileMenu variant="sidebar" isSidebarCollapsed={isCollapsed} />
        </div>
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