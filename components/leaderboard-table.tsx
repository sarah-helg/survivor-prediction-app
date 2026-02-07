"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Player {
  id: number
  name: string
  email: string
  total_points: number
  perfect_matches: number
  rank: number
}

interface LeaderboardTableProps {
  players: Player[]
  startRank: number
}

export function LeaderboardTable({ players, startRank }: LeaderboardTableProps) {
  if (players.length === 0) {
    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">All Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.map((player, index) => {
            const rank = startRank + index
            const trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "same"

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {rank}
                </div>

                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
                  {player.avatar_url ? (
                    <img
                      src={player.avatar_url || "/placeholder.svg"}
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-card-foreground">
                    {player.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {player.perfect_matches} perfect matches
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-accent" />
                  )}
                  {trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  {trend === "same" && (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="min-w-[60px] text-right font-semibold text-card-foreground">
                    {player.total_points} pts
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
