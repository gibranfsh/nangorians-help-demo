export type Role = "helpee" | "helper"

export type User = {
  name: string
  email: string
  avatarUrl?: string
  rating?: number
  ratingsCount?: number
  tasksCompleted?: number
  onTimeRate?: number
  walletBalance?: number
}

export type HelpRequestStatus =
  | "open"
  | "claimed"
  | "in_progress"
  | "executed"
  | "completed"

export type ChatMessage = {
  id: string
  sender: string
  text: string
  timestamp: Date
}

export type HelpRequest = {
  id: string
  title: string
  description: string
  priceMin: number
  priceMax: number
  status: HelpRequestStatus
  category: string
  location: string
  urgent?: boolean
  helpee: User
  helper?: User
  createdAt: Date
  estimatedDuration?: string
  agreedPrice?: number
  submissionNotes?: string
  chatHistory?: ChatMessage[]
  photoUrl?: string
  deadline?: string
}

export type PostRequestInput = {
  title: string
  description: string
  priceMin: number
  priceMax: number
  category: string
  location: string
  estimatedDuration?: string
  urgent?: boolean
  photoUrl?: string
  deadline?: string
}
