"use client"

import { ThemeProvider } from "next-themes"

import { AppToaster } from "@/components/app-toaster"
import { AppProvider } from "@/context/app-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppProvider>
        {children}
        <AppToaster />
      </AppProvider>
    </ThemeProvider>
  )
}
