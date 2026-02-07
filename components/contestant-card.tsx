"use client"

import Image from "next/image"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Contestant } from "@/lib/db"

interface ContestantCardProps {
  contestant: Contestant
  rank?: number
  showRank?: boolean
  size?: "sm" | "md" | "lg"
}

export function ContestantCard({
  contestant,
  rank,
  showRank = false,
  size = "md",
}: ContestantCardProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-20 w-20",
    lg: "h-24 w-24",
  }

  const isEliminated = contestant.status === 'eliminated'

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all",
        isEliminated
          ? "opacity-60 grayscale"
          : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {showRank && rank !== undefined && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {rank}
        </div>
      )}

      <div className="relative">
        <div
          className={cn(
            "relative overflow-hidden rounded-full border-2",
            isEliminated ? "border-eliminated" : "border-primary/50",
            sizeClasses[size]
          )}
        >
          {contestant.image_url ? (
            <Image
              src={contestant.image_url || "/placeholder.svg"}
              alt={contestant.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-muted-foreground">
              {contestant.name.charAt(0)}
            </div>
          )}
        </div>

        {isEliminated && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
            <Flame className="h-3 w-3 text-destructive-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "truncate font-semibold text-card-foreground",
            isEliminated && "line-through"
          )}
        >
          {contestant.name}
          {contestant.age && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({contestant.age})
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{contestant.profession || contestant.season}</p>
        {contestant.bio && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {contestant.bio}
          </p>
        )}
        {isEliminated && contestant.final_rank && (
          <p className="mt-1 text-xs text-muted-foreground">
            Eliminated (Rank #{contestant.final_rank})
          </p>
        )}
      </div>
    </div>
  )
}
