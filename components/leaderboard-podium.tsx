"use client"

import { motion } from "framer-motion"
import { Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Player {
  id: number
  name: string
  email: string
  total_points: number
  perfect_matches: number
  rank: number
}

interface LeaderboardPodiumProps {
  topThree: Player[]
}

export function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  if (topThree.length === 0) {
    return (
      <div className="mb-8 rounded-xl border border-border bg-card p-12 text-center">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          No players yet. Be the first to submit your predictions!
        </p>
      </div>
    )
  }

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [
    topThree[1],
    topThree[0],
    topThree[2],
  ].filter(Boolean)

  const podiumConfig = [
    { height: "h-24", delay: 0.2, color: "bg-gray-400", position: "2nd" },
    { height: "h-32", delay: 0, color: "bg-primary", position: "1st" },
    { height: "h-20", delay: 0.4, color: "bg-amber-700", position: "3rd" },
  ]

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6">
      <div className="flex items-end justify-center gap-4">
        {podiumOrder.map((player, index) => {
          const config = podiumConfig[index]
          if (!player) return null

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: config.delay, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: config.delay + 0.3, type: "spring" }}
                className="mb-3"
              >
                <div className="relative">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary bg-secondary">
                    {player.avatar_url ? (
                      <img
                        src={player.avatar_url || "/placeholder.svg"}
                        alt={player.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {index === 1 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="absolute -top-3 -right-3"
                    >
                      <Trophy className="h-6 w-6 text-primary" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <p className="mb-1 max-w-[80px] truncate text-center text-sm font-semibold text-card-foreground">
                {player.name}
              </p>
              <p className="mb-2 text-xs text-muted-foreground">
                {player.total_points} pts
              </p>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ delay: config.delay + 0.1, duration: 0.4 }}
                className={cn(
                  "flex w-20 items-end justify-center rounded-t-lg",
                  config.color,
                  config.height
                )}
              >
                <span className="pb-2 text-lg font-bold text-white">
                  {config.position}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
