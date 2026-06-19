export type FooterLink = {
  label: string
  href: string
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Categories",
    links: [
      { label: "Food runs", href: "/feed" },
      { label: "Tutoring", href: "/feed" },
      { label: "Moving", href: "/feed" },
      { label: "Tech help", href: "/feed" },
      { label: "Laundry", href: "/feed" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "How it works", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Guidelines", href: "#" },
    ],
  },
]

export const trustMetrics = [
  { value: "12+", label: "Open tasks" },
  { value: "500+", label: "Nangorians in the community" },
  { value: "4.9", label: "Avg helper rating" },
]
