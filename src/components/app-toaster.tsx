"use client"

import { Toaster } from "@/components/ui/sonner"
import { useIsMobile } from "@/hooks/use-media-query"

export function AppToaster() {
  const isMobile = useIsMobile()

  return (
    <Toaster
      position={isMobile ? "top-center" : "top-right"}
      offset={
        isMobile
          ? "5rem"
          : "5rem"
      }
      visibleToasts={1}
      expand={!isMobile}
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast: "max-w-sm md:max-w-md",
        },
      }}
    />
  )
}
