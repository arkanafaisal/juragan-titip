import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Package } from "lucide-react"

export default function ProductListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Produk"
        description="Kelola katalog produk Anda"
      />
      <EmptyState
        icon={Package}
        title="Daftar produk akan ditampilkan di sini"
        description="Fitur ini akan diimplementasi di Phase 2."
      />
    </div>
  )
}
