#!/usr/bin/env node

/**
 * Check current scores and predictions for test user
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function checkScores() {
  console.log('📊 Checking Test User Scores\n');

  try {
    // Find test user
    const [testUser] = await sql`
      SELECT id, name FROM users WHERE email = 'test@example.com'
    `;

    if (!testUser) {
      console.log('ℹ️  No test user found. Run: node scripts/test-scoring.js\n');
      return;
    }

    console.log(`User: ${testUser.name} (ID: ${testUser.id})\n`);

    // Get score
    const [score] = await sql`
      SELECT * FROM scores WHERE user_id = ${testUser.id}
    `;

    if (score) {
      console.log('🏆 Current Score:');
      console.log('─────────────────────────────────────────────');
      console.log(`   Total Points: ${score.current_total}`);
      console.log(`   Perfect Matches: ${score.perfect_matches} (${score.perfect_matches * 5} pts)`);
      console.log(`   One-Off Matches: ${score.one_off_matches} (${score.one_off_matches * 3} pts)`);
      console.log(`   Two-Off Matches: ${score.two_off_matches} (${score.two_off_matches * 1} pts)`);
      console.log(`   Top 3 Bonuses: ${score.top3_bonuses} (${score.top3_bonuses * 5} pts)`);
      console.log('─────────────────────────────────────────────\n');
    } else {
      console.log('   No scores yet (no eliminations processed)\n');
    }

    // Get score history
    const history = await sql`
      SELECT sh.*, c.name as contestant_name, c.final_rank
      FROM score_history sh
      JOIN contestants c ON sh.contestant_id = c.id
      WHERE sh.user_id = ${testUser.id}
      ORDER BY sh.created_at DESC
    `;

    if (history.length > 0) {
      console.log('📜 Score History:');
      console.log('─────────────────────────────────────────────');
      history.forEach((h, i) => {
        console.log(`   ${i + 1}. ${h.contestant_name} (Rank #${h.final_rank})`);
        console.log(`      Points: ${h.points_earned} | Type: ${h.match_type}`);
      });
      console.log('─────────────────────────────────────────────\n');
    }

    // Get predictions vs actuals for eliminated contestants
    const eliminatedWithPredictions = await sql`
      SELECT
        c.name,
        c.final_rank,
        r.predicted_position,
        c.final_rank - r.predicted_position as difference
      FROM contestants c
      LEFT JOIN rankings r ON c.id = r.contestant_id AND r.user_id = ${testUser.id}
      WHERE c.status = 'eliminated' AND c.season = 'Season 50'
      ORDER BY c.final_rank ASC
    `;

    if (eliminatedWithPredictions.length > 0) {
      console.log('🎯 Eliminated Contestants - Prediction Accuracy:');
      console.log('─────────────────────────────────────────────');
      eliminatedWithPredictions.forEach(c => {
        const diff = Math.abs(c.difference || 0);
        let accuracy = '❌ More than 2 off';
        if (diff === 0) accuracy = '🎯 EXACT MATCH!';
        else if (diff === 1) accuracy = '📍 One off';
        else if (diff === 2) accuracy = '📌 Two off';

        console.log(`   ${c.name}`);
        console.log(`      Predicted: #${c.predicted_position || 'N/A'} | Actual: #${c.final_rank} | ${accuracy}`);
      });
      console.log('─────────────────────────────────────────────\n');
    }

    // Show active predictions
    const activePredictions = await sql`
      SELECT c.name, r.predicted_position
      FROM rankings r
      JOIN contestants c ON r.contestant_id = c.id
      WHERE r.user_id = ${testUser.id} AND c.status = 'active'
      ORDER BY r.predicted_position ASC
      LIMIT 10
    `;

    if (activePredictions.length > 0) {
      console.log('📋 Active Predictions (Top 10):');
      console.log('─────────────────────────────────────────────');
      activePredictions.forEach(p => {
        console.log(`   #${p.predicted_position}: ${p.name}`);
      });
      if (activePredictions.length === 10) {
        console.log('   ... (more predictions not shown)');
      }
      console.log('─────────────────────────────────────────────\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkScores();
