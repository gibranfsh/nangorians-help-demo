"use client"

import { ComponentType } from "react"
import { Home, MessageSquare, Calendar, Users, Utensils, BookOpen, Truck, Wrench } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { useAppContext } from "@/context/app-context"
import { cn } from "@/lib/utils"

type SidebarItem = {
  id: "browse" | "inbox" | "schedule" | "helpers" | "wallet"
  label: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  badge?: number
}

const WORKSPACE_ITEMS: SidebarItem[] = [
  { id: "browse", label: "Home", icon: Home },
  { id: "inbox", label: "Inbox", icon: MessageSquare, badge: 4 },
  { id: "schedule", label: "Schedule", icon: Calendar, badge: 2 },
  { id: "helpers", label: "Directory", icon: Users },
]

const CATEGORY_ITEMS = [
  { label: "Food runs", category: "Food run", icon: Utensils },
  { label: "Tutoring", category: "Tutoring", icon: BookOpen },
  { label: "Moving", category: "Moving", icon: Truck },
  { label: "Tech help", category: "General", icon: Wrench },
]

type AppSidebarProps = {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { 
    activeTab, 
    setActiveTab, 
    categoryFilter, 
    setCategoryFilter, 
    setSearchQuery 
  } = useAppContext()

  const handleTabClick = (tabId: "browse" | "inbox" | "schedule" | "helpers" | "wallet") => {
    if (pathname !== "/feed") {
      router.push("/feed")
    }
    setActiveTab(tabId)
    setCategoryFilter("all")
  }

  const handleCategoryClick = (categoryName: string) => {
    if (pathname !== "/feed") {
      router.push("/feed")
    }
    setActiveTab("browse")
    setCategoryFilter(categoryName)
    setSearchQuery("") // Reset search on category swap
  }

  return (
    <aside className={cn("w-64 shrink-0 bg-card rounded-2xl border border-border p-4 shadow-e1 space-y-6 lg:sticky lg:top-24 h-fit", className)}>
      {/* Workspace Menu */}
      <div className="space-y-1.5">
        <h3 className="px-3 text-[10px] font-bold text-ink-soft uppercase tracking-wider">Workspace</h3>
        <nav className="space-y-1">
          {WORKSPACE_ITEMS.map((item) => {
            const isActive = activeTab === item.id && categoryFilter === "all"
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/10"
                    : "text-ink-soft hover:text-ink hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("size-4 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-ink-soft")} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                    item.id === "inbox"
                      ? "bg-secondary text-white"
                      : "bg-muted-foreground/20 text-ink"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Categories Menu */}
      <div className="space-y-1.5 border-t border-border/60 pt-4">
        <h3 className="px-3 text-[10px] font-bold text-ink-soft uppercase tracking-wider">Categories</h3>
        <nav className="space-y-1">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = activeTab === "browse" && categoryFilter === item.category
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleCategoryClick(item.category)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/10"
                    : "text-ink-soft hover:text-ink hover:bg-muted/50 border border-transparent"
                )}
              >
                <Icon className={cn("size-4 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-ink-soft")} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
