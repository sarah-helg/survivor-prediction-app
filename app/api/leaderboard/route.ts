import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const leaderboard = await sql`
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        COALESCE(s.total_points, 0) as total_points,
        COALESCE(s.weekly_points, 0) as weekly_points,
        COALESCE(s.rank, 0) as rank
      FROM users u
      LEFT JOIN scores s ON u.id = s.user_id
      ORDER BY s.total_points DESC NULLS LAST, u.username ASC
    `
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
