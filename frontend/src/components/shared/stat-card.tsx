import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  variant?: "default" | "success" | "warning" | "destructive" | "info"
  className?: string
}

const variantStyles = {
  default: {
    icon: "bg-[var(--primary-light)] text-[var(--primary)]",
  },
  success: {
    icon: "bg-[var(--color-success-50)] text-[var(--success)]",
  },
  warning: {
    icon: "bg-[var(--color-warning-50)] text-[var(--warning)]",
  },
  destructive: {
    icon: "bg-[var(--color-destructive-50)] text-[var(--destructive)]",
  },
  info: {
    icon: "bg-[var(--color-info-50)] text-[var(--info)]",
  },
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        "rounded-xl border bg-[var(--surface)] p-5 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-caption text-[var(--text-secondary)]">{title}</p>
          <p className="text-h1 font-mono text-[var(--text-primary)]">{value}</p>
          {subtitle && (
            <p className="text-caption text-[var(--text-muted)]">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-caption font-medium",
                trend.positive ? "text-[var(--success)]" : "text-[var(--destructive)]"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            styles.icon
          )}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
