import { Outlet } from "react-router"
import { AppSidebar } from "./app-sidebar"
import { BottomTabBar } from "./bottom-tab-bar"
import { useMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

export function MainLayout() {
  const isMobile = useMobile()
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {!isMobile && <AppSidebar />}

      <main
        className={cn(
          "min-h-screen transition-all duration-200",
          isMobile
            ? "pb-20 px-4 pt-4"
            : isCollapsed
              ? "pl-16"
              : "pl-60"
        )}
      >
        <div className={cn("mx-auto w-full", !isMobile && "p-6 max-w-7xl")}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {isMobile && <BottomTabBar />}

      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        richColors
        closeButton
      />
    </div>
  )
}
