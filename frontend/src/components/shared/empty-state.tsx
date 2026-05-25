import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--background)] mb-4">
        <Icon size={32} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="text-h3 text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-body text-[var(--text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
