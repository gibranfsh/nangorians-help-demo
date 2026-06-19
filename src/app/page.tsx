"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useApp } from "@/hooks/use-app"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()

  useEffect(() => {
    router.replace(isAuthenticated ? "/feed" : "/login")
  }, [isAuthenticated, router])

  return null
}
