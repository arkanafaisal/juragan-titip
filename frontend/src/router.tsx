import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/components/layout/main-layout"
import { SidebarProvider } from '@/hooks/use-sidebar.tsx'

import { lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"

const NotFoundPage = lazy(() => import("@/pages/not-found"))
// const LoginPage = lazy(() => import("@/pages/auth/login"))
// const RegisterPage = lazy(() => import("@/pages/auth/register"))
const DashboardPage = lazy(() => import("@/pages/dashboard"))
const ProductListPage = lazy(() => import("@/pages/products/product-list"))
const StoreListPage = lazy(() => import("@/pages/stores/store-list"))
const StoreDetailPage = lazy(() => import("@/pages/stores/store-detail"))
const StoreFormPage = lazy(() => import("@/pages/stores/store-form"))
const StoreVisitPage = lazy(() => import("@/pages/stores/store-visit"))
const FinancePage = lazy(() => import("@/pages/finance.tsx"))
const JourneyPage = lazy(() => import("./pages/journey"))
// const InvoiceListPage = lazy(() => import("@/pages/finance/invoice-list"))
// const InvoiceDetailPage = lazy(() => import("@/pages/finance/invoice-detail"))
// const ReceivablesPage = lazy(() => import("@/pages/finance/receivables"))
// const StorePerformancePage = lazy(() => import("@/pages/reports/store-performance"))
// const ItemTrackingPage = lazy(() => import("@/pages/reports/item-tracking"))
// const FinancialReportPage = lazy(() => import("@/pages/reports/financial-report"))
// const ProfilePage = lazy(() => import("@/pages/settings/profile"))
// const PreferencesPage = lazy(() => import("@/pages/settings/preferences"))
const SettingsPage = lazy(() => import("@/pages/settings"))

export const router = createBrowserRouter([
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  // },
  {
    path: "/journey",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center w-full h-screen bg-neutral-900"><Loader2 className="w-8 h-8 animate-spin text-primary/50" /></div>}>
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
      { path: "stores", element: <StoreListPage /> },
      { path: "stores/new", element: <StoreFormPage /> },
      { path: "stores/:id", element: <StoreDetailPage /> },
      { path: "stores/:id/edit", element: <StoreFormPage /> },
      { path: "stores/:id/visit", element: <StoreVisitPage /> },
      { path: "finance", element: <FinancePage /> },
      // { path: "finance/invoices", element: <InvoiceListPage /> },
      // { path: "finance/invoices/:id", element: <InvoiceDetailPage /> },
      // { path: "finance/receivables", element: <ReceivablesPage /> },
      // { path: "reports/stores", element: <StorePerformancePage /> },
      // { path: "reports/tracking", element: <ItemTrackingPage /> },
      // { path: "reports/financial", element: <FinancialReportPage /> },
      // { path: "settings/profile", element: <ProfilePage /> },
      // { path: "settings/preferences", element: <PreferencesPage /> },
      { path: "settings", element: <SettingsPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
