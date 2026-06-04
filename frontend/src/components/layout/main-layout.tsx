import { Outlet } from "react-router"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { BottomTabBar } from "./bottom-tab-bar"
import { PageHeader } from "./page-header"
import { Toaster } from "sonner"

export function MainLayout() {
  return (
    <div className="h-full flex flex-col font-body text-body text-on-surface">
      <PageHeader />
      
      <main className="flex-1 overflow-y-auto p-4 pb-4 relative no-scrollbar">
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      <BottomTabBar />

      <Toaster
        position="top-center"
        richColors
        closeButton
      />
    </div>
  )
}