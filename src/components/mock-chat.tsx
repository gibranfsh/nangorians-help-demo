"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Send, Sparkles, MessageSquare, ChevronUp, ChevronDown, Check, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { useAppContext } from "@/context/app-context"
import { DEMO_HELPEE, DEMO_HELPER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type MockChatProps = {
  requestId: string
  className?: string
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function MockChat({ requestId, className, isExpanded = false, onToggleExpand }: MockChatProps) {
  const { getRequestById, role, sendChatMessage } = useAppContext()
  const request = getRequestById(requestId)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const messages = useMemo(() => request?.chatHistory || [], [request?.chatHistory])
  const helperName = request?.helper?.name || DEMO_HELPER.name
  const helpeeName = request?.helpee?.name || DEMO_HELPEE.name

  // Determine other party details
  const currentUserName = role === "helpee" ? helpeeName : helperName
  const otherPartyName = role === "helpee" ? helperName : helpeeName

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, isExpanded])

  // Trigger simulated replies from the other party
  const triggerAutomatedReply = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      let replyText = ""

      const textLower = userMessage.toLowerCase()

      if (role === "helpee") {
        // User is Helpee, other party is Helper ("Raka")
        switch (request?.status) {
          case "claimed":
            if (textLower.includes("how much") || textLower.includes("price") || textLower.includes("ok") || textLower.includes("agree") || textLower.includes("deal")) {
              replyText = `Awesome! I'm happy with that price. Please click "Confirm Agreement" in the timeline panel so I can start work!`
            } else {
              replyText = "Sounds good. Let me know when you're ready to lock in the agreement so I can get started!"
            }
            break
          case "in_progress":
            replyText = "I'm on it! I'm currently heading to complete your request. I'll message you here when I'm done!"
            break
          case "executed":
            replyText = `Hey! I've marked the task as done. Please review my submission notes and click "Verify & Release Payment" above when you're ready.`
            break
          case "completed":
            replyText = "Thanks for the payment! Really appreciate it. Let me know if you need anything else in the future!"
            break
          default:
            replyText = "Got it! Let me know what you need."
        }
      } else {
        // User is Helper, other party is Helpee ("Alya" / "Dimas" etc.)
        switch (request?.status) {
          case "claimed":
            if (textLower.includes("start") || textLower.includes("price") || textLower.includes("ready")) {
              replyText = "Yes, that price works for me. I've locked in the agreement! Let me know once you get started."
            } else {
              replyText = "Thanks for claiming my task! Let's coordinate the final price and details."
            }
            break
          case "in_progress":
            replyText = "Thanks for the update! Take your time, safety first. Keep me posted here!"
            break
          case "executed":
            replyText = "Got it, I see you completed the task! Let me double check it now."
            break
          case "completed":
            replyText = "Thanks for the help! The payment has been released. Have a great day!"
            break
          default:
            replyText = "Thanks for the update!"
        }
      }

      sendChatMessage(requestId, otherPartyName, replyText)
    }, 1500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage = inputText.trim()
    sendChatMessage(requestId, currentUserName, userMessage)
    setInputText("")

    // Trigger responder
    triggerAutomatedReply(userMessage)
  }

  return (
    <>
      {/* 1. Launcher Pill */}
      <div
        className={cn(
          "fixed z-50 h-12 w-[185px] rounded-full bg-gradient-to-r from-primary to-primary/90 text-white cursor-pointer select-none shadow-md flex items-center justify-between px-4 hover:shadow-e4 hover:scale-[1.02] active:scale-[0.98] transition-all",
          isExpanded 
            ? "bottom-20 right-4 opacity-0 scale-90 pointer-events-none md:bottom-6 md:right-8 duration-200 ease-in" 
            : "bottom-20 right-4 opacity-100 scale-100 pointer-events-auto md:bottom-6 md:right-8 duration-300 ease-out",
          className
        )}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <MessageSquare className="size-4 shrink-0 text-white" />
          <span className="text-xs font-bold tracking-wide truncate">Chat with {otherPartyName}</span>
        </div>
        <ChevronUp className="size-4 shrink-0 opacity-80" strokeWidth={2.5} />
      </div>

      {/* 2. Expanded Chat Card */}
      <div
        className={cn(
          "fixed z-50 w-[calc(100vw-2rem)] h-[500px] rounded-2xl bg-card border border-border shadow-e4 overflow-hidden flex flex-col transition-all",
          isExpanded
            ? "bottom-20 right-4 opacity-100 translate-y-0 scale-100 pointer-events-auto md:bottom-6 md:right-8 md:w-[380px] duration-300 ease-out"
            : "bottom-20 right-4 opacity-0 translate-y-12 scale-95 pointer-events-none md:bottom-6 md:right-8 md:w-[380px] duration-300 ease-in-out",
          className
        )}
      >
        {/* Chat Header */}
        <div 
          onClick={onToggleExpand}
          className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-3 cursor-pointer select-none shadow-md shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <UserAvatar name={otherPartyName} className="size-8" />
            <div>
              <p className="text-xs font-semibold text-white leading-none">{otherPartyName}</p>
              <span className="text-[10px] font-medium text-emerald-100 flex items-center gap-1 mt-0.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Sparkles className="size-3" />
              Interactive Demo Chat
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onToggleExpand) onToggleExpand()
              }}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
            >
              <ChevronDown className="size-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/30">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-semibold text-ink-soft">No messages yet</p>
              <p className="text-xs text-ink-soft/75 mt-1 max-w-xs">
                Once claimed, you can use this chat to coordinate the task, price, and handoff.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSystem = msg.sender === "System"
              const isMe = msg.sender === currentUserName

              if (isSystem) {
                const isAgreementConfirmed = msg.text.includes("Agreement confirmed!")
                const isTaskVerified = msg.text.includes("Task verified!")
                const isWorkSubmitted = msg.text.includes("Task marked as completed")

                if (isAgreementConfirmed || isTaskVerified) {
                  return (
                    <div key={msg.id} className="flex justify-center my-3 animate-page-enter w-full">
                      <div className="rounded-xl bg-success/5 border border-success/15 px-4 py-3 text-center max-w-[90%] flex flex-col items-center gap-1.5 shadow-xs">
                        <span className="flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-[10px] font-bold text-success uppercase tracking-wider">
                          {isAgreementConfirmed ? "Agreement Locked" : "Payment Released"}
                        </span>
                        <p className="text-xs font-semibold text-emerald-950/90 leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (isWorkSubmitted) {
                  return (
                    <div key={msg.id} className="flex justify-center my-3 animate-page-enter w-full">
                      <div className="rounded-xl bg-warning/5 border border-warning/15 px-4 py-3 text-center max-w-[90%] flex flex-col items-center gap-1.5 shadow-xs">
                        <span className="flex size-6 items-center justify-center rounded-full bg-warning/15 text-warning animate-pulse">
                          <Clock className="size-3.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
                          Work Submitted
                        </span>
                        <p className="text-xs font-semibold text-amber-950/90 leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className="flex justify-center my-2 animate-page-enter w-full">
                    <div className="rounded-xl bg-muted/40 border border-border/50 px-3.5 py-2 text-center max-w-[90%] flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                        System Log
                      </span>
                      <p className="text-[11px] font-medium text-ink-soft leading-normal">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-2 max-w-[85%] animate-page-enter",
                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {!isMe && <UserAvatar name={msg.sender} className="size-6 mt-0.5 shrink-0" />}
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm",
                        isMe
                          ? "bg-gradient-to-br from-primary to-primary/95 text-white rounded-tr-none"
                          : "bg-muted/65 text-ink border border-border/40 rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className={cn(
                      "text-[9px] text-ink-soft/70 mt-0.5 px-1",
                      isMe ? "text-right" : "text-left"
                    )}>
                      {msg.sender} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })
          )}

          {isTyping && (
            <div className="flex items-start gap-2 mr-auto max-w-[80%] animate-page-enter">
              <UserAvatar name={otherPartyName} className="size-6 mt-0.5 shrink-0" />
              <div className="rounded-xl bg-muted/65 text-ink border border-border/40 rounded-tl-none px-3.5 py-2.5 shadow-sm">
                <div className="flex gap-1 items-center h-2">
                  <span className="size-1.5 bg-ink-soft/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-1.5 bg-ink-soft/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="size-1.5 bg-ink-soft/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t border-border bg-surface p-3 flex gap-2 shrink-0">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={request?.status === "completed" ? "Chat is closed." : `Type message to ${otherPartyName}...`}
            disabled={request?.status === "completed" || isTyping}
            className="rounded-lg h-9 text-xs focus-visible:ring-primary/30 border-border bg-background/50 flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || request?.status === "completed" || isTyping}
            className="cursor-pointer size-9 rounded-lg shrink-0 p-0 flex items-center justify-center shadow-sm"
          >
            <Send className="size-3.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  )
}
