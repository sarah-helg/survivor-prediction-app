#!/usr/bin/env node

/**
 * Undo the most recent elimination (or a specific one)
 * This reverses the contestant status and score changes
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function undoElimination(contestantId = null) {
  console.log('↩️  Undoing Elimination\n');

  try {
    // If no ID provided, get the most recently eliminated contestant
    let contestant;
    if (contestantId) {
      [contestant] = await sql`
        SELECT id, name, final_rank, eliminated_at
        FROM contestants
        WHERE id = ${contestantId} AND status = 'eliminated'
      `;
    } else {
      [contestant] = await sql`
        SELECT id, name, final_rank, eliminated_at
        FROM contestants
        WHERE status = 'eliminated' AND season = 'Season 50'
        ORDER BY eliminated_at DESC
        LIMIT 1
      `;
    }

    if (!contestant) {
      console.log('❌ No eliminated contestant found to undo.');
      if (contestantId) {
        console.log(`   Contestant ID ${contestantId} is not eliminated or doesn't exist.`);
      }
      return;
    }

    console.log(`Found eliminated contestant:`);
    console.log(`   Name: ${contestant.name}`);
    console.log(`   Final Rank: #${contestant.final_rank}`);
    console.log(`   Eliminated: ${new Date(contestant.eliminated_at).toLocaleString()}\n`);

    // Get score history entries for this elimination
    const scoreHistory = await sql`
      SELECT user_id, points_earned, match_type
      FROM score_history
      WHERE contestant_id = ${contestant.id}
    `;

    console.log(`Found ${scoreHistory.length} score entries to reverse\n`);

    // Reverse scores for each affected user
    if (scoreHistory.length > 0) {
      console.log('🔄 Reversing scores...');

      for (const entry of scoreHistory) {
        const pointsToDeduct = entry.points_earned;

        // Determine match type counters to decrement
        let perfectDec = 0, oneOffDec = 0, twoOffDec = 0, top3Dec = 0;

        if (entry.match_type === 'perfect') perfectDec = 1;
        else if (entry.match_type === 'one_off') oneOffDec = 1;
        else if (entry.match_type === 'two_off') twoOffDec = 1;

        // Check if there was a top3 bonus (points > base match points)
        if (entry.match_type === 'perfect' && pointsToDeduct > 5) top3Dec = 1;
        else if (entry.match_type === 'one_off' && pointsToDeduct > 3) top3Dec = 1;
        else if (entry.match_type === 'two_off' && pointsToDeduct > 1) top3Dec = 1;
        else if (entry.match_type === 'final3_only') top3Dec = 1;

        // Update scores
        await sql`
          UPDATE scores
          SET
            current_total = GREATEST(current_total - ${pointsToDeduct}, 0),
            perfect_matches = GREATEST(perfect_matches - ${perfectDec}, 0),
            one_off_matches = GREATEST(one_off_matches - ${oneOffDec}, 0),
            two_off_matches = GREATEST(two_off_matches - ${twoOffDec}, 0),
            top3_bonuses = GREATEST(top3_bonuses - ${top3Dec}, 0),
            updated_at = NOW()
          WHERE user_id = ${entry.user_id}
        `;

        console.log(`   ✓ Deducted ${pointsToDeduct} points from user ${entry.user_id}`);
      }

      // Delete score history entries
      await sql`
        DELETE FROM score_history
        WHERE contestant_id = ${contestant.id}
      `;

      console.log(`\n✅ Reversed ${scoreHistory.length} score changes\n`);
    }

    // Reset contestant to active status
    console.log('🔄 Resetting contestant to active status...');
    await sql`
      UPDATE contestants
      SET
        status = 'active',
        final_rank = NULL,
        eliminated_at = NULL
      WHERE id = ${contestant.id}
    `;

    console.log(`✅ ${contestant.name} is now active again!\n`);

    // Show current state
    const activeCount = await sql`
      SELECT COUNT(*) as count FROM contestants WHERE season = 'Season 50' AND status = 'active'
    `;
    const eliminatedCount = await sql`
      SELECT COUNT(*) as count FROM contestants WHERE season = 'Season 50' AND status = 'eliminated'
    `;

    console.log('📊 Current State:');
    console.log('─────────────────────────────────────────────');
    console.log(`   Active contestants: ${activeCount[0].count}`);
    console.log(`   Eliminated contestants: ${eliminatedCount[0].count}`);
    console.log('─────────────────────────────────────────────\n');

    console.log('✨ Elimination undone successfully!');
    console.log('   Refresh your browser to see the changes.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get contestant ID from command line args if provided
const contestantId = process.argv[2] ? parseInt(process.argv[2]) : null;

if (contestantId && isNaN(contestantId)) {
  console.log('Usage: node scripts/undo-elimination.js [contestant_id]');
  console.log('   If no ID provided, undoes the most recent elimination\n');
  process.exit(1);
}

undoElimination(contestantId);
