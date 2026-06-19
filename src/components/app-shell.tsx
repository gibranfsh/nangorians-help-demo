import { cn } from "@/lib/utils"

type AppShellProps = {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-col bg-background",
        className,
      )}
    >
      {children}
    </div>
  )
}
