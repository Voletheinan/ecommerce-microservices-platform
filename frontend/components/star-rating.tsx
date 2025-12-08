"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ rating, maxRating = 5, size = "md", interactive = false, onChange }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={cn(
            interactive && "cursor-pointer hover:scale-110 transition-transform",
            !interactive && "cursor-default",
          )}
        >
          <Star className={cn(sizeClasses[size], i < rating ? "fill-accent text-accent" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  )
}
