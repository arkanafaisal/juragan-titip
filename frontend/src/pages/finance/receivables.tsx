import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { AlertTriangle } from "lucide-react"

export default function ReceivablesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Piutang"
        description="Rekap piutang per toko"
        breadcrumbs={[{ label: "Keuangan" }, { label: "Piutang" }]}
      />
      <EmptyState
        icon={AlertTriangle}
        title="Daftar piutang akan ditampilkan di sini"
        description="Fitur ini akan diimplementasi di Phase 4."
      />
    </div>
  )
}
