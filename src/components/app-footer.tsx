import Link from "next/link"

import { FooterLinkColumns } from "@/components/footer-link-columns"
import { FooterSocialIcons } from "@/components/footer-social-icons"
import { PageContainer } from "@/components/page-container"
import { trustMetrics } from "@/lib/footer-data"
import { cn } from "@/lib/utils"

const footerFocusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"

export function AppFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full bg-surface-raised border-t border-border", className)} role="contentinfo">
      <div className="border-b border-border bg-primary/5 py-3">
        <PageContainer>
          <p className="text-center text-xs font-semibold text-ink-soft">
            Trusted by neighbors in Jatinangor
          </p>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-3 md:gap-8 md:py-12 lg:grid-cols-6 lg:gap-12 lg:py-16">
          <div className="col-span-2">
            <Link
              href="/feed"
              className={cn(
                "inline-flex cursor-pointer items-center gap-0.5",
                footerFocusRing,
              )}
            >
              <span className="text-2xl font-bold tracking-tight text-ink">
                Nangorians
              </span>
              <span className="text-2xl font-bold tracking-tight text-secondary">
                Help
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              The local marketplace for Jatinangor people who need a hand.
            </p>

            <div className="mt-6 flex gap-4">
              {trustMetrics.map((metric) => (
                <div key={metric.label} className="shrink-0">
                  <span className="tabular-nums text-lg font-bold text-ink">
                    {metric.value}
                  </span>
                  <p className="text-xs text-ink-soft">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <FooterLinkColumns />
        </div>

        <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-ink-soft">
              © 2026 NangoriansHelp. Built with care for the Jatinangor community.
            </p>
            <FooterSocialIcons />
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
