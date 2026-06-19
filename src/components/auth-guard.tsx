"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useApp } from "@/hooks/use-app"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useApp()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return children
}
