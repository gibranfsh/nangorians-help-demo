"use client"

import { Clock, MapPin, Timer } from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import { StockImage } from "@/components/stock-image"
import { UserAvatar } from "@/components/user-avatar"
import { getCategoryConfig } from "@/lib/categories"
import { getCategoryImage } from "@/lib/images"
import { formatPriceRange } from "@/lib/format"
import { useApp } from "@/hooks/use-app"
import { cn } from "@/lib/utils"

type TaskPreviewCardProps = {
  title: string
  description: string
  category: string
  priceMin: number
  priceMax: number
  location: string
  estimatedDuration?: string
  urgent?: boolean
  photoUrl?: string
  deadline?: string
  className?: string
}

export function TaskPreviewCard({
  title,
  description,
  category,
  priceMin,
  priceMax,
  location,
  estimatedDuration,
  urgent = false,
  photoUrl,
  deadline,
  className,
}: TaskPreviewCardProps) {
  const { user } = useApp()
  const config = getCategoryConfig(category)
  const categoryImage = getCategoryImage(category)
  const Icon = config.icon
  const hasContent = title.trim() || description.trim()

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-primary/30 bg-surface-raised/50 p-4 transition-all duration-300",
        hasContent && "ring-2 ring-primary/10",
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold text-ink-soft uppercase tracking-wider pl-1">Live Card Preview</p>
      
      {/* Feed Card representation */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-e2 transition-all duration-200">
        
        {/* Banner image or uploaded photo */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoUrl}
              alt="Uploaded task preview"
              className="h-full w-full object-cover transition-transform duration-500"
            />
          ) : (
            <StockImage
              image={categoryImage}
              fill
              className="rounded-none object-cover"
              sizes="100%"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
          {/* Category accent bar */}
          <div className={cn("absolute top-0 left-0 h-full w-1", config.accentClass)} />
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-ink">
                <Icon className="size-3" strokeWidth={1.75} />
                {category}
              </span>
              {urgent ? (
                <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                  Urgent
                </span>
              ) : null}
            </div>
            
            <div className="flex flex-col items-end gap-1.5">
              <span className="tabular-nums rounded-lg bg-surface-raised px-2.5 py-1 text-xs font-semibold text-ink">
                {priceMin > 0 && priceMax > 0 
                  ? formatPriceRange(priceMin, priceMax)
                  : "Rp 0"
                }
              </span>
              <StatusBadge status="open" />
            </div>
          </div>

          <h3 className={cn(
            "text-xl font-semibold leading-7",
            title.trim() ? "text-ink" : "text-ink-soft/50 italic"
          )}>
            {title || "Your task title"}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" strokeWidth={1.75} />
              {location || "Location not set"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" strokeWidth={1.75} />
              Posted just now
            </span>
            {estimatedDuration ? (
              <span className="inline-flex items-center gap-1">
                <Timer className="size-3.5" strokeWidth={1.75} />
                {estimatedDuration}
              </span>
            ) : null}
            {deadline ? (
              <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                Deadline: {deadline}
              </span>
            ) : null}
          </div>

          <p className={cn(
            "mt-3 line-clamp-2 text-sm leading-relaxed",
            description.trim() ? "text-ink-soft" : "text-ink-soft/40 italic"
          )}>
            {description || "Task details will appear here. Explain clearly so helpers understand what to do."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-3">
            <div className="flex items-center gap-2">
              <UserAvatar name={user?.name || "Alya"} />
              <span className="text-sm font-medium text-ink">{user?.name || "Alya"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
