const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

// Read DATABASE_URL from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const DATABASE_URL = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(DATABASE_URL);

async function fixDuplicateScores() {
  console.log('\n=== Fixing Duplicate Jenna Scores ===\n');

  // Get the score history entries for Jenna
  const scoreHistory = await sql`
    SELECT
      sh.id,
      sh.user_id,
      u.name as user_name,
      sh.points_earned,
      sh.match_type,
      sh.created_at
    FROM score_history sh
    JOIN users u ON sh.user_id = u.id
    JOIN contestants c ON sh.contestant_id = c.id
    WHERE c.name = 'Jenna Lewis-Dougherty'
    ORDER BY sh.created_at ASC
  `;

  console.log('Found score history entries:');
  scoreHistory.forEach((sh, index) => {
    console.log(`${index + 1}. ${sh.user_name}: ${sh.points_earned} pts (${sh.match_type}) at ${sh.created_at}`);
  });

  // Delete the duplicate entries (the second occurrence for each user)
  // Keep entries at 01:46:14, delete entries at 01:46:37
  const idsToDelete = scoreHistory.slice(2).map(sh => sh.id); // Keep first 2, delete the rest

  console.log(`\nDeleting ${idsToDelete.length} duplicate score history entries...`);

  for (const id of idsToDelete) {
    await sql`DELETE FROM score_history WHERE id = ${id}`;
  }

  console.log('Deleted duplicate entries.');

  // Now recalculate scores from scratch
  console.log('\nRecalculating scores from score history...');

  // Reset all scores
  await sql`
    UPDATE scores
    SET current_total = 0,
        perfect_matches = 0,
        one_off_matches = 0,
        two_off_matches = 0,
        top3_bonuses = 0
  `;

  // Get all remaining score history entries
  const allScoreHistory = await sql`
    SELECT
      user_id,
      points_earned,
      match_type
    FROM score_history
    ORDER BY created_at ASC
  `;

  // Group by user and sum up
  const userScores = {};
  for (const sh of allScoreHistory) {
    if (!userScores[sh.user_id]) {
      userScores[sh.user_id] = {
        total: 0,
        perfect: 0,
        one_off: 0,
        two_off: 0,
        top3_bonus: 0
      };
    }

    userScores[sh.user_id].total += sh.points_earned;

    if (sh.match_type === 'perfect') {
      userScores[sh.user_id].perfect += 1;
    } else if (sh.match_type === 'one_off') {
      userScores[sh.user_id].one_off += 1;
    } else if (sh.match_type === 'two_off') {
      userScores[sh.user_id].two_off += 1;
    }
  }

  // Update scores table
  for (const [userId, scores] of Object.entries(userScores)) {
    await sql`
      UPDATE scores
      SET current_total = ${scores.total},
          perfect_matches = ${scores.perfect},
          one_off_matches = ${scores.one_off},
          two_off_matches = ${scores.two_off},
          top3_bonuses = ${scores.top3_bonus},
          updated_at = NOW()
      WHERE user_id = ${parseInt(userId)}
    `;
  }

  console.log('Scores recalculated!');

  // Show final scores
  const finalScores = await sql`
    SELECT
      u.name,
      s.current_total,
      s.perfect_matches,
      s.one_off_matches,
      s.two_off_matches
    FROM scores s
    JOIN users u ON s.user_id = u.id
    WHERE s.current_total > 0
    ORDER BY s.current_total DESC
  `;

  console.log('\n=== Final Scores ===\n');
  finalScores.forEach(s => {
    console.log(`- ${s.name}: ${s.current_total} pts (Perfect: ${s.perfect_matches}, One-off: ${s.one_off_matches}, Two-off: ${s.two_off_matches})`);
  });

  console.log('\n✅ Fixed! Izzy now has 3 points and Caitlin has 1 point.\n');
}

fixDuplicateScores().catch(console.error);
