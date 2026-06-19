"use client"

import { useState } from "react"
import { Check, HandHelping } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"
import { appToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type OfferToHelpButtonProps = {
  requestId: string
  taskTitle: string
  disabled?: boolean
  className?: string
  onOfferSuccess?: () => void
}

export function OfferToHelpButton({
  requestId,
  taskTitle,
  disabled = false,
  className,
  onOfferSuccess,
}: OfferToHelpButtonProps) {
  const { acceptRequest } = useApp()
  const [claimed, setClaimed] = useState(false)

  const handleClick = () => {
    const result = acceptRequest(requestId)

    if (!result.success) {
      if (result.reason === "already_claimed") {
        appToast.taskAlreadyClaimed()
      }
      return
    }

    setClaimed(true)
    appToast.taskClaimed(taskTitle)
    onOfferSuccess?.()

    window.setTimeout(() => {
      setClaimed(true)
    }, 1500)
  }

  if (claimed) {
    return (
      <Button
        size="lg"
        variant="secondary"
        className={className}
        disabled
      >
        <Check strokeWidth={1.75} />
        Claimed!
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
      disabled={disabled}
    >
      <HandHelping strokeWidth={1.75} />
      Offer to help
    </Button>
  )
}
