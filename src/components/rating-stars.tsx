"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type RatingStarsProps = {
  rating: number
  maxStars?: number
  className?: string
}

export function RatingStars({ rating, maxStars = 5, className }: RatingStarsProps) {
  const stars = Array.from({ length: maxStars })

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars.map((_, i) => {
        // Simple star check (index-based)
        const isFilled = i < Math.round(rating)
        return (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              isFilled 
                ? "text-warning fill-warning" 
                : "text-muted-foreground/30 fill-transparent"
            )}
            strokeWidth={2}
          />
        )
      })}
    </div>
  )
}
