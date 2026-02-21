import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPlayersWithPredictions() {
  const players = await sql`
    SELECT DISTINCT u.id, u.name
    FROM users u
    INNER JOIN rankings r ON u.id = r.user_id
    WHERE u.is_admin = false
      AND COALESCE(u.email, '') NOT IN ('test@example.com', 'demo@survivor.app', 'admin@survivor.app')
      AND u.name NOT ILIKE '%test%'
      AND u.name NOT ILIKE '%demo%'
    ORDER BY u.name ASC
  `
  return players
}

async function getPlayerRankings(userId: number) {
  const rankings = await sql`
    SELECT
      r.predicted_position,
      c.name as contestant_name,
      c.profession,
      c.image_url,
      c.status,
      c.final_rank
    FROM rankings r
    JOIN contestants c ON r.contestant_id = c.id
    WHERE r.user_id = ${userId}
    ORDER BY r.predicted_position ASC
  `
  return rankings
}

export default async function ViewPredictionsPage() {
  const players = await getPlayersWithPredictions()

  // Get rankings for all players
  const playersWithRankings = await Promise.all(
    players.map(async (player) => ({
      ...player,
      rankings: await getPlayerRankings(player.id),
    }))
  )

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>View Player Predictions</CardTitle>
              <CardDescription>
                No predictions have been submitted yet
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            View Player Predictions
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how each player ranked the contestants. Once submitted, predictions are locked and cannot be changed.
          </p>
        </div>

        <Tabs defaultValue={players[0]?.id.toString()} className="w-full">
          <div className="mb-6 overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full">
              {players.map((player) => (
                <TabsTrigger
                  key={player.id}
                  value={player.id.toString()}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground min-w-[140px] px-6 py-3 text-base font-semibold"
                >
                  {player.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {playersWithRankings.map((player) => (
            <TabsContent key={player.id} value={player.id.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>{player.name}'s Predictions</CardTitle>
                  <CardDescription>
                    Position 1 = Winner, Position 24 = First Eliminated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {player.rankings.map((ranking: any) => {
                      const isEliminated = ranking.status === 'eliminated'
                      const position = ranking.predicted_position

                      // Highlight Final 3 (positions 1-3)
                      const isFinal3 = position <= 3

                      return (
                        <div
                          key={ranking.predicted_position}
                          className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                            isFinal3
                              ? 'bg-amber-500/10 border border-amber-500/20'
                              : isEliminated
                              ? 'bg-destructive/10 opacity-60'
                              : 'bg-secondary/50 hover:bg-secondary/70'
                          }`}
                        >
                          {/* Position Number */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isFinal3
                                ? 'bg-amber-500 text-amber-950'
                                : isEliminated
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            #{ranking.predicted_position}
                          </div>

                          {/* Contestant Image */}
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {ranking.image_url ? (
                              <img
                                src={ranking.image_url}
                                alt={ranking.contestant_name}
                                className={`h-full w-full object-cover ${
                                  isEliminated ? 'grayscale' : ''
                                }`}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                                {ranking.contestant_name.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Contestant Info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium text-card-foreground ${
                                isEliminated ? 'line-through' : ''
                              }`}
                            >
                              {ranking.contestant_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ranking.profession}
                            </p>
                          </div>

                          {/* Status Indicators */}
                          <div className="flex items-center gap-2 text-xs">
                            {isFinal3 && !isEliminated && (
                              <span className="rounded-full bg-amber-500/20 px-2 py-1 font-medium text-amber-700 dark:text-amber-400">
                                Final 3
                              </span>
                            )}
                            {isEliminated && ranking.final_rank && (
                              <span className="rounded-full bg-destructive/20 px-2 py-1 font-medium text-destructive">
                                Eliminated #{ranking.final_rank}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-amber-500"></div>
                  <span>Final 3 Prediction (Positions 1-3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary"></div>
                  <span>Active Contestant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-destructive"></div>
                  <span>Eliminated Contestant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
