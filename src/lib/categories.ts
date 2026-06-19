import {
  BookOpen,
  LayoutGrid,
  Package,
  Utensils,
  type LucideIcon,
} from "lucide-react"

import type { StockImageKey } from "@/lib/images"

export type CategoryKey = "all" | "Food run" | "Tutoring" | "Moving" | "General"

export type CategoryConfig = {
  label: string
  icon: LucideIcon
  accentClass: string
  chipActiveClass: string
  imageKey: StockImageKey
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "Food run": {
    label: "Food run",
    icon: Utensils,
    accentClass: "bg-secondary",
    chipActiveClass: "bg-secondary/10 text-secondary border-secondary/20",
    imageKey: "foodRun",
  },
  Tutoring: {
    label: "Tutoring",
    icon: BookOpen,
    accentClass: "bg-primary",
    chipActiveClass: "bg-primary/10 text-primary border-primary/20",
    imageKey: "tutoring",
  },
  Moving: {
    label: "Moving",
    icon: Package,
    accentClass: "bg-info",
    chipActiveClass: "bg-info/10 text-info border-info/20",
    imageKey: "moving",
  },
  General: {
    label: "General",
    icon: LayoutGrid,
    accentClass: "bg-muted-foreground",
    chipActiveClass: "bg-muted text-ink border-border",
    imageKey: "generalTask",
  },
}

export const FILTER_CATEGORIES: CategoryKey[] = [
  "all",
  "Food run",
  "Tutoring",
  "Moving",
]

export const POST_CATEGORIES = ["Food run", "Tutoring", "Moving", "General"] as const

export function getCategoryConfig(category: string): CategoryConfig {
  return (
    CATEGORY_CONFIG[category] ?? {
      label: category,
      icon: LayoutGrid,
      accentClass: "bg-primary",
      chipActiveClass: "bg-primary/10 text-primary border-primary/20",
      imageKey: "generalTask",
    }
  )
}
