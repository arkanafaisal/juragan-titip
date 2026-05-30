import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/components/layout/main-layout"
import { SidebarProvider } from '@/hooks/use-sidebar.tsx'

import NotFoundPage from "@/pages/not-found"
// import LoginPage from "@/pages/auth/login"
// import RegisterPage from "@/pages/auth/register"
import DashboardPage from "@/pages/dashboard"
import ProductListPage from "@/pages/products/product-list"
import StoreListPage from "@/pages/stores/store-list"
import StoreDetailPage from "@/pages/stores/store-detail"
import StoreFormPage from "@/pages/stores/store-form"
import StoreVisitPage from "@/pages/stores/store-visit"
import FinancePage from "@/pages/finance.tsx"
// import InvoiceListPage from "@/pages/finance/invoice-list"
// import InvoiceDetailPage from "@/pages/finance/invoice-detail"
// import ReceivablesPage from "@/pages/finance/receivables"
// import StorePerformancePage from "@/pages/reports/store-performance"
// import ItemTrackingPage from "@/pages/reports/item-tracking"
// import FinancialReportPage from "@/pages/reports/financial-report"
// import ProfilePage from "@/pages/settings/profile"
// import PreferencesPage from "@/pages/settings/preferences"
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

      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
