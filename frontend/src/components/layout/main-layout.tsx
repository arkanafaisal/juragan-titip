import { Outlet } from "react-router"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { BottomTabBar } from "./bottom-tab-bar"
import { PageHeader } from "./page-header"
import { useMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/hooks/use-sidebar.tsx"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

export function MainLayout() {
  const isMobile = useMobile()
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-dvh bg-surface-bright font-body text-body text-on-surface selection:bg-primary-container selection:text-on-primary-container flex">
      
      {!isMobile && <AppSidebar />}

      <main
        className={cn(
          "flex-1 flex flex-col min-h-dvh transition-all duration-300 min-w-0 relative",
          isMobile
            ? "pb-safe"
            : isCollapsed
              ? "pl-20"  
              : "pl-60"  
        )}
      >
        <PageHeader />
        
        
        <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg animate-fade-in">
          <Suspense fallback={
            <div className="flex items-center justify-center w-full h-full min-h-[200px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          }>
            <Outlet />
          </Suspense>
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