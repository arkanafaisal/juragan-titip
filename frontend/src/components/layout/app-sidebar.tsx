import { NavLink, useLocation } from "react-router"
import {
  LayoutDashboard,
  Package,
  Store,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { useAuth } from "@/contexts/auth-context"
import { useSidebar } from "@/hooks/use-sidebar"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Produk", path: "/products" },
  { icon: Store, label: "Toko", path: "/stores" },
  { icon: Wallet, label: "Keuangan", path: "/finance/invoices" },
  { icon: BarChart3, label: "Laporan", path: "/reports/stores" },
]

const bottomItems = [
  { icon: Settings, label: "Pengaturan", path: "/settings/profile" },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const { isCollapsed, toggle } = useSidebar()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname.startsWith(path.split("/").slice(0, 2).join("/"))
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-[var(--surface)] transition-all duration-200",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white font-bold text-sm">
          JT
        </div>
        {!isCollapsed && (
          <span className="text-h3 truncate text-[var(--text-primary)]">
            {APP_NAME}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-body transition-all duration-150",
              isActive(item.path)
                ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium border-l-[3px] border-[var(--primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--text-primary)]",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t px-2 py-3 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-body transition-all duration-150",
              isActive(item.path)
                ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--text-primary)]",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body text-[var(--text-secondary)] hover:bg-[var(--destructive-50)] hover:text-[var(--destructive)] transition-all duration-150",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span>Keluar</span>}
        </button>

        {!isCollapsed && user && (
          <div className="flex items-center gap-3 rounded-lg bg-[var(--background)] px-3 py-2.5 mt-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white text-caption font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-[var(--text-primary)]">
                {user.name}
              </p>
              <p className="truncate text-caption text-[var(--text-muted)]">
                Reseller
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={toggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm hover:bg-[var(--background)] transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
