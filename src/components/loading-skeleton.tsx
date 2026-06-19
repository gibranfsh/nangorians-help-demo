"use client"

import { cn } from "@/lib/utils"

type LoadingSkeletonProps = {
  variant?: "feed" | "list"
  count?: number
  className?: string
}

export function LoadingSkeleton({
  variant = "feed",
  count = 3,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count })

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm animate-pulse"
          >
            <div className="size-8 rounded-full bg-muted-foreground/15" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-1/3 rounded bg-muted-foreground/15" />
              <div className="h-2.5 w-1/2 rounded bg-muted-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-border bg-card shadow-e2 overflow-hidden animate-pulse flex flex-col h-[320px]"
        >
          {/* Banner placeholder */}
          <div className="relative aspect-video w-full bg-muted-foreground/10" />
          
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Category & Badge */}
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 rounded-full bg-muted-foreground/15" />
                <div className="h-5 w-24 rounded bg-muted-foreground/15" />
              </div>
              
              {/* Title */}
              <div className="h-5 w-4/5 rounded bg-muted-foreground/15" />
              
              {/* Metadata */}
              <div className="flex gap-2">
                <div className="h-3 w-16 rounded bg-muted-foreground/10" />
                <div className="h-3 w-16 rounded bg-muted-foreground/10" />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded bg-muted-foreground/10" />
                <div className="h-3.5 w-5/6 rounded bg-muted-foreground/10" />
              </div>
            </div>

            {/* User footer */}
            <div className="flex items-center gap-2 border-t border-border/40 pt-3">
              <div className="size-6 rounded-full bg-muted-foreground/15" />
              <div className="h-3.5 w-16 rounded bg-muted-foreground/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
