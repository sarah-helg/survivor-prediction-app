#!/usr/bin/env node

/**
 * Script to update Neon database with Survivor 50 contestants
 * Usage: node scripts/run-contestant-update.js
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function runUpdate() {
  // Check for DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not found in environment variables');
    console.log('Please make sure you have a .env file with your DATABASE_URL');
    process.exit(1);
  }

  console.log('🔌 Connecting to Neon database...\n');

  const sql = neon(databaseUrl);

  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'survivor-50-contestants.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 Reading SQL file: survivor-50-contestants.sql\n');

    // Split by semicolons to execute statements separately
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('🗑️  Deleting old fictional contestants...\n');

    // Execute DELETE statement
    const deleteStmt = statements.find(stmt => stmt.toUpperCase().startsWith('DELETE'));
    if (deleteStmt) {
      const deleteResult = await sql(deleteStmt);
      console.log(`✅ Deleted old contestants\n`);
    }

    console.log('➕ Inserting Survivor 50 contestants...\n');

    // Execute INSERT statement
    const insertStmt = statements.find(stmt => stmt.toUpperCase().startsWith('INSERT'));
    if (insertStmt) {
      // Show first 200 chars of INSERT to debug
      console.log('First 200 chars of INSERT statement:');
      console.log(insertStmt.substring(0, 200) + '...\n');

      const insertResult = await sql(insertStmt);
      console.log(`✅ Successfully inserted 24 Survivor 50 contestants!\n`);
    }

    // Verify the data
    console.log('🔍 Verifying contestants in database...\n');
    const contestants = await sql`SELECT name, age, profession FROM contestants WHERE season = 'Season 50' ORDER BY name`;

    console.log(`📊 Total contestants: ${contestants.length}\n`);
    console.log('Contestants added:');
    console.log('─────────────────────────────────────────────');
    contestants.forEach((c, i) => {
      console.log(`${(i + 1).toString().padStart(2, ' ')}. ${c.name.padEnd(35, ' ')} Age: ${c.age || 'N/A'}`);
    });
    console.log('─────────────────────────────────────────────\n');

    console.log('🎉 Database update complete!');
    console.log('\n📸 Next steps:');
    console.log('   1. Start your dev server: npm run dev');
    console.log('   2. Visit http://localhost:3000/admin');
    console.log('   3. Upload contestant photos via the admin panel\n');

  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

runUpdate();
