import { PageHeader } from "@/components/layout/page-header"

export default function ProductDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Produk"
        breadcrumbs={[
          { label: "Produk", href: "/products" },
          { label: "Detail" },
        ]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Detail produk akan ditampilkan di sini (Phase 2).
        </p>
      </div>
    </div>
  )
}
