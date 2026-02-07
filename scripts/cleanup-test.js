#!/usr/bin/env node

/**
 * Cleanup script to remove test data and reset eliminated contestants
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function cleanup() {
  console.log('🧹 Cleaning up test data...\n');

  try {
    // Find test user
    const [testUser] = await sql`
      SELECT id, name FROM users WHERE email = 'test@example.com'
    `;

    if (!testUser) {
      console.log('ℹ️  No test user found. Nothing to clean up.');
      return;
    }

    console.log(`Found test user: ${testUser.name} (ID: ${testUser.id})\n`);

    // Delete test user's data (cascades to rankings via foreign key)
    console.log('🗑️  Deleting test user rankings...');
    await sql`DELETE FROM rankings WHERE user_id = ${testUser.id}`;

    console.log('🗑️  Deleting test user scores...');
    await sql`DELETE FROM scores WHERE user_id = ${testUser.id}`;

    console.log('🗑️  Deleting test user score history...');
    await sql`DELETE FROM score_history WHERE user_id = ${testUser.id}`;

    console.log('🗑️  Deleting test user...');
    await sql`DELETE FROM users WHERE id = ${testUser.id}`;

    // Ask if we should reset eliminated contestants
    console.log('\n📋 Checking for eliminated contestants...');
    const eliminatedContestants = await sql`
      SELECT id, name, final_rank FROM contestants
      WHERE season = 'Season 50' AND status = 'eliminated'
      ORDER BY final_rank ASC
    `;

    if (eliminatedContestants.length > 0) {
      console.log(`\nFound ${eliminatedContestants.length} eliminated contestant(s):`);
      eliminatedContestants.forEach(c => {
        console.log(`   - ${c.name} (Rank #${c.final_rank})`);
      });

      console.log('\n🔄 Resetting all eliminated contestants to active status...');
      await sql`
        UPDATE contestants
        SET status = 'active',
            final_rank = NULL,
            eliminated_at = NULL
        WHERE season = 'Season 50' AND status = 'eliminated'
      `;
      console.log('✅ All contestants reset to active!\n');
    } else {
      console.log('   No eliminated contestants found.\n');
    }

    // Verify cleanup
    const remainingTestUsers = await sql`
      SELECT COUNT(*) as count FROM users WHERE email = 'test@example.com'
    `;
    const activeCount = await sql`
      SELECT COUNT(*) as count FROM contestants WHERE season = 'Season 50' AND status = 'active'
    `;

    console.log('✅ Cleanup complete!\n');
    console.log('📊 Current state:');
    console.log('─────────────────────────────────────────────');
    console.log(`   Test users remaining: ${remainingTestUsers[0].count}`);
    console.log(`   Active contestants: ${activeCount[0].count}`);
    console.log('─────────────────────────────────────────────\n');

    console.log('🎯 Ready for fresh testing!');
    console.log('   Run: node scripts/test-scoring.js\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();
