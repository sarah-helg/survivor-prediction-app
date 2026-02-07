"use client"

import { Reorder, useDragControls } from "framer-motion"
import { GripVertical, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Contestant } from "@/lib/db"

interface DraggableContestantProps {
  contestant: Contestant
  position: number
  totalContestants?: number
}

export function DraggableContestant({
  contestant,
  position,
  totalContestants = 24,
}: DraggableContestantProps) {
  const controls = useDragControls()

  const isEliminated = contestant.status === "eliminated"

  // Position 1 = Winner, Position 24 = First out
  const getPositionLabel = () => {
    if (position === 1) return "Winner"
    if (position === 2) return "Runner-up"
    if (position === 3) return "3rd Place"
    if (position === totalContestants) return "1st Out"
    return null
  }

  const positionLabel = getPositionLabel()
  const isFinal3 = position <= 3

  return (
    <Reorder.Item
      value={contestant}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group flex items-center gap-3 rounded-lg border-l-4 bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        isFinal3 ? "border-l-primary bg-primary/5" : "border-l-border",
        isEliminated && "opacity-50",
      )}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        zIndex: 50,
      }}
      layout
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      <div
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {position}
      </div>

      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
        {contestant.image_url ? (
          <img
            src={contestant.image_url || "/placeholder.svg"}
            alt={contestant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
            {contestant.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-medium text-card-foreground",
            isEliminated && "line-through",
          )}
        >
          {contestant.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {contestant.profession || contestant.season}
        </p>
      </div>

      {positionLabel && (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            isFinal3
              ? "bg-primary/20 text-primary"
              : "bg-destructive/20 text-destructive",
          )}
        >
          {positionLabel}
        </span>
      )}

      {isEliminated && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
          <Flame className="h-3 w-3 text-destructive-foreground" />
        </div>
      )}
    </Reorder.Item>
  )
}
