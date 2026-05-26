import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Wallet, Package, Store, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan bisnis konsinyasi Anda"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pendapatan"
          value="Rp 12.5jt"
          icon={Wallet}
          trend={{ value: "12% dari bulan lalu", positive: true }}
          variant="default"
        />
        <StatCard
          title="Stok Gudang"
          value="342 item"
          icon={Package}
          trend={{ value: "8% dari bulan lalu", positive: false }}
          variant="info"
        />
        <StatCard
          title="Toko Aktif"
          value="15 toko"
          icon={Store}
          trend={{ value: "2 toko baru", positive: true }}
          variant="success"
        />
        <StatCard
          title="Piutang"
          value="Rp 3.2jt"
          subtitle="4 toko"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="rounded-xl border bg-[var(--surface)] p-6">
        <p className="text-body text-[var(--text-secondary)]">
          Grafik dan aktivitas terkini akan ditampilkan di sini (Phase 4).
        </p>
      </div>
    </div>
  )
}
