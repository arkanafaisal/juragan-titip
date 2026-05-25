import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { FileText } from "lucide-react"

export default function InvoiceListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice"
        description="Daftar invoice kunjungan"
        breadcrumbs={[{ label: "Keuangan" }, { label: "Invoice" }]}
      />
      <EmptyState
        icon={FileText}
        title="Daftar invoice akan ditampilkan di sini"
        description="Fitur ini akan diimplementasi di Phase 4."
      />
    </div>
  )
}
