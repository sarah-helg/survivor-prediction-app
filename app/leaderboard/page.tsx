import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { LeaderboardPodium } from "@/components/leaderboard-podium"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function hasEliminations() {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM contestants
    WHERE status = 'eliminated'
  `
  return result[0].count > 0
}

async function getLeaderboard() {
  const leaderboard = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      COALESCE(s.current_total, 0) as total_points,
      COALESCE(s.perfect_matches, 0) as perfect_matches
    FROM users u
    LEFT JOIN scores s ON u.id = s.user_id
    WHERE u.is_admin = false
      AND COALESCE(u.email, '') NOT IN ('test@example.com', 'demo@survivor.app', 'admin@survivor.app')
      AND u.name NOT ILIKE '%test%'
      AND u.name NOT ILIKE '%demo%'
    ORDER BY s.current_total DESC NULLS LAST, u.name ASC
  `
  return leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
  }))
}

export default async function LeaderboardPage() {
  const hasEliminationsOccurred = await hasEliminations()

  if (!hasEliminationsOccurred) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Leaderboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              See how your predictions stack up against other players
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No Eliminations Yet</CardTitle>
              <CardDescription>
                The leaderboard will appear once contestants start getting eliminated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Check back after the first Tribal Council to see how everyone's predictions are scoring!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const leaderboard = await getLeaderboard()
  const topThree = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Leaderboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how your predictions stack up against other players
          </p>
        </div>

        <LeaderboardPodium topThree={topThree} />
        <LeaderboardTable players={rest} startRank={4} />
      </main>
    </div>
  )
}
