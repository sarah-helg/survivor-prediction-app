import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { RankingList } from "@/components/ranking-list"
import { ScoringRules } from "@/components/scoring-rules"
import { RankingInstructions } from "@/components/ranking-instructions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

async function getContestants() {
  const contestants = await sql`
    SELECT * FROM contestants
    ORDER BY name ASC
  `
  return contestants
}

async function hasEliminations() {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM contestants
    WHERE status = 'eliminated'
  `
  return result[0].count > 0
}

export default async function RankingsPage() {
  const contestants = await getContestants()
  const seasonStarted = await hasEliminations()

  if (seasonStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Season 50 Predictions
            </h1>
            <p className="mt-2 text-balance text-muted-foreground">
              Predictions are now closed as the season has begun
            </p>
          </div>

          <Card className="border-primary/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Submissions Closed</CardTitle>
              <CardDescription>
                Season 50 has started and predictions are now locked
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Visit the <a href="/view-predictions" className="text-primary hover:underline">View Predictions</a> page to see everyone's predictions, or check the <a href="/leaderboard" className="text-primary hover:underline">Leaderboard</a> to see current standings!
              </p>
            </CardContent>
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
            Season 50 Predictions
          </h1>
          <p className="mt-2 text-balance text-muted-foreground">
            Rank all 24 contestants from Winner (Position 1) to First Out (Position 24). Submit before the season premiere!
          </p>
        </div>

        {/* Scoring Rules at the top */}
        <div className="mb-8">
          <ScoringRules />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RankingList initialContestants={contestants} />
          </div>
          <div>
            <RankingInstructions />
          </div>
        </div>
      </main>
    </div>
  )
}
