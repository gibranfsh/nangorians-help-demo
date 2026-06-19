"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HelpRequest } from "@/lib/types"

export type StatusFilter = "all" | "open" | "claimed"

type FeedStatusTabsProps = {
  requests: HelpRequest[]
  value: StatusFilter
  onChange: (value: StatusFilter) => void
}

export function FeedStatusTabs({
  requests,
  value,
  onChange,
}: FeedStatusTabsProps) {
  const openCount = requests.filter((r) => r.status === "open").length
  const claimedCount = requests.filter((r) => r.status === "claimed").length

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as StatusFilter)}>
      <TabsList className="h-9 w-full justify-start bg-muted">
        <TabsTrigger value="open" className="cursor-pointer text-xs">
          Open · {openCount}
        </TabsTrigger>
        <TabsTrigger value="claimed" className="cursor-pointer text-xs">
          In progress · {claimedCount}
        </TabsTrigger>
        <TabsTrigger value="all" className="cursor-pointer text-xs">
          All · {requests.length}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
