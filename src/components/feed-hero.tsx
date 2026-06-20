"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useApp } from "@/hooks/use-app"

type FeedHeroProps = {
  openCount: number
}

export function FeedHero({ openCount }: FeedHeroProps) {
  const { user } = useApp()
  const firstName = user?.name.split(" ")[0] ?? "there"

  return (
    <section className="gradient-mesh-hero-rich relative overflow-hidden rounded-3xl border border-border/60 px-8 py-10 shadow-e2 lg:px-12 lg:py-12">
      {/* Pill tag */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-success" />
        <span className="text-xs font-semibold text-ink-soft">For the community, by the community</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl leading-tight">
        Need a hand?
      </h1>

      {/* Personalized subtitle */}
      <p className="mt-2 text-sm text-ink-soft">
        Hey {firstName} —{" "}
        <span className="font-semibold text-ink">
          {openCount} task{openCount === 1 ? "" : "s"}
        </span>{" "}
        waiting for a helper.
      </p>

      {/* Frosted search bar */}
      <div className="relative mt-6 max-w-lg">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft"
          strokeWidth={1.75}
        />
        <Input
          readOnly
          placeholder="Search tasks near you…"
          className="cursor-pointer rounded-[14px] border-border/50 bg-white/70 pl-10 shadow-e1 backdrop-blur-sm hover:border-primary/30 hover:bg-white/90 hover:shadow-e2 transition-all duration-200"
          aria-label="Search tasks (demo)"
        />
      </div>
    </section>
  )
}
