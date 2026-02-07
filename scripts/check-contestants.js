#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

async function checkContestants() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

  const sql = neon(databaseUrl);

  console.log('Checking database contestants...\n');

  const contestants = await sql`SELECT id, name, age, profession FROM contestants WHERE season = 'Season 50' ORDER BY id`;

  console.log(`Total: ${contestants.length} contestants\n`);
  contestants.forEach(c => {
    console.log(`ID ${c.id.toString().padStart(3, ' ')}: ${c.name}`);
  });
}

checkContestants();
