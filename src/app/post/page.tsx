"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftRight } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { PostHelpForm } from "@/components/post-help-form"
import { StockImage } from "@/components/stock-image"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"
import { STOCK_IMAGES } from "@/lib/images"
import { appToast } from "@/lib/toast"

export default function PostPage() {
  const router = useRouter()
  const { role } = useApp()

  useEffect(() => {
    if (role === "helper") {
      appToast.helpeeOnlyPost()
    }
  }, [role])

  if (role === "helper") {
    return (
      <AppLayout>
        <div className="flex size-14 items-center justify-center rounded-full bg-info/10">
          <ArrowLeftRight className="size-6 text-info" strokeWidth={1.75} />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-ink">Switch to Helpee</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          Only helpees can post new tasks. Switch role in the header to
          continue.
        </p>
        <Button
          variant="outline"
          className="mt-6 cursor-pointer"
          onClick={() => router.push("/feed")}
        >
          Browse tasks
        </Button>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Post a task</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Agree on a price range and get help from someone in Jatinangor.
        </p>
      </div>
      
      <div className="relative mb-6 hidden h-40 w-full overflow-hidden rounded-2xl border border-border/60 sm:block shadow-e1">
        <StockImage
          image={STOCK_IMAGES.postTask}
          fill
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-transparent flex items-center p-8">
          <div className="max-w-md">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Helpee Task
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-3 tracking-tight">Need a favor?</h2>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              Provide details, select a community category, and state your target price range. Peer helpers will see it instantly!
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <PostHelpForm />
      </div>
    </AppLayout>
  )
}
