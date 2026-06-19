export type StockImage = {
  src: string
  alt: string
  width: number
  height: number
}

export const STOCK_IMAGES = {
  heroNangor: {
    src: "/images/hero-nangor.webp",
    alt: "Vibrant community street in Jatinangor with university students and locals",
    width: 1200,
    height: 800,
  },
  foodRun: {
    src: "/images/food-run.webp",
    alt: "Picking up takeaway food in Jatinangor",
    width: 1200,
    height: 800,
  },
  tutoring: {
    src: "/images/tutoring.webp",
    alt: "Students studying together in a Jatinangor cafe",
    width: 1200,
    height: 1109,
  },
  moving: {
    src: "/images/moving.webp",
    alt: "Helping move luggage near boarding houses in Jatinangor",
    width: 1200,
    height: 800,
  },
  generalTask: {
    src: "/images/general-task.webp",
    alt: "Using smartphone in Jatinangor town square",
    width: 1200,
    height: 800,
  },
  postTask: {
    src: "/images/post-task.webp",
    alt: "Creating a favor request in Jatinangor",
    width: 1200,
    height: 800,
  },
} as const satisfies Record<string, StockImage>

export type StockImageKey = keyof typeof STOCK_IMAGES

const CATEGORY_IMAGE_MAP: Record<string, StockImageKey> = {
  "Food run": "foodRun",
  Tutoring: "tutoring",
  Moving: "moving",
  General: "generalTask",
}

export function getCategoryImage(category: string): StockImage {
  const key = CATEGORY_IMAGE_MAP[category] ?? "generalTask"
  return STOCK_IMAGES[key]
}
