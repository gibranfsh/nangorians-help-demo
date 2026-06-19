"use client"

import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertVariant = "info" | "success" | "warning" | "error"

type FeedbackAlertProps = {
  variant: AlertVariant
  title?: string
  description: string
  className?: string
}

const variantConfig = {
  info: {
    containerClass: "bg-[#E0F2FE] text-[#0284C7] border-[#BBA6FD]/20 border",
    icon: Info,
  },
  success: {
    containerClass: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]/65 border",
    icon: CheckCircle2,
  },
  warning: {
    containerClass: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]/65 border",
    icon: AlertTriangle,
  },
  error: {
    containerClass: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]/65 border",
    icon: AlertCircle,
  },
}

export function FeedbackAlert({
  variant,
  title,
  description,
  className,
}: FeedbackAlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[14px] p-4 text-xs shadow-sm transition-all duration-300 animate-page-enter",
        config.containerClass,
        className
      )}
    >
      <Icon className="size-4 shrink-0 mt-0.5" strokeWidth={2.2} />
      <div className="space-y-0.5">
        {title && <p className="font-bold leading-none">{title}</p>}
        <p className="leading-relaxed opacity-95">{description}</p>
      </div>
    </div>
  )
}
