const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

// Read DATABASE_URL from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const DATABASE_URL = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(DATABASE_URL);

async function checkEliminations() {
  console.log('\n=== Checking Eliminated Contestants ===\n');

  // Check all eliminated contestants
  const eliminated = await sql`
    SELECT id, name, status, final_rank, eliminated_at
    FROM contestants
    WHERE status = 'eliminated'
    ORDER BY eliminated_at ASC
  `;

  console.log('Eliminated contestants:');
  eliminated.forEach(c => {
    console.log(`- ${c.name}: Rank ${c.final_rank}, Eliminated at ${c.eliminated_at}`);
  });

  console.log('\n=== Checking Score History ===\n');

  // Check score history for duplicate eliminations
  const scoreHistory = await sql`
    SELECT
      sh.id,
      sh.user_id,
      u.name as user_name,
      sh.contestant_id,
      c.name as contestant_name,
      sh.points_earned,
      sh.match_type,
      sh.created_at
    FROM score_history sh
    JOIN users u ON sh.user_id = u.id
    JOIN contestants c ON sh.contestant_id = c.id
    ORDER BY sh.created_at ASC
  `;

  console.log('Score history:');
  scoreHistory.forEach(sh => {
    console.log(`- ${sh.user_name} earned ${sh.points_earned} pts for ${sh.contestant_name} (${sh.match_type}) at ${sh.created_at}`);
  });

  console.log('\n=== Current Scores ===\n');

  const scores = await sql`
    SELECT
      u.name,
      s.current_total,
      s.perfect_matches,
      s.one_off_matches,
      s.two_off_matches,
      s.top3_bonuses
    FROM scores s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.current_total DESC
  `;

  console.log('Current scores:');
  scores.forEach(s => {
    console.log(`- ${s.name}: ${s.current_total} pts (Perfect: ${s.perfect_matches}, One-off: ${s.one_off_matches}, Two-off: ${s.two_off_matches}, Top3 bonuses: ${s.top3_bonuses})`);
  });
}

checkEliminations().catch(console.error);
