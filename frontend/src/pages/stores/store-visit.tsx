import { PageHeader } from "@/components/layout/page-header"

export default function StoreVisitPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kunjungan"
        breadcrumbs={[
          { label: "Toko", href: "/stores" },
          { label: "Kunjungan" },
        ]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Flow kunjungan akan ditampilkan di sini (Phase 3).
        </p>
      </div>
    </div>
  )
}
