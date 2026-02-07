#!/usr/bin/env node

/**
 * Test script for creating a test user with predictions
 * This helps test the scoring algorithm
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function createTestUser() {
  console.log('🧪 Creating test user and predictions...\n');

  try {
    // Get all active contestants
    const contestants = await sql`
      SELECT id, name FROM contestants
      WHERE season = 'Season 50' AND status = 'active'
      ORDER BY id ASC
    `;

    if (contestants.length === 0) {
      console.log('❌ No active contestants found!');
      return;
    }

    console.log(`Found ${contestants.length} active contestants\n`);

    // Check if test user exists
    let testUser = (await sql`
      SELECT id, name FROM users WHERE email = 'test@example.com'
    `)[0];

    // Create test user if doesn't exist
    if (!testUser) {
      testUser = (await sql`
        INSERT INTO users (name, email, is_admin)
        VALUES ('Test Player', 'test@example.com', false)
        RETURNING id, name
      `)[0];
      console.log(`✅ Created test user: ${testUser.name} (ID: ${testUser.id})\n`);
    } else {
      console.log(`✅ Found existing test user: ${testUser.name} (ID: ${testUser.id})\n`);
    }

    // Delete any existing rankings for this test user
    await sql`DELETE FROM rankings WHERE user_id = ${testUser.id}`;
    await sql`DELETE FROM scores WHERE user_id = ${testUser.id}`;
    await sql`DELETE FROM score_history WHERE user_id = ${testUser.id}`;

    console.log('🗑️  Cleared any existing test predictions\n');

    // Create simple test predictions: rank contestants in order of their ID
    console.log('📝 Creating test predictions (simple順序: contestant ID = predicted position)...\n');

    for (let i = 0; i < contestants.length; i++) {
      const contestant = contestants[i];
      const predictedPosition = i + 1; // Position 1-24

      await sql`
        INSERT INTO rankings (user_id, contestant_id, predicted_position)
        VALUES (${testUser.id}, ${contestant.id}, ${predictedPosition})
      `;

      if (i < 5 || i >= contestants.length - 3) {
        console.log(`   Position #${predictedPosition}: ${contestant.name}`);
      } else if (i === 5) {
        console.log(`   ... (${contestants.length - 8} more) ...`);
      }
    }

    // Initialize score record
    await sql`
      INSERT INTO scores (user_id, current_total, perfect_matches, one_off_matches, two_off_matches, top3_bonuses)
      VALUES (${testUser.id}, 0, 0, 0, 0, 0)
      ON CONFLICT (user_id) DO NOTHING
    `;

    console.log('\n✅ Test predictions created!\n');

    // Show summary
    console.log('📊 Test Setup Summary:');
    console.log('─────────────────────────────────────────────');
    console.log(`   User: ${testUser.name}`);
    console.log(`   User ID: ${testUser.id}`);
    console.log(`   Total predictions: ${contestants.length}`);
    console.log(`   Strategy: Each contestant ID matches their predicted position`);
    console.log('─────────────────────────────────────────────\n');

    console.log('🎯 Next Steps to Test Scoring:');
    console.log('   1. Go to http://localhost:3000/admin');
    console.log('   2. Pick a contestant to eliminate');
    console.log('   3. Set their final rank to test scoring:');
    console.log('      - Set rank = predicted position → 5 points (exact match)');
    console.log('      - Set rank ± 1 from prediction → 3 points (one off)');
    console.log('      - Set rank ± 2 from prediction → 1 point (two off)');
    console.log('   4. Check leaderboard at http://localhost:3000/leaderboard');
    console.log('   5. Run cleanup script when done: node scripts/cleanup-test.js\n');

    console.log('💡 Example test scenarios:');
    const exampleContestant = contestants[10]; // Example: 11th contestant
    console.log(`   - Eliminate "${exampleContestant.name}"`);
    console.log(`   - Their predicted position: #11`);
    console.log(`   - Set final rank to #11 → Expect 5 points (exact match)`);
    console.log(`   - Or set final rank to #10 or #12 → Expect 3 points (one off)`);
    console.log(`   - Or set final rank to #9 or #13 → Expect 1 point (two off)\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
