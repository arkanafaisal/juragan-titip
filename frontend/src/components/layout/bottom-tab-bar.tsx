import { NavLink, useLocation } from "react-router"
import {
  LayoutDashboard,
  Package,
  Store,
  Wallet,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { BarChart3, Settings } from "lucide-react"

const tabs = [
  { icon: LayoutDashboard, label: "Beranda", path: "/dashboard" },
  { icon: Package, label: "Produk", path: "/products" },
  { icon: Store, label: "Toko", path: "/stores" },
  { icon: Wallet, label: "Uang", path: "/finance/invoices" },
]

const moreItems = [
  { icon: BarChart3, label: "Laporan", path: "/reports/stores" },
  { icon: Settings, label: "Pengaturan", path: "/settings/profile" },
]

export function BottomTabBar() {
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname.startsWith(path.split("/").slice(0, 2).join("/"))
  }

  const isMoreActive = moreItems.some((item) => isActive(item.path))

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-50 animate-slide-up bg-[var(--surface)] border-t rounded-t-2xl px-4 py-3 space-y-1">
          {moreItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setShowMore(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-body transition-colors",
                isActive(item.path)
                  ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--background)]"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-[var(--surface)] px-2 md:hidden">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors min-w-[56px]",
              isActive(tab.path)
                ? "text-[var(--primary)] font-semibold"
                : "text-[var(--text-muted)]"
            )}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setShowMore(!showMore)}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors min-w-[56px]",
            isMoreActive || showMore
              ? "text-[var(--primary)] font-semibold"
              : "text-[var(--text-muted)]"
          )}
        >
          <MoreHorizontal size={20} />
          <span>Lainnya</span>
        </button>
      </nav>
    </>
  )
}
