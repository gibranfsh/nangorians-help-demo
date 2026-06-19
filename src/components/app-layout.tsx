"use client"

import { Suspense } from "react"

import { AppFooter } from "@/components/app-footer"
import { AppNavbar } from "@/components/app-navbar"
import { AppSidebar } from "@/components/app-sidebar"
import { ProfileModal } from "@/components/profile-modal"
import { AppShell } from "@/components/app-shell"
import { AuthGuard } from "@/components/auth-guard"
import { BottomNav } from "@/components/bottom-nav"
import { PageTransition } from "@/components/page-transition"
import { PageContainer } from "@/components/page-container"
import { cn } from "@/lib/utils"

type AppLayoutProps = {
  children: React.ReactNode
  showBottomNav?: boolean
}

function BottomNavFallback() {
  return null
}

export function AppLayout({
  children,
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>
        <Suspense fallback={null}>
          <AppNavbar />
        </Suspense>
        <PageTransition>
          <div className="flex-1 min-h-[calc(100vh-4rem-12rem)] py-6">
            <PageContainer className="lg:flex lg:gap-8 items-start">
              <AppSidebar className="hidden lg:block" />
              <main
                className={cn(
                  "flex-1 min-w-0",
                  showBottomNav &&
                    "pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0",
                )}
              >
                {children}
              </main>
            </PageContainer>
          </div>
        </PageTransition>
        <AppFooter />
        <ProfileModal />
        {showBottomNav ? (
          <Suspense fallback={<BottomNavFallback />}>
            <BottomNav />
          </Suspense>
        ) : null}
      </AppShell>
    </AuthGuard>
  )
}
