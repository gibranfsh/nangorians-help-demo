"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ClipboardList, LayoutGrid, Plus } from "lucide-react"

import { useApp } from "@/hooks/use-app"
import { appToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type TabItem = {
  label: string
  href: string
  icon: typeof LayoutGrid
  active: boolean
  onClick?: () => void
}

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { role } = useApp()

  const isMine = searchParams.get("mine") === "1"

  const handlePostClick = () => {
    if (role === "helper") {
      appToast.helpeeOnlyPost()
      return
    }
    router.push("/post")
  }

  const tabs: TabItem[] = [
    {
      label: "Browse",
      href: "/feed",
      icon: LayoutGrid,
      active:
        (pathname === "/feed" && !isMine) ||
        pathname.startsWith("/requests/"),
    },
    {
      label: "Post",
      href: "/post",
      icon: Plus,
      active: pathname === "/post",
      onClick: handlePostClick,
    },
    {
      label: "Tasks",
      href: "/feed?mine=1",
      icon: ClipboardList,
      active: pathname === "/feed" && isMine,
    },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-border bg-card shadow-e2 md:hidden">
      <div
        className="flex h-16 w-full items-center justify-around safe-bottom"
        style={{ touchAction: "manipulation" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const content = (
            <>
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg transition-colors duration-200",
                  tab.active && "bg-primary/10",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    tab.active ? "text-primary" : "text-ink-soft",
                  )}
                  strokeWidth={1.75}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  tab.active ? "text-primary" : "text-ink-soft",
                )}
              >
                {tab.label}
              </span>
            </>
          )

          if (tab.onClick) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.onClick}
                className="flex cursor-pointer flex-col items-center gap-0.5 px-4 py-1"
              >
                {content}
              </button>
            )
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex cursor-pointer flex-col items-center gap-0.5 px-4 py-1"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
