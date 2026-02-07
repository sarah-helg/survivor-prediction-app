import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { contestantId, finalRank } = await request.json()

    if (!contestantId) {
      return NextResponse.json(
        { error: "Contestant ID is required" },
        { status: 400 }
      )
    }

    if (!finalRank) {
      return NextResponse.json(
        { error: "Final rank is required to calculate scores" },
        { status: 400 }
      )
    }

    // Mark contestant as eliminated
    await sql`
      UPDATE contestants 
      SET status = 'eliminated', final_rank = ${finalRank}, eliminated_at = NOW()
      WHERE id = ${contestantId}
    `

    // Get total contestants for Final 3 calculation
    const [contestantCount] = await sql`
      SELECT COUNT(*) as total FROM contestants
    `
    const totalContestants = Number(contestantCount.total)
    const isFinal3 = finalRank <= 3 // Positions 1, 2, 3 are the Final 3 (Winner, Runner-up, 3rd place)

    // Calculate scores for all users based on their predictions
    const users = await sql`SELECT id FROM users WHERE is_admin = false`
    
    for (const user of users) {
      // Get user's ranking prediction for this contestant
      const [ranking] = await sql`
        SELECT predicted_position FROM rankings 
        WHERE user_id = ${user.id} 
          AND contestant_id = ${contestantId}
      `

      if (ranking) {
        const predictedPosition = ranking.predicted_position
        const actualPosition = finalRank
        const difference = Math.abs(predictedPosition - actualPosition)
        
        // Scoring system:
        // - Exact match: 5 points
        // - One off: 3 points
        // - Two off: 1 point
        // - Final 3 bonus: +5 points if contestant is in final 3 AND player predicted them in final 3
        let points = 0
        let matchType: string | null = null

        if (difference === 0) {
          points = 5 // Exact match
          matchType = 'perfect'
        } else if (difference === 1) {
          points = 3 // One position off
          matchType = 'one_off'
        } else if (difference === 2) {
          points = 1 // Two positions off
          matchType = 'two_off'
        }

        // Final 3 bonus: if contestant finished in final 3 AND player predicted them in final 3
        let final3Bonus = 0
        const playerPredictedFinal3 = predictedPosition <= 3
        if (isFinal3 && playerPredictedFinal3) {
          final3Bonus = 5
        }

        const totalPoints = points + final3Bonus

        if (totalPoints > 0) {
          // Update or insert score
          await sql`
            INSERT INTO scores (user_id, current_total, perfect_matches, one_off_matches, two_off_matches, top3_bonuses)
            VALUES (
              ${user.id}, 
              ${totalPoints}, 
              ${matchType === 'perfect' ? 1 : 0},
              ${matchType === 'one_off' ? 1 : 0},
              ${matchType === 'two_off' ? 1 : 0},
              ${final3Bonus > 0 ? 1 : 0}
            )
            ON CONFLICT (user_id) 
            DO UPDATE SET 
              current_total = scores.current_total + ${totalPoints},
              perfect_matches = scores.perfect_matches + ${matchType === 'perfect' ? 1 : 0},
              one_off_matches = scores.one_off_matches + ${matchType === 'one_off' ? 1 : 0},
              two_off_matches = scores.two_off_matches + ${matchType === 'two_off' ? 1 : 0},
              top3_bonuses = scores.top3_bonuses + ${final3Bonus > 0 ? 1 : 0},
              updated_at = NOW()
          `

          // Record in score history
          await sql`
            INSERT INTO score_history (user_id, points_earned, contestant_id, match_type)
            VALUES (${user.id}, ${totalPoints}, ${contestantId}, ${matchType || 'final3_only'})
          `
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to process elimination:", error)
    return NextResponse.json(
      { error: "Failed to process elimination" },
      { status: 500 }
    )
  }
}
