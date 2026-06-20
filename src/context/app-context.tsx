"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  DEMO_HELPEE,
  DEMO_HELPER,
  SEED_REQUESTS,
} from "@/lib/mock-data"
import type {
  HelpRequest,
  PostRequestInput,
  Role,
  User,
} from "@/lib/types"
import { formatPrice } from "@/lib/format"

export type ActiveTab = "browse" | "inbox" | "schedule" | "helpers" | "wallet"

type AppContextValue = {
  user: User | null
  role: Role
  requests: HelpRequest[]
  isAuthenticated: boolean
  activeTab: ActiveTab
  categoryFilter: string
  searchQuery: string
  showProfileModal: boolean
  setActiveTab: (tab: ActiveTab) => void
  setCategoryFilter: (category: string) => void
  setSearchQuery: (query: string) => void
  setShowProfileModal: (show: boolean) => void
  loginWithGoogle: () => User
  logout: () => void
  setRole: (role: Role) => void
  postRequest: (input: PostRequestInput) => HelpRequest
  acceptRequest: (id: string) => { success: true } | { success: false; reason: "not_found" | "already_claimed" }
  agreeTerms: (id: string, price: number) => void
  markAsExecuted: (id: string, notes?: string) => void
  verifyAndPay: (id: string) => void
  sendChatMessage: (id: string, sender: string, text: string) => void
  getRequestById: (id: string) => HelpRequest | undefined
  updateWalletBalance: (amount: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRoleState] = useState<Role>("helpee")
  const [requests, setRequests] = useState<HelpRequest[]>(SEED_REQUESTS)
  const [activeTab, setActiveTab] = useState<ActiveTab>("browse")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false)

  const loginWithGoogle = useCallback(() => {
    const demoUser = { ...DEMO_HELPEE }
    setUser(demoUser)
    setRoleState("helpee")
    return demoUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setRoleState("helpee")
    setRequests(SEED_REQUESTS)
    setActiveTab("browse")
    setCategoryFilter("all")
    setSearchQuery("")
    setShowProfileModal(false)
  }, [])

  const setRole = useCallback((nextRole: Role) => {
    setRoleState(nextRole)
  }, [])

  const postRequest = useCallback(
    (input: PostRequestInput) => {
      const newRequest: HelpRequest = {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        description: input.description.trim(),
        priceMin: input.priceMin,
        priceMax: input.priceMax,
        status: "open",
        category: input.category.trim() || "General",
        location: input.location.trim() || "Local area",
        estimatedDuration: input.estimatedDuration?.trim() || undefined,
        helpee: user ?? DEMO_HELPEE,
        createdAt: new Date(),
        chatHistory: [],
        urgent: input.urgent,
        photoUrl: input.photoUrl,
        deadline: input.deadline,
      }

      setRequests((current) => [newRequest, ...current])
      return newRequest
    },
    [user],
  )

  const acceptRequest = useCallback((id: string) => {
    const target = requests.find((request) => request.id === id)

    if (!target) {
      return { success: false as const, reason: "not_found" as const }
    }

    if (target.status === "claimed") {
      return { success: false as const, reason: "already_claimed" as const }
    }

    const isOwnRequest = target.helpee.name === (user?.name ?? DEMO_HELPEE.name)
    const assignedHelper = isOwnRequest ? { ...DEMO_HELPER } : { ...(user ?? DEMO_HELPER) }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "claimed",
              helper: assignedHelper,
              chatHistory: [
                {
                  id: crypto.randomUUID(),
                  sender: assignedHelper.name,
                  text: `Hi ${request.helpee.name}! I'd love to help you with this task. I can get started right away.`,
                  timestamp: new Date(),
                },
                {
                  id: crypto.randomUUID(),
                  sender: assignedHelper.name,
                  text: `How about we agree on a final price of ${formatPrice(request.priceMax)}? Let me know if that works for you!`,
                  timestamp: new Date(Date.now() + 50),
                }
              ]
            }
          : request,
      ),
    )

    return { success: true as const }
  }, [requests, user])

  const agreeTerms = useCallback((id: string, price: number) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "in_progress",
              agreedPrice: price,
              chatHistory: [
                ...(request.chatHistory || []),
                {
                  id: crypto.randomUUID(),
                  sender: "System",
                  text: `Agreement confirmed! Price is locked at ${formatPrice(price)}. Execution started.`,
                  timestamp: new Date(),
                },
              ],
            }
          : request,
      ),
    )
  }, [])

  const markAsExecuted = useCallback((id: string, notes?: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "executed",
              submissionNotes: notes,
              chatHistory: [
                ...(request.chatHistory || []),
                {
                  id: crypto.randomUUID(),
                  sender: request.helper?.name || DEMO_HELPER.name,
                  text: `I've finished the task! Notes: "${notes || "Completed according to instructions."}"`,
                  timestamp: new Date(),
                },
                {
                  id: crypto.randomUUID(),
                  sender: "System",
                  text: `Task marked as completed. Waiting for ${request.helpee.name}'s verification.`,
                  timestamp: new Date(Date.now() + 50),
                },
              ],
            }
          : request,
      ),
    )
  }, [])

  const verifyAndPay = useCallback((id: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "completed",
              chatHistory: [
                ...(request.chatHistory || []),
                {
                  id: crypto.randomUUID(),
                  sender: "System",
                  text: `Task verified! Payment of ${formatPrice(request.agreedPrice || request.priceMax)} released to ${request.helper?.name || DEMO_HELPER.name}. Transaction complete!`,
                  timestamp: new Date(),
                },
              ],
            }
          : request,
      ),
    )
  }, [])

  const sendChatMessage = useCallback((id: string, sender: string, text: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              chatHistory: [
                ...(request.chatHistory || []),
                {
                  id: crypto.randomUUID(),
                  sender,
                  text,
                  timestamp: new Date(),
                },
              ],
            }
          : request,
      ),
    )
  }, [])

  const updateWalletBalance = useCallback((amount: number) => {
    setUser((current) => {
      if (!current) return null
      return {
        ...current,
        walletBalance: (current.walletBalance || 0) + amount,
      }
    })
  }, [])

  const getRequestById = useCallback(
    (id: string) => requests.find((request) => request.id === id),
    [requests],
  )

  const value = useMemo(
    () => ({
      user,
      role,
      requests,
      isAuthenticated: Boolean(user),
      activeTab,
      categoryFilter,
      searchQuery,
      showProfileModal,
      setActiveTab,
      setCategoryFilter,
      setSearchQuery,
      setShowProfileModal,
      loginWithGoogle,
      logout,
      setRole,
      postRequest,
      acceptRequest,
      agreeTerms,
      markAsExecuted,
      verifyAndPay,
      sendChatMessage,
      getRequestById,
      updateWalletBalance,
    }),
    [
      user,
      role,
      requests,
      activeTab,
      categoryFilter,
      searchQuery,
      showProfileModal,
      loginWithGoogle,
      logout,
      setRole,
      postRequest,
      acceptRequest,
      agreeTerms,
      markAsExecuted,
      verifyAndPay,
      sendChatMessage,
      getRequestById,
      updateWalletBalance,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }

  return context
}
