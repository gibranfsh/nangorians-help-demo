"use client"

import { MessageSquare, User, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { RatingStars } from "@/components/rating-stars"
import type { User as UserType } from "@/lib/types"
import { cn } from "@/lib/utils"

type HelperProfileCardProps = {
  helper: UserType
  className?: string
  onMessageClick?: () => void
}

export function HelperProfileCard({ helper, className, onMessageClick }: HelperProfileCardProps) {
  const rating = helper.rating ?? 4.9
  const tasksCompleted = helper.tasksCompleted ?? 214
  const onTimeRate = helper.onTimeRate ?? 98

  const handleViewProfile = () => {
    toast.info(`Viewing ${helper.name}'s Profile`, {
      description: `ID verified. Member since Sept 2025. ${tasksCompleted} tasks completed.`,
    })
  }

  const handleScrollToChat = () => {
    if (onMessageClick) {
      onMessageClick()
      // Focus the input field after transition completes (350ms)
      setTimeout(() => {
        const chatInput = document.querySelector("input[placeholder*='Type message']")
        if (chatInput instanceof HTMLInputElement) {
          chatInput.focus()
        }
      }, 350)
    } else {
      // Find the chat container and scroll it into view
      const chatInput = document.querySelector("input[placeholder*='Type message']")
      if (chatInput) {
        chatInput.scrollIntoView({ behavior: "smooth" })
        if (chatInput instanceof HTMLInputElement) {
          chatInput.focus()
        }
      }
    }
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-e2 space-y-4", className)}>
      <p className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Helper Profile</p>
      
      <div className="flex items-start gap-4">
        <UserAvatar name={helper.name} className="size-12 shrink-0 border border-primary/10" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="text-sm font-bold text-ink leading-tight">{helper.name}</h4>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success border border-success/10">
              <ShieldCheck className="size-2.5" />
              Verified member
            </span>
          </div>
          <p className="text-[11px] text-ink-soft leading-normal">
            FEB Unpad · Lives in Nangor · Helps with food runs, tutoring
          </p>
        </div>
      </div>

      {/* Ratings & Metrics */}
      <div className="grid grid-cols-3 gap-2 border-y border-border/60 py-3 text-center">
        <div>
          <span className="text-[10px] font-bold text-ink-soft block uppercase tracking-wider">Rating</span>
          <div className="flex flex-col items-center mt-1">
            <span className="text-xs font-bold text-ink leading-none">{rating}</span>
            <RatingStars rating={rating} className="mt-0.5 scale-90" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-ink-soft block uppercase tracking-wider">Completed</span>
          <span className="text-xs font-bold text-ink block mt-1">{tasksCompleted} favors</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-ink-soft block uppercase tracking-wider">On-Time</span>
          <span className="text-xs font-bold text-success block mt-1">{onTimeRate}% rate</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={handleScrollToChat}
          className="flex-1 h-9 text-xs font-bold gap-1 cursor-pointer bg-primary text-white border-none"
        >
          <MessageSquare className="size-3.5" />
          Message
        </Button>
        <Button 
          variant="outline" 
          onClick={handleViewProfile}
          className="flex-1 h-9 text-xs font-bold gap-1 cursor-pointer border-border hover:bg-muted text-ink"
        >
          <User className="size-3.5" />
          View Profile
        </Button>
      </div>
    </div>
  )
}
