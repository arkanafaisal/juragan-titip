import { PageHeader } from "@/components/layout/page-header"

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Preferensi"
        breadcrumbs={[{ label: "Pengaturan" }, { label: "Preferensi" }]}
      />
      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Halaman preferensi akan ditampilkan di sini (Phase 5).
        </p>
      </div>
    </div>
  )
}
