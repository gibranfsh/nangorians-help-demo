import type { HelpRequestStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusConfig = {
  open: {
    label: "Open",
    className: "bg-primary/10 text-primary border border-primary/10",
    dotClass: "bg-primary animate-pulse",
  },
  claimed: {
    label: "Assigned",
    className: "bg-secondary/10 text-secondary border border-secondary/10",
    dotClass: "bg-secondary",
  },
  in_progress: {
    label: "In progress",
    className: "bg-info/10 text-info border border-info/10",
    dotClass: "bg-info animate-pulse",
  },
  executed: {
    label: "Under review",
    className: "bg-warning/10 text-warning border border-warning/10",
    dotClass: "bg-warning animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border border-success/10",
    dotClass: "bg-success",
  },
} satisfies Record<
  HelpRequestStatus,
  { label: string; className: string; dotClass: string }
>

type StatusBadgeProps = {
  status: HelpRequestStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  )
}
