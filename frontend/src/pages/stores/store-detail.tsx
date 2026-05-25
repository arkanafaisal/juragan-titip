import { PageHeader } from "@/components/layout/page-header"

export default function StoreDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Toko"
        breadcrumbs={[
          { label: "Toko", href: "/stores" },
          { label: "Profil" },
        ]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Profil toko akan ditampilkan di sini (Phase 2).
        </p>
      </div>
    </div>
  )
}
