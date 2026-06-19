"use client"

import { Suspense, useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Plus,
  Search,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { StockImage } from "@/components/stock-image"
import { CategoryChips } from "@/components/category-chips"
import { FeedHero } from "@/components/feed-hero"
import { FeedStatusTabs, type StatusFilter } from "@/components/feed-status-tabs"
import { RequestCard } from "@/components/request-card"
import { HelperProfileCard } from "@/components/helper-profile-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { StatusBadge } from "@/components/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"
import { DEMO_HELPEE, DEMO_HELPER } from "@/lib/mock-data"
import type { CategoryKey } from "@/lib/categories"
import { STOCK_IMAGES } from "@/lib/images"
import { cn } from "@/lib/utils"
import { formatPrice, formatPriceRange } from "@/lib/format"
import { UserAvatar } from "@/components/user-avatar"

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedPageContent />
    </Suspense>
  )
}

function FeedPageContent() {
  const searchParams = useSearchParams()
  const {
    requests,
    role,
    user,
    activeTab,
    categoryFilter,
    searchQuery,
    setCategoryFilter,
    setActiveTab,
  } = useApp()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open")
  const [isLoading, setIsLoading] = useState(false)
  const [prevFilters, setPrevFilters] = useState({
    activeTab,
    categoryFilter,
    searchQuery,
    statusFilter,
  })

  const isMine = searchParams.get("mine") === "1"

  // Render phase state adjustment to avoid setting state in effect synchronously
  if (
    activeTab !== prevFilters.activeTab ||
    categoryFilter !== prevFilters.categoryFilter ||
    searchQuery !== prevFilters.searchQuery ||
    statusFilter !== prevFilters.statusFilter
  ) {
    setPrevFilters({ activeTab, categoryFilter, searchQuery, statusFilter })
    setIsLoading(true)
  }

  // Handle async loading timeout
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // 1. Browse Feed Requests
  const filteredRequests = useMemo(() => {
    let result = [...requests]

    if (isMine) {
      const mineName = user?.name ?? DEMO_HELPEE.name
      result = result.filter((r) => r.helpee.name === mineName)
    }

    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter)
    }

    if (statusFilter === "open") {
      result = result.filter((r) => r.status === "open")
    } else if (statusFilter === "claimed") {
      result = result.filter((r) => r.status === "claimed")
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query),
      )
    }

    return result
  }, [requests, categoryFilter, statusFilter, isMine, user?.name, searchQuery])

  // 2. Inbox Chats
  const inboxChats = useMemo(() => {
    const activeChats = requests.filter((r) => r.status !== "open")
    
    // If no active chats, provide mock fallback chats for premium look
    if (activeChats.length === 0) {
      return role === "helpee"
        ? [
            {
              id: "chat-mock-1",
              title: "Buy lunch from FEB canteen",
              otherUser: { name: "Raka", rating: 4.9, email: "raka@gmail.com" },
              lastMessage: "How about we agree on Rp 25.000? Sounds good.",
              time: "2 mins ago",
              status: "claimed" as const,
              realId: null,
            },
            {
              id: "chat-mock-2",
              title: "Deliver package to Jatinangor dorm",
              otherUser: { name: "Sinta", rating: 4.7, email: "sinta@gmail.com" },
              lastMessage: "Favors finished! Pick up at Block C lobby table.",
              time: "1 hour ago",
              status: "executed" as const,
              realId: null,
            },
          ]
        : [
            {
              id: "chat-mock-1",
              title: "Buy lunch from FEB canteen",
              otherUser: { name: "Dimas", rating: 4.6, email: "dimas@gmail.com" },
              lastMessage: "How about we agree on Rp 25.000? Sounds good.",
              time: "2 mins ago",
              status: "claimed" as const,
              realId: null,
            },
            {
              id: "chat-mock-2",
              title: "Deliver package to Jatinangor dorm",
              otherUser: { name: "Sinta", rating: 4.7, email: "sinta@gmail.com" },
              lastMessage: "Favors finished! Pick up at Block C lobby table.",
              time: "1 hour ago",
              status: "executed" as const,
              realId: null,
            },
          ]
    }

    return activeChats.map((r) => {
      const otherUser = role === "helpee" ? (r.helper ?? DEMO_HELPER) : r.helpee
      const lastMsgObj = r.chatHistory?.[r.chatHistory.length - 1]
      const lastMessage = lastMsgObj ? lastMsgObj.text : "No messages yet."
      const time = lastMsgObj
        ? new Date(lastMsgObj.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Just now"

      return {
        id: r.id,
        title: r.title,
        otherUser,
        lastMessage,
        time,
        status: r.status,
        realId: r.id,
      }
    })
  }, [requests, role])

  // 3. Schedules
  const scheduleItems = useMemo(() => {
    // Show user's active/claimed/completed tasks
    return requests.filter(
      (r) =>
        r.status !== "open" &&
        (r.helpee.name === user?.name || r.helper?.name === user?.name || r.id === "1" || r.id === "2"),
    )
  }, [requests, user?.name])

  // 4. Community Directory
  const directoryUsers = useMemo(() => {
    return [
      {
        name: "Raka",
        email: "raka@gmail.com",
        rating: 4.9,
        ratingsCount: 132,
        tasksCompleted: 214,
        onTimeRate: 98,
      },
      {
        name: "Alya",
        email: "alya@gmail.com",
        rating: 4.8,
        ratingsCount: 10,
        tasksCompleted: 15,
        onTimeRate: 97,
      },
      {
        name: "Dimas",
        email: "dimas@gmail.com",
        rating: 4.6,
        ratingsCount: 14,
        tasksCompleted: 20,
        onTimeRate: 95,
      },
      {
        name: "Sinta",
        email: "sinta@gmail.com",
        rating: 4.7,
        ratingsCount: 9,
        tasksCompleted: 8,
        onTimeRate: 99,
      },
      {
        name: "Bima",
        email: "bima@gmail.com",
        rating: 4.5,
        ratingsCount: 22,
        tasksCompleted: 18,
        onTimeRate: 92,
      },
    ]
  }, [])

  const openCount = requests.filter((r) => r.status === "open").length

  return (
    <AppLayout>
      {/* ── Subview 1: Browse Feed ── */}
      {activeTab === "browse" && (
        <div className="space-y-5 animate-page-enter">
          <FeedHero openCount={openCount} />
          
          <CategoryChips
            requests={requests}
            value={categoryFilter as CategoryKey}
            onChange={setCategoryFilter}
          />
          
          <FeedStatusTabs
            requests={requests}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          {isLoading ? (
            <LoadingSkeleton variant="feed" count={6} />
          ) : filteredRequests.length === 0 ? (
            <div className="mx-auto flex max-w-md w-full flex-col items-center rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center shadow-e1">
              <div className="relative mb-3">
                <div className="absolute -inset-6 rounded-full bg-gradient-radial from-primary/8 to-transparent" />
                {role === "helper" ? (
                  <div className="relative flex size-28 items-center justify-center">
                    <div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-surface shadow-e2 animate-float">
                      <Search className="size-8 text-ink-soft" strokeWidth={1.5} />
                    </div>
                  </div>
                ) : (
                  <div className="relative size-28 animate-float">
                    <div className="absolute inset-0 rotate-6 rounded-2xl bg-muted/60 border border-border/60 shadow-sm" />
                    <div className="absolute inset-0 -rotate-3 rounded-2xl bg-surface-raised border border-border/80 shadow-sm" />
                    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-e2">
                      <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <StockImage image={STOCK_IMAGES.generalTask} fill className="rounded-xl" sizes="104px" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <h2 className="mt-6 text-lg font-bold text-ink">
                {role === "helper" ? "No tasks match your filters" : "No tasks here yet"}
              </h2>
              <p className="mt-2.5 max-w-xs text-sm text-ink-soft leading-relaxed">
                {role === "helper"
                  ? "Check back soon or adjust the category and status filters above to find tasks."
                  : "When someone near you needs a hand, their request shows up here in real time."}
              </p>
              {role === "helpee" ? (
                <Link
                  href="/post"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 cursor-pointer shadow-e2 hover:shadow-e3 transition-shadow duration-200 ring-2 ring-primary/20",
                  )}
                >
                  Post the first task
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((request, i) => (
                <RequestCard key={request.id} request={request} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Subview 2: Inbox ── */}
      {activeTab === "inbox" && (
        <div className="space-y-4 animate-page-enter">
          <div>
            <h1 className="text-xl font-bold text-ink">Inbox Messages</h1>
            <p className="text-xs text-ink-soft mt-0.5">Coordinate favor details and negotiate price agreements here.</p>
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="list" count={4} />
          ) : (
            <div className="space-y-2 max-w-2xl">
              {inboxChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={chat.realId ? `/requests/${chat.realId}` : "/feed"}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-surface-raised cursor-pointer shadow-sm hover:shadow-e1 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <UserAvatar name={chat.otherUser.name} className="size-10 border border-primary/10 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">{chat.otherUser.name}</span>
                        <div className="flex items-center gap-0.5 rounded-full bg-success/15 px-1.5 py-0.5 text-[8px] font-semibold text-success">
                          ★ {(chat.otherUser.rating ?? 4.8).toFixed(1)}
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold text-ink-soft truncate mt-0.5 leading-none">
                        {chat.title}
                      </p>
                      <p className="text-[11px] text-ink-soft/80 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[9px] text-ink-soft block">{chat.time}</span>
                    <span className="mt-1 inline-block">
                      <StatusBadge status={chat.status} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Subview 3: Schedule ── */}
      {activeTab === "schedule" && (
        <div className="space-y-4 animate-page-enter">
          <div>
            <h1 className="text-xl font-bold text-ink">Schedule & Tasks</h1>
            <p className="text-xs text-ink-soft mt-0.5">Keep track of ongoing favors, task deadlines, and execution statuses.</p>
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="list" count={4} />
          ) : scheduleItems.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl bg-card p-12 text-center max-w-lg">
              <span className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                <Calendar className="size-6" />
              </span>
              <h3 className="text-sm font-bold text-ink">No active schedules</h3>
              <p className="text-xs text-ink-soft mt-1 max-w-xs mx-auto leading-relaxed">
                You have no pending deadlines or active tasks. Browse the home feed to find local favors.
              </p>
              <Button onClick={() => setActiveTab("browse")} className="mt-4 h-9 text-xs font-bold gap-1 cursor-pointer">
                Find Favors
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {scheduleItems.map((item) => {
                const isHelpee = item.helpee.name === user?.name
                const partnerName = isHelpee ? (item.helper?.name ?? "Assigning...") : item.helpee.name
                
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-e1 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted-foreground/15 text-ink uppercase tracking-wider">
                          {isHelpee ? "Posted by me" : "Claimed by me"}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                      <p className="text-[11px] text-ink-soft flex items-center gap-1.5">
                        <Clock className="size-3" />
                        Deadline: {item.deadline ?? "ASAP"} · Partner: {partnerName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0 shrink-0">
                      <div>
                        <span className="text-[9px] text-ink-soft block uppercase font-bold tracking-wider">Agreed Price</span>
                        <span className="text-sm font-extrabold text-ink block mt-0.5 tabular-nums">
                          {item.agreedPrice ? formatPrice(item.agreedPrice) : formatPriceRange(item.priceMin, item.priceMax)}
                        </span>
                      </div>
                      <Link
                        href={`/requests/${item.id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-8 text-[11px] font-bold gap-1 px-3 border-border hover:bg-muted text-ink cursor-pointer",
                        )}
                      >
                        Detail
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Subview 4: Community Directory (Helpers) ── */}
      {activeTab === "helpers" && (
        <div className="space-y-5 animate-page-enter">
          <div>
            <h1 className="text-xl font-bold text-ink">Community Directory</h1>
            <p className="text-xs text-ink-soft mt-0.5 font-medium">Browse verified helpers, view their skills, and check ratings.</p>
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="feed" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {directoryUsers.map((helper) => (
                <div key={helper.name} className="relative">
                  <HelperProfileCard helper={helper} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) on mobile for Helpees */}
      {role === "helpee" && activeTab === "browse" && (
        <div className="pointer-events-none fixed bottom-20 md:bottom-8 right-6 z-20">
          <Link
            href="/post"
            className={cn(
              buttonVariants({ size: "lg" }),
              "pointer-events-auto h-12 cursor-pointer shadow-e3 border-none flex items-center gap-1 bg-primary text-white",
            )}
          >
            <Plus className="size-5" strokeWidth={2} />
            Post
          </Link>
        </div>
      )}
    </AppLayout>
  )
}
