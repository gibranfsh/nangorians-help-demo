"use client"

import { FILTER_CATEGORIES, getCategoryConfig, type CategoryKey } from "@/lib/categories"
import type { HelpRequest } from "@/lib/types"
import { cn } from "@/lib/utils"

type CategoryChipsProps = {
  requests: HelpRequest[]
  value: CategoryKey
  onChange: (value: CategoryKey) => void
}

export function CategoryChips({ requests, value, onChange }: CategoryChipsProps) {
  const counts = FILTER_CATEGORIES.reduce(
    (acc, key) => {
      if (key === "all") {
        acc[key] = requests.length
      } else {
        acc[key] = requests.filter((r) => r.category === key).length
      }
      return acc
    },
    {} as Record<CategoryKey, number>,
  )

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      style={{ overscrollBehaviorX: "contain" }}
    >
      {FILTER_CATEGORIES.map((key) => {
        const config = key === "all"
          ? {
              label: "All",
              icon: getCategoryConfig("General").icon,
              chipActiveClass: "bg-primary/10 text-primary border-primary/20",
            }
          : getCategoryConfig(key)

        const Icon = config.icon
        const isActive = value === key

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
              "transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45",
              isActive
                ? `${config.chipActiveClass} shadow-sm font-semibold`
                : "border-border bg-card text-ink-soft hover:bg-muted hover:text-ink",
            )}
          >
            <Icon className="size-3.5 text-current" strokeWidth={1.75} />
            {config.label}
            <span className={cn("tabular-nums text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5", isActive ? "opacity-90" : "opacity-60")}>
              {counts[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
