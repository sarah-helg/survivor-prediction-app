import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { AdminGate } from "@/components/admin-gate"

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  const [rankingStats] = await sql`
    SELECT COUNT(DISTINCT u.id) as users_with_rankings
    FROM users u
    INNER JOIN rankings r ON u.id = r.user_id
    WHERE u.is_admin = false
      AND COALESCE(u.email, '') NOT IN ('test@example.com', 'demo@survivor.app', 'admin@survivor.app')
      AND u.name NOT ILIKE '%test%'
      AND u.name NOT ILIKE '%demo%'
  `

  return {
    totalContestants: Number(stats.total_contestants),
    activeContestants: Number(stats.active),
    eliminatedContestants: Number(stats.eliminated),
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
