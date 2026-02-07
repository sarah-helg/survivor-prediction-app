import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const contestants = await sql`
      SELECT * FROM contestants 
      ORDER BY 
        CASE WHEN status = 'active' THEN 0 ELSE 1 END ASC,
        name ASC
    `
    return NextResponse.json(contestants)
  } catch (error) {
    console.error("Failed to fetch contestants:", error)
    return NextResponse.json(
      { error: "Failed to fetch contestants" },
      { status: 500 }
    )
  }
}
