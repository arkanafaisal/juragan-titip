import { PageHeader } from "@/components/layout/page-header"

export default function StoreFormPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Toko"
        breadcrumbs={[
          { label: "Toko", href: "/stores" },
          { label: "Tambah" },
        ]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Form toko akan ditampilkan di sini (Phase 2).
        </p>
      </div>
    </div>
  )
}
