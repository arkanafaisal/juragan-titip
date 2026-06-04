import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/components/layout/main-layout"
import { SidebarProvider } from '@/hooks/use-sidebar.tsx'

import { lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"

const NotFoundPage = lazy(() => import("@/pages/not-found"))
const DashboardPage = lazy(() => import("@/pages/dashboard"))
const ProductListPage = lazy(() => import("@/pages/products/product-list"))
const ProductDetailPage = lazy(() => import("@/pages/products/product-detail"))
const ProductEditPage = lazy(() => import("@/pages/products/product-edit"))
const StoreListPage = lazy(() => import("@/pages/stores/store-list"))
const StoreDetailPage = lazy(() => import("@/pages/stores/store-detail"))
const StoreFormPage = lazy(() => import("@/pages/stores/store-form"))
const StoreVisitPage = lazy(() => import("@/pages/stores/store-visit"))
const FinancePage = lazy(() => import("@/pages/finance.tsx"))
const JourneyPage = lazy(() => import("./pages/journey"))
const SettingsPage = lazy(() => import("@/pages/settings"))

export const router = createBrowserRouter([
  {
    path: "/journey",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center w-full h-dvh bg-neutral-900"><Loader2 className="w-8 h-8 animate-spin text-primary/50" /></div>}>
        <JourneyPage />
      </Suspense>
    )
  },
  {
    path: "/",
    element: (
      <SidebarProvider>
        <MainLayout />
      </SidebarProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "products", element: <ProductListPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "products/:id/edit", element: <ProductEditPage /> },
      { path: "stores", element: <StoreListPage /> },
      { path: "stores/new", element: <StoreFormPage /> },
      { path: "stores/:id", element: <StoreDetailPage /> },
      { path: "stores/:id/edit", element: <StoreFormPage /> },
      { path: "stores/:id/visit", element: <StoreVisitPage /> },
      { path: "finance", element: <FinancePage /> },
      { path: "settings", element: <SettingsPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
