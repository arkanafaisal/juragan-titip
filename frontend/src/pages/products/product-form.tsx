import { PageHeader } from "@/components/layout/page-header"

export default function ProductFormPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Produk"
        breadcrumbs={[
          { label: "Produk", href: "/products" },
          { label: "Tambah" },
        ]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Form produk akan ditampilkan di sini (Phase 2).
        </p>
      </div>
    </div>
  )
}
