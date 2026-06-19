"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Check, ChevronRight, Timer, Zap, Activity, ClipboardCheck, Calendar } from "lucide-react"
import { toast } from "sonner"

import { AppLayout } from "@/components/app-layout"
import { OfferToHelpButton } from "@/components/offer-to-help-button"
import { StatusBadge } from "@/components/status-badge"
import { StockImage } from "@/components/stock-image"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { getCategoryConfig } from "@/lib/categories"
import { getCategoryImage } from "@/lib/images"
import { useApp } from "@/hooks/use-app"
import { formatPrice, formatPriceRange, formatRelativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { MockChat } from "@/components/mock-chat"
import { FeedbackAlert } from "@/components/feedback-alert"
import { HelperProfileCard } from "@/components/helper-profile-card"

function StatusDashboard({ 
  requestId,
  onActionComplete,
}: { 
  requestId: string 
  onActionComplete?: () => void
}) {
  const { getRequestById, role, agreeTerms, markAsExecuted, verifyAndPay } = useApp()
  const request = getRequestById(requestId)

  const defaultAgreedPrice = request ? Math.round((request.priceMin + request.priceMax) / 2) : 0

  const [prevRequestId, setPrevRequestId] = useState(requestId)
  const [agreedVal, setAgreedVal] = useState<number>(defaultAgreedPrice)
  const [notesText, setNotesText] = useState("")

  if (requestId !== prevRequestId) {
    setPrevRequestId(requestId)
    setAgreedVal(defaultAgreedPrice)
  }

  if (!request) return null

  const handleAgree = () => {
    agreeTerms(request.id, agreedVal)
    toast.success("Terms confirmed!", {
      description: `Task has been moved to 'In progress' with a locked price of ${formatPrice(agreedVal)}.`,
    })
    onActionComplete?.()
  }

  const handleExecute = () => {
    markAsExecuted(request.id, notesText)
    toast.success("Work submitted!", {
      description: "The helpee has been notified to verify the work and release payment.",
    })
    onActionComplete?.()
  }

  const handlePay = () => {
    verifyAndPay(request.id)
    toast.success("Payment released!", {
      description: `Successfully paid ${formatPrice(request.agreedPrice || request.priceMax)} to ${request.helper?.name || "Helper"}.`,
    })
    onActionComplete?.()
  }

  const isHelpee = role === "helpee"
  const isHelper = role === "helper"

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-e2 space-y-4">
      {request.status === "claimed" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Zap className="size-3.5" />
            </span>
            <h3 className="font-bold text-ink text-sm">Step 3: Negotiation & Agreement</h3>
          </div>
          
          {isHelpee ? (
            <div className="space-y-3.5">
              <p className="text-xs text-ink-soft leading-relaxed">
                Helper <span className="font-semibold text-ink">{request.helper?.name}</span> has offered to help. Please finalize the compensation.
              </p>
              
              <div className="space-y-2 bg-surface-raised p-3 rounded-lg border border-border/80">
                <label className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block">Set final agreed price</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={request.priceMin}
                    max={request.priceMax}
                    step={1000}
                    value={agreedVal}
                    onChange={(e) => setAgreedVal(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="tabular-nums font-bold text-sm text-ink shrink-0 min-w-20 text-right">
                    {formatPrice(agreedVal)}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-ink-soft/70">
                  <span>Min: {formatPrice(request.priceMin)}</span>
                  <span>Max: {formatPrice(request.priceMax)}</span>
                </div>
              </div>

              <Button onClick={handleAgree} className="w-full cursor-pointer h-10 text-xs font-bold shadow-md">
                Lock Terms & Start Execution
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2.5">
              <div className="flex justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary animate-pulse">
                  <Activity className="size-5" />
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink">Awaiting Agreement</h4>
              <p className="text-[11px] text-ink-soft max-w-xs mx-auto leading-relaxed">
                Negotiate the final price in the chat. The helpee will lock the price and authorize you to begin.
              </p>
            </div>
          )}
        </div>
      )}

      {request.status === "in_progress" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-info/10 text-info">
              <Activity className="size-3.5" />
            </span>
            <h3 className="font-bold text-ink text-sm">Step 4: Active Execution</h3>
          </div>

          <FeedbackAlert
            variant="warning"
            description="Heads up: Helper is running 10 minutes behind schedule due to rain in Jatinangor. They have sent a message in chat."
          />

          {isHelper ? (
            <div className="space-y-3.5">
              <p className="text-xs text-ink-soft leading-relaxed">
                You are authorized! Once the favor is completed, write a note explaining where the items/deliverables are located.
              </p>

              <div className="space-y-1.5">
                <label htmlFor="notes" className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Completion Notes</label>
                <textarea
                  id="notes"
                  placeholder="e.g. Delivered the food to Jatinangor Dorm lobby table, or formatted all references."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full min-h-20 rounded-xl border border-border p-3 text-xs focus-visible:ring-2 focus-visible:ring-primary/35 outline-none bg-background transition-all"
                />
              </div>

              <Button onClick={handleExecute} className="w-full cursor-pointer h-10 text-xs font-bold shadow-md bg-info hover:bg-info/95 text-white border-none">
                Submit Completed Work
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2.5">
              <div className="flex justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-info/10 text-info animate-bounce">
                  <Timer className="size-5" />
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink">Helper is Executing Task</h4>
              <p className="text-[11px] text-ink-soft max-w-xs mx-auto leading-relaxed">
                Price is locked at <span className="font-bold text-ink">{formatPrice(request.agreedPrice || request.priceMax)}</span>. Coordinate delivery details in the chat.
              </p>
            </div>
          )}
        </div>
      )}

      {request.status === "executed" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="flex size-6 items-center justify-center rounded-full bg-warning/10 text-warning">
              <ClipboardCheck className="size-3.5" />
            </span>
            <h3 className="font-bold text-ink text-sm">Step 5: Verification & Payment</h3>
          </div>

          {isHelpee ? (
            <div className="space-y-3">
              <p className="text-xs text-ink-soft leading-relaxed">
                Helper has submitted their work! Please review the details below.
              </p>

              <div className="bg-surface-raised p-3 rounded-lg border border-border/80 space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Submission Notes:</span>
                  <p className="text-xs text-ink font-medium mt-0.5">
                    &quot;{request.submissionNotes || "Completed successfully."}&quot;
                  </p>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between items-center text-xs">
                  <span className="font-bold text-ink-soft">Agreed price:</span>
                  <span className="font-bold text-success tabular-nums">{formatPrice(request.agreedPrice || request.priceMax)}</span>
                </div>
              </div>

              <Button onClick={handlePay} className="w-full cursor-pointer h-10 text-xs font-bold shadow-md bg-success hover:bg-success/95 text-white border-none">
                Verify Work & Release Payment
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2.5">
              <div className="flex justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-warning/10 text-warning animate-pulse">
                  <Activity className="size-5" />
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink">Awaiting Helpee&apos;s Review</h4>
              <p className="text-[11px] text-ink-soft max-w-xs mx-auto leading-relaxed">
                You&apos;ve completed the task. Helpee is reviewing notes to release funds.
              </p>
            </div>
          )}
        </div>
      )}

      {request.status === "completed" && (
        <div className="p-2 text-center space-y-3.5 animate-page-enter">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-success/20 animate-ping" />
              <span className="relative flex size-12 items-center justify-center rounded-full bg-success text-white">
                <Check className="size-6" strokeWidth={3} />
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-ink animate-float">Task Completed & Paid!</h4>
            <p className="text-xs text-ink-soft max-w-xs mx-auto leading-relaxed">
              Transaction finalized. <span className="font-semibold text-success">{formatPrice(request.agreedPrice || request.priceMax)}</span> was released to the helper.
            </p>
          </div>
          <div className="inline-flex gap-2 items-center rounded-lg bg-success/5 px-3 py-1.5 border border-success/15 text-[10px] font-bold text-success mx-auto">
            Payment Method: Nangorians Wallet
          </div>
        </div>
      )}
    </div>
  )
}

function TaskSummaryCard({
  requestId,
  taskTitle,
  canOffer,
  role,
  onOfferSuccess,
}: {
  requestId: string
  taskTitle: string
  canOffer: boolean
  role: string
  onOfferSuccess?: () => void
}) {
  const { getRequestById } = useApp()
  const request = getRequestById(requestId)

  if (!request) return null

  const status = request.status
  const STEPS = [
    { label: "Task Posted", complete: true, active: false },
    { label: "Helper Assigned", complete: status !== "open", active: status === "open" },
    { label: "Terms Negotiated", complete: status !== "open" && status !== "claimed", active: status === "claimed" },
    { label: "Task Executed", complete: status === "executed" || status === "completed", active: status === "in_progress" },
    { label: "Verified & Paid", complete: status === "completed", active: status === "executed" },
  ]

  return (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-e2">
      <p className="text-xs font-medium text-ink-soft">Summary</p>
      <p className="mt-2 tabular-nums text-xl xl:text-2xl font-semibold tracking-tight text-ink whitespace-nowrap">
        {request.agreedPrice
          ? formatPrice(request.agreedPrice)
          : formatPriceRange(request.priceMin, request.priceMax)}
      </p>
      <div className="mt-3">
        <StatusBadge status={request.status} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-raised p-3">
        <UserAvatar name={request.helpee.name} />
        <div>
          <p className="text-sm font-semibold text-ink">{request.helpee.name}</p>
          <p className="text-xs text-ink-soft">Posted this task</p>
        </div>
      </div>

      {/* Visual Progress Timeline */}
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-3">Progress</p>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className="flex items-center gap-2.5"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500",
                step.complete
                  ? "bg-success text-white"
                  : step.active
                    ? "bg-primary text-white ring-2 ring-primary/30 animate-pulse"
                    : "bg-muted text-ink-soft",
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
              >
                {step.complete ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                step.complete ? "text-ink font-semibold" :
                step.active ? "text-primary font-semibold animate-pulse" :
                "text-ink-soft",
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {request.status !== "open" && request.helper ? (
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
            <Check className="size-4 shrink-0" strokeWidth={2.5} />
            Assigned to {request.helper.name}
          </p>
          <p className="mt-1 text-xs text-ink-soft leading-relaxed">
            Use the interactive chat and dashboard to coordinate and finalize terms.
          </p>
        </div>
      ) : null}

      {canOffer ? (
        <div className="mt-4">
          <div className="relative">
            {/* Pulse ring behind button */}
            <div className="absolute -inset-1 rounded-xl bg-primary/10 animate-pulse" />
            <OfferToHelpButton
              requestId={requestId}
              taskTitle={taskTitle}
              className="relative w-full cursor-pointer"
              onOfferSuccess={onOfferSuccess}
            />
          </div>
        </div>
      ) : null}

      {role === "helpee" && request.status === "open" ? (
        <p className="mt-4 text-center text-xs text-ink-soft">
          Waiting for a helper to offer help.
        </p>
      ) : null}
    </aside>
  )
}

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { getRequestById, role, user } = useApp()
  const request = getRequestById(params.id)
  const [isChatExpanded, setIsChatExpanded] = useState(false)

  if (!request) {
    return (
      <AppLayout>
        <h1 className="text-2xl font-semibold text-ink">Task not found</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This request may have been removed or expired.
        </p>
        <Button
          className="mt-6 cursor-pointer"
          variant="outline"
          onClick={() => router.push("/feed")}
        >
          Back to feed
        </Button>
      </AppLayout>
    )
  }

  const canOfferToHelp = role === "helper" && request.status === "open"
  const config = getCategoryConfig(request.category)
  const categoryImage = getCategoryImage(request.category)
  const Icon = config.icon

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-1 text-xs text-ink-soft" aria-label="Breadcrumb">
        <Link href="/feed" className="cursor-pointer hover:text-ink transition-colors">Browse</Link>
        <ChevronRight className="size-3" strokeWidth={1.75} />
        <span>{request.category}</span>
        <ChevronRight className="size-3" strokeWidth={1.75} />
        <span className="text-ink font-medium truncate max-w-48">{request.title}</span>
      </nav>

      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 cursor-pointer text-ink-soft"
        onClick={() => router.push("/feed")}
      >
        <ArrowLeft strokeWidth={1.75} />
        Browse tasks
      </Button>

      {/* Dynamic Success Alert Banner at the top for open tasks */}
      {request.status === "open" && role === "helpee" && user?.name === request.helpee.name && (
        <FeedbackAlert
          variant="success"
          description="Task posted successfully! You'll get a ping and a chat request as soon as a helper offers to help."
          className="mb-6"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-e2">
            <div className="relative aspect-[21/9] max-h-48 w-full overflow-hidden bg-muted">
              {request.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={request.photoUrl}
                  alt={request.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <StockImage
                  image={categoryImage}
                  fill
                  className="rounded-none rounded-t-xl"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-ink">
                  <Icon className="size-3" strokeWidth={1.75} />
                  {request.category}
                </span>
                {request.urgent ? (
                  <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                    Urgent
                  </span>
                ) : null}
                <StatusBadge status={request.status} />
              </div>

              <h1 className="text-2xl font-semibold leading-8 text-ink">
                {request.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" strokeWidth={1.75} />
                  {request.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" strokeWidth={1.75} />
                  Posted {formatRelativeTime(request.createdAt)}
                </span>
                {request.estimatedDuration ? (
                  <span className="inline-flex items-center gap-1">
                    <Timer className="size-3.5" strokeWidth={1.75} />
                    {request.estimatedDuration}
                  </span>
                ) : null}
                {request.deadline ? (
                  <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                    <Calendar className="size-3.5 text-secondary" strokeWidth={1.75} />
                    Deadline: {request.deadline}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                {request.description}
              </p>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-raised p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar name={request.helpee.name} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {request.helpee.name}
                    </p>
                    <p className="text-xs text-ink-soft">Posted this task</p>
                  </div>
                </div>
                <p className="tabular-nums text-sm sm:text-base font-bold tracking-tight text-ink whitespace-nowrap ml-3 shrink-0">
                  {request.agreedPrice
                    ? formatPrice(request.agreedPrice)
                    : formatPriceRange(request.priceMin, request.priceMax)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Action Dashboard */}
          {request.status !== "open" && (
            <div className="animate-page-enter">
              <StatusDashboard 
                requestId={request.id} 
                onActionComplete={() => setIsChatExpanded(true)}
              />
            </div>
          )}

          {canOfferToHelp ? (
            <div className="mt-6 lg:hidden">
              <OfferToHelpButton
                requestId={request.id}
                taskTitle={request.title}
                className="w-full cursor-pointer"
                onOfferSuccess={() => setIsChatExpanded(true)}
              />
            </div>
          ) : null}
        </article>

        {/* Right Sidebar containing summary and helper card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <TaskSummaryCard
            requestId={request.id}
            taskTitle={request.title}
            canOffer={canOfferToHelp}
            role={role}
            onOfferSuccess={() => setIsChatExpanded(true)}
          />
          {request.status !== "open" && request.helper && (
            <HelperProfileCard 
              helper={request.helper} 
              onMessageClick={() => setIsChatExpanded(true)}
            />
          )}
        </div>
      </div>

      {request.status !== "open" && (
        <MockChat
          requestId={request.id}
          isExpanded={isChatExpanded}
          onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
        />
      )}
    </AppLayout>
  )
}
