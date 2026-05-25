import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Store } from "lucide-react"

export default function StoreListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Toko Mitra"
        description="Kelola daftar toko konsinyasi Anda"
      />
      <EmptyState
        icon={Store}
        title="Daftar toko akan ditampilkan di sini"
        description="Fitur ini akan diimplementasi di Phase 2."
      />
    </div>
  )
}
