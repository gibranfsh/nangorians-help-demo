"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  Eye,
  FileText,
  Send,
  X,
  MapPin,
  Heading,
  AlertTriangle,
  Camera,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaskPreviewCard } from "@/components/task-preview-card"
import { InteractiveMap } from "@/components/interactive-map"
import { useApp } from "@/hooks/use-app"
import { POST_CATEGORIES } from "@/lib/categories"
import { appToast } from "@/lib/toast"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { FeedbackAlert } from "@/components/feedback-alert"

type FormState = {
  title: string
  description: string
  priceMin: string
  priceMax: string
  category: string
  location: string
  urgent: boolean
  photoUrl: string
  deadline: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  title: "",
  description: "",
  priceMin: "",
  priceMax: "",
  category: "Food run",
  location: "FEB Canteen",
  urgent: false,
  photoUrl: "",
  deadline: "Today",
}

const DESCRIPTION_MAX = 500
const DESCRIPTION_WARN = 400

const DEADLINE_OPTIONS = [
  "ASAP (1 hr)",
  "Today",
  "Tomorrow",
  "Choose Time",
  "Flexible",
]

const formatCustomDeadline = (val: string) => {
  if (!val) return ""
  try {
    const date = new Date(val)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
  } catch {
    return val
  }
}

type Step = { label: string; Icon: any }
const STEPS: Step[] = [
  { label: "Fill in details", Icon: FileText },
  { label: "Preview",         Icon: Eye },
  { label: "Post",            Icon: Send },
]

export function PostHelpForm() {
  const router = useRouter()
  const { postRequest } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Custom manual time states
  const [customDeadlineVal, setCustomDeadlineVal] = useState("")

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const isFormReady = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.description.trim().length > 0 &&
      Number(form.priceMin) > 0 &&
      Number(form.priceMax) > 0 &&
      Number(form.priceMin) <= Number(form.priceMax) &&
      form.location.trim().length > 0
    )
  }, [form])

  const currentStep = useMemo(() => {
    if (isFormReady) return 2
    if (form.title.trim() || form.description.trim()) return 1
    return 0
  }, [isFormReady, form.title, form.description])

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        appToast.validationError("Please select a valid image file.")
        return
      }
      const objectUrl = URL.createObjectURL(file)
      updateField("photoUrl", objectUrl)
      toast.success("Photo attached successfully!", {
        description: `${file.name} ready for preview.`,
      })
    }
  }

  const removePhoto = () => {
    if (form.photoUrl) {
      URL.revokeObjectURL(form.photoUrl)
      updateField("photoUrl", "")
    }
  }

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}

    if (!form.title.trim()) {
      nextErrors.title = "Task title is required."
    }

    if (!form.description.trim()) {
      nextErrors.description = "Details are required."
    }

    if (!form.location.trim()) {
      nextErrors.location = "A location is required."
    }

    const priceMin = Number(form.priceMin)
    const priceMax = Number(form.priceMax)

    if (!form.priceMin || Number.isNaN(priceMin) || priceMin <= 0) {
      nextErrors.priceMin = "Enter a valid minimum price."
    }

    if (!form.priceMax || Number.isNaN(priceMax) || priceMax <= 0) {
      nextErrors.priceMax = "Enter a valid maximum price."
    }

    if (
      !nextErrors.priceMin &&
      !nextErrors.priceMax &&
      priceMin > priceMax
    ) {
      nextErrors.priceMax = "Maximum price must be greater than or equal to minimum."
    }

    return nextErrors
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstError = Object.values(nextErrors)[0]
      if (firstError) {
        appToast.validationError(firstError)
      }
      return
    }

    // Resolve final deadline value
    const finalDeadline = form.deadline === "Choose Time"
      ? formatCustomDeadline(customDeadlineVal) || "Today"
      : form.deadline

    const newRequest = postRequest({
      title: form.title,
      description: form.description,
      priceMin: Number(form.priceMin),
      priceMax: Number(form.priceMax),
      category: form.category,
      location: form.location,
      urgent: form.urgent,
      photoUrl: form.photoUrl || undefined,
      deadline: finalDeadline,
    })

    appToast.taskPosted(() => {
      router.push(`/requests/${newRequest.id}`)
    })

    window.setTimeout(() => {
      router.push("/feed")
    }, 400)
  }

  const descriptionLength = form.description.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
      <form onSubmit={handleSubmit} className="space-y-6 border border-border bg-card p-6 rounded-2xl shadow-e2">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 pb-4 border-b border-border">
          {STEPS.map((step, i) => {
            const { Icon } = step
            return (
              <div key={step.label} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                  i <= currentStep
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-ink-soft",
                )}>
                  <Icon className="size-3.5" strokeWidth={1.75} />
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 ? (
                  <div className={cn(
                    "h-px w-4 transition-colors duration-300",
                    i < currentStep ? "bg-primary/30" : "bg-border",
                  )} />
                ) : null}
              </div>
            )
          })}
        </div>

        {/* Task Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-ink">Task title</Label>
          <div className="relative">
            <div className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft/60">
              <Heading className="size-4" strokeWidth={1.75} />
            </div>
            <Input
              id="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Print 30 pages and drop at Wilson Hall"
              className={cn(
                "rounded-[14px] pl-9 pr-9 transition-all duration-200 focus-visible:ring-primary/35",
                errors.title ? "border-destructive focus-visible:ring-destructive/30" : "border-border",
              )}
            />
            {form.title.trim() ? (
              <Check className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-success" strokeWidth={2} />
            ) : null}
          </div>
          <p className="text-xs font-medium text-ink-soft">Keep it short and specific.</p>
          {errors.title ? (
            <p className="text-xs font-medium text-destructive">{errors.title}</p>
          ) : null}
        </div>

        {/* Details / Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-ink">Details</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Where, when, anything special the helper should know."
            maxLength={DESCRIPTION_MAX}
            className={cn(
              "min-h-28 rounded-[14px] transition-all duration-200 focus-visible:ring-primary/35",
              errors.description ? "border-destructive focus-visible:ring-destructive/30" : "border-border",
            )}
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs font-medium text-destructive">{errors.description}</p>
            ) : (
              <p className="text-xs font-medium text-ink-soft">Details about what helper should do.</p>
            )}
            <span className={cn(
              "tabular-nums text-xs font-medium transition-colors",
              descriptionLength > DESCRIPTION_MAX ? "text-destructive" :
              descriptionLength > DESCRIPTION_WARN ? "text-warning" :
              "text-ink-soft",
            )}>
              {descriptionLength}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-ink">Category</Label>
          <div className="flex flex-wrap gap-2">
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => updateField("category", cat)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                  form.category === cat
                    ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-ink-soft hover:bg-muted hover:text-ink",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-ink-soft">Helps people find your task on the browse feed.</p>
        </div>

        {/* Image Attachment Uploader */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-ink">Attach Photo</Label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {form.photoUrl ? (
            <div className="relative rounded-xl border border-border overflow-hidden h-32 w-48 bg-muted shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.photoUrl}
                alt="Selected attachment preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-ink/75 hover:bg-error text-white p-1 rounded-full cursor-pointer shadow transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 bg-background/50 hover:bg-muted/10 rounded-xl p-6 cursor-pointer text-center transition-all group"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                <Camera className="size-5" />
              </div>
              <p className="text-xs font-semibold text-ink mt-2">Click to upload deliverable photo</p>
              <span className="text-[10px] text-ink-soft mt-1">Supports PNG, JPG (Max 5MB)</span>
            </div>
          )}
          <p className="text-xs font-medium text-ink-soft">Attach photo for food boxes, reference documents, or packages.</p>
        </div>

        {/* Location Selection & Interactive Map */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-ink">Dropoff Location</Label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft/60">
                <MapPin className="size-4" strokeWidth={1.75} />
              </div>
              <Input
                id="location"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="e.g. FEB Canteen, Library Desk 3"
                className={cn(
                  "rounded-[14px] pl-9 pr-9 transition-all duration-200 focus-visible:ring-primary/35 border-border",
                  errors.location && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              {form.location.trim() ? (
                <Check className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-success" strokeWidth={2} />
              ) : null}
            </div>
            {errors.location ? (
              <p className="text-xs font-medium text-destructive">{errors.location}</p>
            ) : (
              <p className="text-xs font-medium text-ink-soft">Specific dropoff location.</p>
            )}
          </div>

          {/* Interactive Map Pinpointing */}
          <InteractiveMap
            currentLocation={form.location}
            onLocationSelect={(val) => updateField("location", val)}
          />
        </div>

        {/* Completion Deadline */}
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-ink">Completion Deadline</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEADLINE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("deadline", opt)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 text-center",
                    form.deadline === opt
                      ? "border-secondary/20 bg-secondary/10 text-secondary shadow-sm"
                      : "border-border bg-card text-ink-soft hover:bg-muted hover:text-ink",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>

            {form.deadline === "Choose Time" && (
              <div className="relative mt-2 animate-page-enter">
                <div className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft/60">
                  <Calendar className="size-4" strokeWidth={1.75} />
                </div>
                <Input
                  type="datetime-local"
                  value={customDeadlineVal}
                  onChange={(e) => setCustomDeadlineVal(e.target.value)}
                  className="rounded-[14px] pl-9 text-xs focus-visible:ring-primary/35 border-border h-9"
                />
              </div>
            )}
            <p className="text-xs font-medium text-ink-soft">Select when you need this completed.</p>
          </div>

          {/* Urgent checkbox toggle */}
          <div className="flex items-center gap-3 bg-warning/5 rounded-xl border border-warning/10 p-3.5">
            <input
              type="checkbox"
              id="urgent"
              checked={form.urgent}
              onChange={(e) => updateField("urgent", e.target.checked)}
              className="size-4 shrink-0 rounded border-border bg-card accent-warning focus-visible:ring-2 focus-visible:ring-warning cursor-pointer"
            />
            <label htmlFor="urgent" className="cursor-pointer">
              <span className="text-xs font-bold text-ink flex items-center gap-1">
                <AlertTriangle className="size-3.5 text-warning" />
                Mark as High Urgency
              </span>
              <span className="text-[10px] text-ink-soft block mt-0.5">Adds an urgent badge and notifies helpers immediately.</span>
            </label>
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="priceMin" className="text-sm font-semibold text-ink">Min price</Label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 flex size-4 items-center justify-center -translate-y-1/2 text-xs font-bold text-ink-soft/60 select-none">
                Rp
              </div>
              <Input
                id="priceMin"
                type="number"
                inputMode="numeric"
                min={0}
                value={form.priceMin}
                onChange={(event) => updateField("priceMin", event.target.value)}
                className={cn(
                  "tabular-nums rounded-[14px] pl-9 transition-all duration-200 focus-visible:ring-primary/35",
                  errors.priceMin ? "border-destructive focus-visible:ring-destructive/30" : "border-border",
                )}
              />
            </div>
            {errors.priceMin ? (
              <p className="text-xs font-medium text-destructive">{errors.priceMin}</p>
            ) : (
              <p className="text-xs font-medium text-ink-soft">Minimum compensation offer.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceMax" className="text-sm font-semibold text-ink">Max price</Label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 flex size-4 items-center justify-center -translate-y-1/2 text-xs font-bold text-ink-soft/60 select-none">
                Rp
              </div>
              <Input
                id="priceMax"
                type="number"
                inputMode="numeric"
                min={0}
                value={form.priceMax}
                onChange={(event) => updateField("priceMax", event.target.value)}
                className={cn(
                  "tabular-nums rounded-[14px] pl-9 transition-all duration-200 focus-visible:ring-primary/35",
                  errors.priceMax ? "border-destructive focus-visible:ring-destructive/30" : "border-border",
                )}
              />
            </div>
            {errors.priceMax ? (
              <p className="text-xs font-medium text-destructive">{errors.priceMax}</p>
            ) : (
              <p className="text-xs font-medium text-ink-soft">Maximum compensation cap.</p>
            )}
          </div>
        </div>

        {Number(form.priceMax) > 0 && Number(form.priceMax) < 50000 && (
          <FeedbackAlert
            variant="info"
            description="Tasks under Rp 50.000 may take longer to be claimed. Consider increasing the range to attract helpers faster."
            className="mb-4"
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer transition-colors duration-200 text-xs font-bold"
            onClick={() => router.push("/feed")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className={cn(
              "flex-1 cursor-pointer shadow-e2 hover:shadow-e3 transition-all duration-200 text-xs font-bold",
              isFormReady && "bg-gradient-to-r from-primary via-primary/90 to-primary animate-shimmer",
            )}
          >
            Post a task
          </Button>
        </div>
      </form>

      {/* Live Preview Column */}
      <div className="lg:sticky lg:top-24 space-y-4">
        <TaskPreviewCard
          title={form.title}
          description={form.description}
          category={form.category}
          priceMin={Number(form.priceMin) || 0}
          priceMax={Number(form.priceMax) || 0}
          location={form.location}
          urgent={form.urgent}
          photoUrl={form.photoUrl}
          deadline={form.deadline === "Choose Time" ? formatCustomDeadline(customDeadlineVal) : form.deadline}
        />
      </div>
    </div>
  )
}
