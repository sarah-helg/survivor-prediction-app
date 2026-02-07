import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { AdminGate } from "@/components/admin-gate"

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
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_contestants,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'eliminated') as eliminated
    FROM contestants
  `

  const [userStats] = await sql`
    SELECT COUNT(*) as total_users FROM users WHERE is_admin = false
  `

  const [rankingStats] = await sql`
    SELECT COUNT(DISTINCT user_id) as users_with_rankings FROM rankings
  `

  return {
    totalContestants: Number(stats.total_contestants),
    activeContestants: Number(stats.active),
    eliminatedContestants: Number(stats.eliminated),
    totalUsers: Number(userStats.total_users),
    usersWithRankings: Number(rankingStats.users_with_rankings),
  }
}

export default async function AdminPage() {
  const [contestants, stats] = await Promise.all([
    getContestants(),
    getStats(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminGate contestants={contestants} stats={stats} />
      </main>
    </div>
  )
}
