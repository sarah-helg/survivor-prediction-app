import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const name = searchParams.get("name")

    // If no params, return all users who have submitted predictions
    if (!userId && !name) {
      const users = await sql`
        SELECT DISTINCT u.id, u.name
        FROM users u
        INNER JOIN rankings r ON u.id = r.user_id
        WHERE u.is_admin = false
        ORDER BY u.name ASC
      `
      return NextResponse.json(users)
    }

    let rankings
    if (name) {
      rankings = await sql`
        SELECT r.*, c.name as contestant_name, c.season, c.profession, c.image_url, c.status, c.final_rank
        FROM rankings r
        JOIN contestants c ON r.contestant_id = c.id
        JOIN users u ON r.user_id = u.id
        WHERE u.name = ${name}
        ORDER BY r.predicted_position ASC
      `
    } else {
      rankings = await sql`
        SELECT r.*, c.name as contestant_name, c.season, c.profession, c.image_url, c.status, c.final_rank
        FROM rankings r
        JOIN contestants c ON r.contestant_id = c.id
        WHERE r.user_id = ${userId}
        ORDER BY r.predicted_position ASC
      `
    }

    return NextResponse.json(rankings)
  } catch (error) {
    console.error("Failed to fetch rankings:", error)
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { playerName, rankings } = await request.json()

    if (!playerName || !rankings) {
      return NextResponse.json(
        { error: "Name and rankings are required" },
        { status: 400 },
      )
    }

    // Check if a user with this name already submitted
    const [existingUser] = await sql`
      SELECT u.id FROM users u
      INNER JOIN rankings r ON u.id = r.user_id
      WHERE LOWER(u.name) = LOWER(${playerName})
      LIMIT 1
    `

    if (existingUser) {
      return NextResponse.json(
        { error: "Someone with that name has already submitted predictions. If this is you, your picks are already locked in!" },
        { status: 400 },
      )
    }

    // Create new user (name only, no email required)
    const [newUser] = await sql`
      INSERT INTO users (name, is_admin)
      VALUES (${playerName}, false)
      RETURNING id
    `
    const userId = newUser.id

    // Insert all 24 rankings
    for (const ranking of rankings) {
      await sql`
        INSERT INTO rankings (user_id, contestant_id, predicted_position)
        VALUES (${userId}, ${ranking.contestantId}, ${ranking.position})
      `
    }

    // Initialize score record
    await sql`
      INSERT INTO scores (user_id, current_total, perfect_matches, one_off_matches, two_off_matches, top3_bonuses)
      VALUES (${userId}, 0, 0, 0, 0, 0)
      ON CONFLICT (user_id) DO NOTHING
    `

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("Failed to save rankings:", error)
    return NextResponse.json(
      { error: "Failed to save rankings" },
      { status: 500 },
    )
  }
}
