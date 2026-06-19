import Link from "next/link"
import { Clock, MapPin, Timer } from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { StockImage } from "@/components/stock-image"
import { UserAvatar } from "@/components/user-avatar"
import { getCategoryConfig } from "@/lib/categories"
import { getCategoryImage } from "@/lib/images"
import { formatPrice, formatPriceRange, formatRelativeTime } from "@/lib/format"
import type { HelpRequest } from "@/lib/types"
import { cn } from "@/lib/utils"

type RequestCardProps = {
  request: HelpRequest
  className?: string
  /** Index for stagger-fade animation delay */
  index?: number
}

export function RequestCard({ request, className, index = 0 }: RequestCardProps) {
  const config = getCategoryConfig(request.category)
  const categoryImage = getCategoryImage(request.category)
  const Icon = config.icon
  const isClaimed = request.status === "claimed"
  const isInProgress = request.status === "in_progress"
  const isExecuted = request.status === "executed"
  const isCompleted = request.status === "completed"
  const hasHelper = !!request.helper

  const statusBorderClass =
    isCompleted ? "border-success/30 opacity-85" :
    isExecuted ? "border-warning/30" :
    isInProgress ? "border-info/30" :
    isClaimed ? "border-secondary/20" :
    "border-border"

  return (
    <Link
      href={`/requests/${request.id}`}
      className={cn(
        "group relative flex flex-col h-full cursor-pointer overflow-hidden rounded-xl border bg-card shadow-e2 transition-[border-color,box-shadow] duration-200 hover:border-primary/20 hover:shadow-e3 card-stagger",
        statusBorderClass,
        className,
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {request.photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={request.photoUrl}
            alt={request.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <StockImage
            image={categoryImage}
            fill
            className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent transition-opacity duration-300 group-hover:from-ink/20" />
        {/* Category accent bar */}
        <div className={cn("absolute top-0 left-0 h-full w-1 transition-all duration-200 group-hover:w-1.5", config.accentClass)} />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="space-y-3.5">
          {/* Header Row 1: Category Chip (left) & Price Range Badge (right, whitespace-nowrap) */}
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-ink shrink-0">
              <Icon className="size-3" strokeWidth={1.75} />
              {request.category}
            </span>
            <span className={cn(
              "whitespace-nowrap tabular-nums rounded-lg px-2.5 py-1 text-xs font-bold transition-colors duration-200 shrink-0",
              request.agreedPrice
                ? "bg-success/10 text-success border border-success/10"
                : "bg-surface-raised text-ink group-hover:bg-primary/5 border border-border/60"
            )}>
              {request.agreedPrice
                ? formatPrice(request.agreedPrice)
                : formatPriceRange(request.priceMin, request.priceMax)}
            </span>
          </div>

          {/* Header Row 2: Badges (Urgent, Status) */}
          {(request.urgent || request.status) && (
            <div className="flex flex-wrap items-center gap-2 min-h-6">
              {request.urgent && (
                <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold text-warning border border-warning/10 uppercase tracking-wide">
                  Urgent
                </span>
              )}
              <StatusBadge status={request.status} />
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-ink tracking-tight mt-1 line-clamp-2">
            {request.title}
          </h3>

          {/* Metadata Row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] font-semibold text-ink-soft/90">
            <span className="inline-flex items-center gap-1 bg-surface-raised/50 px-1.5 py-0.5 rounded-md border border-border/20">
              <MapPin className="size-3 text-primary/80" strokeWidth={1.8} />
              {request.location}
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-raised/50 px-1.5 py-0.5 rounded-md border border-border/20">
              <Clock className="size-3 text-secondary/80" strokeWidth={1.8} />
              {formatRelativeTime(request.createdAt)}
            </span>
            {request.estimatedDuration ? (
              <span className="inline-flex items-center gap-1 bg-surface-raised/50 px-1.5 py-0.5 rounded-md border border-border/20">
                <Timer className="size-3 text-ink-soft/80" strokeWidth={1.8} />
                {request.estimatedDuration}
              </span>
            ) : null}
          </div>

          {/* Description */}
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-ink-soft font-medium">
            {request.description}
          </p>
        </div>

        {/* Footer: User Details */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <UserAvatar name={request.helpee.name} className="size-6 text-[10px]" />
            <span className="text-xs font-semibold text-ink">{request.helpee.name}</span>
          </div>
          {hasHelper && request.helper ? (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded border",
              isCompleted 
                ? "bg-success/5 text-success border-success/15" 
                : "bg-info/5 text-info border-info/15"
            )}>
              {isCompleted ? "Completed by " : "Claimed by "}{request.helper.name}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
