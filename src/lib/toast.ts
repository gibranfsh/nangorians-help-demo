import { toast } from "sonner"

import type { Role } from "@/lib/types"

const baseDuration = 4000
const errorDuration = 5000

export const appToast = {
  taskPosted: (onView?: () => void) =>
    toast.success("Task posted", {
      description:
        "You'll get a ping the moment someone offers to help.",
      duration: baseDuration,
      action: onView
        ? {
            label: "View",
            onClick: onView,
          }
        : undefined,
    }),

  taskClaimed: (taskTitle: string) =>
    toast.success("You claimed this task", {
      description: `"${taskTitle}" is now in progress.`,
      duration: baseDuration,
    }),

  taskAlreadyClaimed: () =>
    toast.error("Task unavailable", {
      description: "Someone else already claimed this task.",
      duration: errorDuration,
    }),

  validationError: (message: string) =>
    toast.error("Check your form", {
      description: message,
      duration: errorDuration,
    }),

  roleSwitched: (role: Role) =>
    toast.info(`Viewing as ${role === "helpee" ? "Helpee" : "Helper"}`, {
      description:
        role === "helpee"
          ? "You can post new tasks."
          : "You can offer to help on open tasks.",
      duration: baseDuration,
    }),

  welcome: (name: string) =>
    toast.success(`Welcome, ${name}`, {
      description: "Browse open tasks or post one of your own.",
      duration: baseDuration,
    }),

  helpeeOnlyPost: () =>
    toast.info("Posting is for helpees", {
      description: "Switch role to Helpee to post a task.",
      duration: baseDuration,
    }),
}
