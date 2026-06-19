import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * Generate a deterministic gradient index from a name string.
 * Uses a simple hash so each user gets a consistent, unique avatar color.
 */
function getAvatarGradient(name: string): string {
  const GRADIENTS = [
    "from-primary/20 to-primary/5",
    "from-secondary/20 to-secondary/5",
    "from-info/20 to-info/5",
    "from-success/20 to-success/5",
    "from-warning/20 to-warning/5",
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

type UserAvatarProps = {
  name: string
  className?: string
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  const gradient = getAvatarGradient(name)

  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-ink ring-2 ring-surface ring-offset-1",
        gradient,
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
