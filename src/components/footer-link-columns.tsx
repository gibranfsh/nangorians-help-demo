import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { footerColumns } from "@/lib/footer-data"
import { cn } from "@/lib/utils"

const footerFocusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"

const linkClassName =
  "cursor-pointer text-sm text-ink-soft transition-colors duration-200 hover:text-ink"

function FooterColumnLinks({ title, links }: (typeof footerColumns)[number]) {
  return (
    <>
      <h4 className="text-sm font-semibold tracking-wide text-ink">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={cn(linkClassName, footerFocusRing)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export function FooterLinkColumns() {
  return (
    <>
      <div className="contents md:hidden">
        {footerColumns.map((col) => (
          <details
            key={col.title}
            className="group col-span-2 border-b border-border py-3 last:border-b-0"
          >
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-ink transition-colors duration-200 [&::-webkit-details-marker]:hidden",
                footerFocusRing,
              )}
            >
              {col.title}
              <ChevronDown
                className="size-4 shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180"
                strokeWidth={1.75}
                aria-hidden
              />
            </summary>
            <ul className="mt-3 space-y-2.5 pb-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={cn(linkClassName, footerFocusRing)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="contents max-md:hidden">
        {footerColumns.map((col) => (
          <div key={col.title}>
            <FooterColumnLinks title={col.title} links={col.links} />
          </div>
        ))}
      </div>
    </>
  )
}
