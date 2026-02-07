#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function checkUser() {
  const userName = process.argv[2] || "Tom's Picks";

  console.log(`🔍 Checking predictions for: ${userName}\n`);

  try {
    // Find user
    const [user] = await sql`
      SELECT * FROM users WHERE name = ${userName}
    `;

    if (!user) {
      console.log(`❌ User "${userName}" not found\n`);

      const allUsers = await sql`SELECT name FROM users WHERE is_admin = false`;
      console.log('Available users:');
      allUsers.forEach(u => console.log(`  - ${u.name}`));
      return;
    }

    console.log(`✅ Found user: ${user.name} (ID: ${user.id})\n`);

    // Get their predictions
    const rankings = await sql`
      SELECT r.predicted_position, c.name as contestant_name
      FROM rankings r
      JOIN contestants c ON r.contestant_id = c.id
      WHERE r.user_id = ${user.id}
      ORDER BY r.predicted_position ASC
    `;

    console.log(`📊 Total predictions: ${rankings.length}/24\n`);

    if (rankings.length > 0) {
      console.log('Predictions:');
      console.log('─────────────────────────────────────────────');
      rankings.forEach(r => {
        console.log(`  #${r.predicted_position}: ${r.contestant_name}`);
      });
      console.log('─────────────────────────────────────────────\n');
    } else {
      console.log('⚠️  No predictions found for this user!\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();
