import Image from "next/image"

import type { StockImage } from "@/lib/images"
import { cn } from "@/lib/utils"

type StockImageProps = {
  image: StockImage
  priority?: boolean
  className?: string
  sizes?: string
  fill?: boolean
}

export function StockImage({
  image,
  priority = false,
  className,
  sizes = "100vw",
  fill = false,
}: StockImageProps) {
  if (fill) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    )
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  )
}
