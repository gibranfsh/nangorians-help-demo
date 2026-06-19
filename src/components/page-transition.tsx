"use client"

import { useApp } from "@/hooks/use-app"
import { cn } from "@/lib/utils"

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { role } = useApp()
  return (
    <div key={role} className={cn("page-enter", className)}>
      {children}
    </div>
  )
}
