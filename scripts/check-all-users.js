#!/usr/bin/env node

/**
 * Check all users and their predictions in the database
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(databaseUrl);

async function checkAllUsers() {
  console.log('🔍 Checking all users in database...\n');

  try {
    // Get all users
    const allUsers = await sql`SELECT * FROM users ORDER BY created_at DESC`;

    console.log(`📊 Total users: ${allUsers.length}\n`);
    console.log('─────────────────────────────────────────────');
    allUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Admin: ${user.is_admin}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });
    console.log('─────────────────────────────────────────────\n');

    // Get users with predictions
    const usersWithPredictions = await sql`
      SELECT DISTINCT u.id, u.name, u.email, COUNT(r.id) as prediction_count
      FROM users u
      INNER JOIN rankings r ON u.id = r.user_id
      WHERE u.is_admin = false
      GROUP BY u.id, u.name, u.email
      ORDER BY u.created_at DESC
    `;

    console.log(`✅ Users with predictions: ${usersWithPredictions.length}\n`);
    console.log('─────────────────────────────────────────────');
    usersWithPredictions.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Predictions: ${user.prediction_count}/24`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });
    console.log('─────────────────────────────────────────────\n');

    // Check for users WITHOUT predictions
    const usersWithoutPredictions = await sql`
      SELECT u.id, u.name, u.email
      FROM users u
      LEFT JOIN rankings r ON u.id = r.user_id
      WHERE u.is_admin = false AND r.id IS NULL
    `;

    if (usersWithoutPredictions.length > 0) {
      console.log(`⚠️  Users WITHOUT predictions: ${usersWithoutPredictions.length}\n`);
      console.log('─────────────────────────────────────────────');
      usersWithoutPredictions.forEach((user, i) => {
        console.log(`${i + 1}. ${user.name} (ID: ${user.id})`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log('');
      });
      console.log('─────────────────────────────────────────────\n');
    }

    // Get total rankings count
    const [rankingsCount] = await sql`SELECT COUNT(*) as total FROM rankings`;
    console.log(`📝 Total rankings in database: ${rankingsCount.total}\n`);

    // Check for incomplete submissions
    const incompleteSubmissions = await sql`
      SELECT u.name, COUNT(r.id) as count
      FROM users u
      INNER JOIN rankings r ON u.id = r.user_id
      GROUP BY u.id, u.name
      HAVING COUNT(r.id) < 24
    `;

    if (incompleteSubmissions.length > 0) {
      console.log(`⚠️  Incomplete submissions (less than 24 predictions):\n`);
      incompleteSubmissions.forEach(sub => {
        console.log(`   ${sub.name}: ${sub.count}/24 predictions`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAllUsers();
