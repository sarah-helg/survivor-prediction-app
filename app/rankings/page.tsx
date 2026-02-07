import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { RankingList } from "@/components/ranking-list"
import { ScoringRules } from "@/components/scoring-rules"
import { RankingInstructions } from "@/components/ranking-instructions"

async function getContestants() {
  const contestants = await sql`
    SELECT * FROM contestants 
    ORDER BY name ASC
  `
  return contestants
}

export default async function RankingsPage() {
  const contestants = await getContestants()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Season 50 Predictions
          </h1>
          <p className="mt-2 text-balance text-muted-foreground">
            Rank all 24 contestants before the season premiere. Position 1 = Sole
            Survivor (Winner). Position 24 = First Voted Out. Predictions lock
            once submitted and cannot be changed.
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
