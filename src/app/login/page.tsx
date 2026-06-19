"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, HandHelping } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { PageTransition } from "@/components/page-transition"
import { StockImage } from "@/components/stock-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/hooks/use-app"
import { STOCK_IMAGES } from "@/lib/images"
import { appToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

const TRUST_BULLETS = [
  { icon: Check, text: "Post in seconds" },
  { icon: Check, text: "Set your price" },
  { icon: Check, text: "Get help from people nearby" },
]

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, loginWithGoogle } = useApp()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed")
    }
  }, [isAuthenticated, router])

  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)

    window.setTimeout(() => {
      const user = loginWithGoogle()
      appToast.welcome(user.name)
      router.push("/feed")
    }, 1000)
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <AppShell className="min-h-dvh">
      <PageTransition>
        <div className="flex min-h-dvh flex-col lg:flex-row">
          {/* ── Left: Form Column ── */}
          <section className="relative flex w-full flex-1 flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:flex-none lg:px-16 lg:py-0">
            {/* Branding — top left */}
            <Link
              href="/"
              className="absolute top-8 left-6 flex cursor-pointer items-center gap-2 lg:left-16 xl:left-24"
            >
              <div className="flex size-10 items-center justify-center rounded-lg overflow-hidden border border-border bg-card">
                <Image
                  src="/images/logo-icon.webp"
                  alt="NangoriansHelp Logo"
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </div>
              <span className="font-semibold text-ink">
                Nangorians<span className="text-secondary">Help</span>
              </span>
            </Link>

            {/* Centered card */}
            <div className="mx-auto w-full max-w-sm">
              <Card className="border-border shadow-e4">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Welcome to NangoriansHelp</CardTitle>
                  <CardDescription>
                    Sign in to post tasks or offer to help people nearby.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "h-11 w-full cursor-pointer bg-card text-base shadow-e2",
                      "transition-all duration-200 hover:border-primary/30",
                      isLoading && "pointer-events-none opacity-80",
                    )}
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="mr-2 size-4 animate-spin text-ink-soft" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        Continue with Google
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <p className="mt-6 text-center text-xs text-ink-soft">
                By continuing, you agree to our demo Terms of Service.
              </p>
            </div>
          </section>

          {/* ── Right: Full-bleed visual panel ── */}
          <section className="relative hidden overflow-hidden bg-ink lg:block lg:w-1/2">
            {/* Background image */}
            <StockImage
              image={STOCK_IMAGES.heroNangor}
              fill
              priority
              className="rounded-none object-cover opacity-50"
              sizes="50vw"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

            {/* Social proof content — bottom left */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-12 xl:p-16">
              <span className="inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Jatinangor Community Hub
              </span>

              <h2 className="mt-4 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Need a hand, Nangorian?
              </h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                NangoriansHelp makes everyday favors easy to ask for and
                easy to help with.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {TRUST_BULLETS.map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                      <item.icon className="size-3.5" strokeWidth={2.5} />
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </PageTransition>
    </AppShell>
  )
}
