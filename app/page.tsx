import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { ContestantGrid } from "@/components/contestant-grid"
import { StatsCards } from "@/components/stats-cards"
import { QuickActions } from "@/components/quick-actions"

async function getContestants() {
  const contestants = await sql`
    SELECT * FROM contestants 
    ORDER BY 
      CASE WHEN status = 'active' THEN 0 ELSE 1 END ASC,
      name ASC
  `
  return contestants
}

async function getStats() {
  const [contestantStats] = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as remaining,
      COUNT(*) FILTER (WHERE status = 'eliminated') as eliminated
    FROM contestants
  `

  const [userCount] = await sql`
    SELECT COUNT(*) as total FROM users
  `

  return {
    totalContestants: Number(contestantStats.total),
    remainingContestants: Number(contestantStats.remaining),
    eliminatedContestants: Number(contestantStats.eliminated),
    totalUsers: Number(userCount.total),
  }
}

export default async function DashboardPage() {
  const [contestants, stats] = await Promise.all([
    getContestants(),
    getStats(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Season 48 Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track contestants, manage your predictions, and compete for the top spot.
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContestantGrid contestants={contestants} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
