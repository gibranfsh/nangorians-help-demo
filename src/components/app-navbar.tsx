"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  HandHelping,
  Plus,
  Search,
  Bell,
  Menu,
  ChevronsLeft,
  Home,
  MessageSquare,
  Calendar,
  Users,
  Utensils,
  BookOpen,
  Truck,
  Wrench,
} from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/user-avatar"
import { useApp } from "@/hooks/use-app"
import { appToast } from "@/lib/toast"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const WORKSPACE_ITEMS = [
  { id: "browse" as const, label: "Home", icon: Home },
  { id: "inbox" as const, label: "Inbox", icon: MessageSquare, badge: 4 },
  { id: "schedule" as const, label: "Schedule", icon: Calendar, badge: 2 },
  { id: "helpers" as const, label: "Directory", icon: Users },
]

const CATEGORY_ITEMS = [
  { label: "Food runs", category: "Food run", icon: Utensils },
  { label: "Tutoring", category: "Tutoring", icon: BookOpen },
  { label: "Moving", category: "Moving", icon: Truck },
  { label: "Tech help", category: "General", icon: Wrench },
]

export function AppNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    user,
    role,
    setRole,
    isAuthenticated,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    setShowProfileModal,
    showProfileModal,
  } = useApp()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleRoleChange = (value: string) => {
    const nextRole = value as Role
    if (nextRole === role) return
    setRole(nextRole)
    appToast.roleSwitched(nextRole)
  }

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

  if (!isAuthenticated) return null

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur-sm transition-shadow duration-200",
          scrolled ? "shadow-e2" : "shadow-e1",
        )}
      >
      <PageContainer className="flex h-16 items-center justify-between gap-3">
        {/* Mobile Burger Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex shrink-0 p-1.5 rounded-xl border border-border/85 hover:bg-muted text-ink-soft hover:text-ink cursor-pointer lg:hidden transition-all duration-300 relative overflow-hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <div className="relative size-5 overflow-hidden">
            <div className={cn(
              "absolute inset-0 transition-all duration-300 flex items-center justify-center",
              mobileMenuOpen ? "-translate-x-full opacity-0 rotate-90" : "translate-x-0 opacity-100 rotate-0"
            )}>
              <Menu className="size-5" />
            </div>
            <div className={cn(
              "absolute inset-0 transition-all duration-300 flex items-center justify-center",
              mobileMenuOpen ? "translate-x-0 opacity-100 rotate-0" : "translate-x-full opacity-0 -rotate-90"
            )}>
              <ChevronsLeft className="size-5" />
            </div>
          </div>
        </button>

        {/* Logo */}
        <Link href="/feed" className="flex shrink-0 cursor-pointer items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg overflow-hidden border border-border bg-card">
            <Image
              src="/images/logo-icon.webp"
              alt="NangoriansHelp Logo"
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
          <span className="font-semibold text-ink">
            Nangorians<span className="text-secondary">Help</span>
          </span>
        </Link>

        {/* Desktop Navbar Search */}
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, helpers..."
            className="w-full pl-9 pr-4 py-1.5 bg-muted/60 hover:bg-muted focus:bg-background border border-border/80 focus:border-primary/40 rounded-xl text-xs font-semibold placeholder-ink-soft/75 focus:ring-1 focus:ring-primary/25 outline-none transition-all"
          />
        </div>

        {/* Desktop Main Navigation Links */}
        <nav className="hidden items-center lg:flex gap-1.5">
          <button
            onClick={() => handleTabClick("browse")}
            className={cn(
              "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === "browse" && pathname === "/feed"
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:text-ink hover:bg-muted/50",
            )}
          >
            Browse
          </button>
          <button
            onClick={() => handleTabClick("inbox")}
            className={cn(
              "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === "inbox" && pathname === "/feed"
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:text-ink hover:bg-muted/50",
            )}
          >
            Inbox
          </button>
          <button
            onClick={() => handleTabClick("schedule")}
            className={cn(
              "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === "schedule" && pathname === "/feed"
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:text-ink hover:bg-muted/50",
            )}
          >
            Schedule
          </button>
          <button
            onClick={() => handleTabClick("helpers")}
            className={cn(
              "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === "helpers" && pathname === "/feed"
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:text-ink hover:bg-muted/50",
            )}
          >
            Directory
          </button>
          <button
            onClick={() => setShowProfileModal(true)}
            className={cn(
              "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              showProfileModal
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:text-ink hover:bg-muted/50",
            )}
          >
            Wallet
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {role === "helpee" ? (
            <Link
              href="/post"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden cursor-pointer lg:inline-flex",
              )}
            >
              <Plus className="size-4" strokeWidth={1.75} />
              Post a task
            </Link>
          ) : null}

          {/* Bell Notifications */}
          <button className="relative p-1.5 rounded-xl border border-border/80 hover:bg-muted text-ink-soft hover:text-ink cursor-pointer transition-colors">
            <Bell className="size-4" strokeWidth={1.75} />
            <span className="absolute top-1 right-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-secondary"></span>
            </span>
          </button>

          {/* Role Tabs - Hidden on mobile/tablet to avoid header crowding */}
          <Tabs value={role} onValueChange={handleRoleChange} className="hidden md:inline-flex">
            <TabsList className="h-8 bg-muted">
              <TabsTrigger value="helpee" className="cursor-pointer px-2.5 text-xs">
                Helpee
              </TabsTrigger>
              <TabsTrigger value="helper" className="cursor-pointer px-2.5 text-xs">
                Helper
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* User Profile Avatar */}
          {user ? (
            <button
              onClick={() => setShowProfileModal(true)}
              className="cursor-pointer hover:opacity-90 active:scale-95 transition-all focus:outline-none"
              aria-label="View Profile"
            >
              <UserAvatar name={user.name} />
            </button>
          ) : null}
        </div>
      </PageContainer>
    </header>

    {/* Mobile Navigation Drawer */}
    {/* Backdrop (z-40) */}
    <div
      className={cn(
        "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden transition-all duration-300 ease-out cursor-pointer",
        mobileMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
      )}
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* Drawer (z-50) */}
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-72 z-50 bg-surface border-r border-border p-5 shadow-e4 flex flex-col space-y-6 lg:hidden transition-all duration-300 ease-out",
        mobileMenuOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
      )}
      onClick={(e) => e.stopPropagation()}
    >
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <Link href="/feed" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex size-8 items-center justify-center rounded-lg overflow-hidden border border-border bg-card">
                  <Image
                    src="/images/logo-icon.webp"
                    alt="NangoriansHelp Logo"
                    width={32}
                    height={32}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-semibold text-xs text-ink">
                  Nangorians<span className="text-secondary">Help</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-muted cursor-pointer transition-colors"
                aria-label="Collapse Navigation Drawer"
              >
                <ChevronsLeft className="size-4" />
              </button>
            </div>

            {/* Mobile Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" strokeWidth={1.75} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2 bg-muted/60 hover:bg-muted rounded-xl text-xs font-semibold placeholder-ink-soft/75 focus:ring-1 focus:ring-primary/25 outline-none transition-all"
              />
            </div>

            {/* Workspace Links */}
            <div className="space-y-2">
              <h3 className="px-3 text-[10px] font-bold text-ink-soft uppercase tracking-wider">Workspace</h3>
              <nav className="space-y-1">
                {WORKSPACE_ITEMS.map((item) => {
                  const isActive = activeTab === item.id && categoryFilter === "all"
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id)
                        setMobileMenuOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/10"
                          : "text-ink-soft hover:text-ink hover:bg-muted/50 border border-transparent",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="size-4" strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Categories */}
            <div className="space-y-2 border-t border-border/60 pt-4">
              <h3 className="px-3 text-[10px] font-bold text-ink-soft uppercase tracking-wider">Categories</h3>
              <nav className="space-y-1">
                {CATEGORY_ITEMS.map((item) => {
                  const isActive = activeTab === "browse" && categoryFilter === item.category
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleCategoryClick(item.category)
                        setMobileMenuOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/10"
                          : "text-ink-soft hover:text-ink hover:bg-muted/50 border border-transparent",
                      )}
                    >
                      <Icon className="size-4" strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Active Mode Switcher & Post Button */}
            <div className="pt-4 border-t border-border/60 mt-auto space-y-3">
              <div className="space-y-1.5">
                <span className="px-3 text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Active Mode</span>
                <div className="flex rounded-xl bg-muted p-1 border border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("helpee")
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      role === "helpee"
                        ? "bg-primary text-white shadow-sm"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    Helpee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("helper")
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      role === "helper"
                        ? "bg-secondary text-white shadow-sm"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    Helper
                  </button>
                </div>
              </div>

              {role === "helpee" && (
                <div className="pt-3 border-t border-border/40">
                  <Link
                    href="/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full flex justify-center items-center gap-2 h-10 text-xs font-bold shadow-md cursor-pointer bg-primary text-white border-none",
                    )}
                  >
                    <Plus className="size-4" strokeWidth={1.75} />
                    Post a task
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )
    }
