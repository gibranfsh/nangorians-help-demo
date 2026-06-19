"use client"

import { useState } from "react"
import { X, ShieldCheck, CreditCard, LogOut, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { RatingStars } from "@/components/rating-stars"
import { FeedbackAlert } from "@/components/feedback-alert"
import { useAppContext } from "@/context/app-context"
import { formatPrice } from "@/lib/format"
import { DEMO_HELPEE } from "@/lib/mock-data"
import { appToast } from "@/lib/toast"

export function ProfileModal() {
  const { 
    user, 
    role, 
    setRole, 
    showProfileModal, 
    setShowProfileModal, 
    logout
  } = useAppContext()

  const [topUpError, setTopUpError] = useState(false)
  const [isToppingUp, setIsToppingUp] = useState(false)

  if (!showProfileModal || !user) return null

  // Helper stats (Raka values or mock defaults)
  const helperRating = user.name === DEMO_HELPEE.name ? 4.9 : user.rating ?? 4.9
  const helperCount = user.name === DEMO_HELPEE.name ? 214 : user.tasksCompleted ?? 214
  const helperOnTime = user.name === DEMO_HELPEE.name ? 98 : user.onTimeRate ?? 98

  // Helpee stats (Alya values or mock defaults)
  const helpeeRating = user.name === DEMO_HELPEE.name ? user.rating ?? 4.8 : 4.8
  const helpeeCount = user.name === DEMO_HELPEE.name ? user.tasksCompleted ?? 15 : 15
  const helpeeOnTime = user.name === DEMO_HELPEE.name ? user.onTimeRate ?? 97 : 97

  const handleRoleToggle = () => {
    const nextRole = role === "helpee" ? "helper" : "helpee"
    setRole(nextRole)
    appToast.roleSwitched(nextRole)
  }

  const handleTopUp = () => {
    setIsToppingUp(true)
    setTopUpError(false)

    setTimeout(() => {
      setIsToppingUp(false)
      setTopUpError(true) // Triggers the "Payment failed" feedback alert from the design system!
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4 animate-page-enter">
      {/* Modal Container */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-e4">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setShowProfileModal(false)
            setTopUpError(false)
          }}
          className="absolute top-4 right-4 text-ink-soft hover:text-ink cursor-pointer p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-2 mt-2">
          <UserAvatar name={user.name} className="size-16 border-2 border-primary/20" />
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-lg font-bold text-ink">{user.name}</h3>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success border border-success/10">
                <ShieldCheck className="size-2.5" />
                Verified Member
              </span>
            </div>
            <p className="text-xs text-ink-soft">{user.email}</p>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="mt-5 bg-surface-raised border border-border/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Nangorians Wallet</span>
              <span className="text-xl font-bold text-ink tabular-nums mt-0.5 block">
                {formatPrice(user.walletBalance ?? 150000)}
              </span>
            </div>
            <Button
              onClick={handleTopUp}
              disabled={isToppingUp}
              className="h-8 text-[11px] font-bold px-3 cursor-pointer bg-primary text-white border-none flex items-center gap-1"
            >
              {isToppingUp ? (
                <RefreshCw className="size-3 animate-spin" />
              ) : (
                <CreditCard className="size-3" />
              )}
              Top Up
            </Button>
          </div>

          {/* Simulated Error Banner from Feedback Screen */}
          {topUpError && (
            <FeedbackAlert
              variant="error"
              description="Payment failed: We couldn't charge your card. Update payment details to proceed."
            />
          )}
        </div>

        {/* Dual Reputation Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
          
          {/* As Helper */}
          <div className="space-y-1.5 border-r border-border/60 pr-2">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">As Helper</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-ink">{helperRating}</span>
              <RatingStars rating={helperRating} className="scale-75 origin-left" />
            </div>
            <div className="text-[10px] text-ink-soft space-y-0.5">
              <p>{helperCount} completed favors</p>
              <p className="text-success font-medium">{helperOnTime}% on-time rate</p>
            </div>
          </div>

          {/* As Helpee */}
          <div className="space-y-1.5 pl-2">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">As Helpee</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-ink">{helpeeRating}</span>
              <RatingStars rating={helpeeRating} className="scale-75 origin-left" />
            </div>
            <div className="text-[10px] text-ink-soft space-y-0.5">
              <p>{helpeeCount} posted favors</p>
              <p className="text-primary font-medium">{helpeeOnTime}% fill rate</p>
            </div>
          </div>
        </div>

        {/* Interactive Mode Switcher */}
        <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink block">Active Mode</span>
            <span className="text-[10px] text-ink-soft block">Switch browse and post features</span>
          </div>
          <button
            type="button"
            onClick={handleRoleToggle}
            className="flex items-center gap-1 rounded-full bg-muted border border-border p-0.5 cursor-pointer"
          >
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              role === "helpee" 
                ? "bg-primary text-white shadow-sm" 
                : "text-ink-soft hover:text-ink"
            }`}>
              Helpee
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              role === "helper" 
                ? "bg-secondary text-white shadow-sm" 
                : "text-ink-soft hover:text-ink"
            }`}>
              Helper
            </span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between border-t border-border/60 pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowProfileModal(false)
              setTopUpError(false)
              logout()
            }}
            className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="size-3.5" />
            Log Out
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowProfileModal(false)
              setTopUpError(false)
            }}
            className="h-8 text-xs font-bold cursor-pointer border-border hover:bg-muted text-ink"
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  )
}
