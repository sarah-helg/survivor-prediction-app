#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

async function updateDatabase() {
  const databaseUrl = 'postgresql://neondb_owner:npg_g97rNaiUTbvx@ep-young-mode-ah940hbo-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

  const sql = neon(databaseUrl);

  console.log('🗑️  Step 1: Deleting old Season 50 contestants...\n');

  // Delete old contestants
  const deleteResult = await sql`DELETE FROM contestants WHERE season = 'Season 50'`;
  console.log('✅ Deleted!\n');

  console.log('➕ Step 2: Inserting actual Survivor 50 cast...\n');

  // Build the raw SQL query string
  const rawInsertSQL = `
    INSERT INTO contestants (name, age, season, profession, bio, status) VALUES
      ('Christian Hubicki', 39, 'Season 50', 'Robotics Professor', 'Season: David vs. Goliath and currently lives in Tallahassee, FL', 'active'),
      ('Cirie Fields', 55, 'Season 50', 'Registered Nurse', 'Seasons: Panama — Exile Island, Micronesia — Fans vs. Favorites, Heroes vs. Villains, Game Changers, Australian Survivor: Australia V The World', 'active'),
      ('Emily Flippen', 30, 'Season 50', 'Investment Analyst ', 'Seasons: 45 and currently lives in Laurel, MD', 'active'),
      ('Jenna Lewis-Dougherty', 47, 'Season 50', 'Realtor', 'Seasons: Borneo and All-Stars and currently lives in Woodland, CA', 'active'),
      ('Joseph "Joe" Hunter', 46, 'Season 50', 'Fire Captain', 'Seasons: 48 and currently lives in West Sacramento, CA', 'active'),
      ('Ozzy Lusth', 43, 'Season 50', 'Owner of Xolazul; Music Venue, Vinyl Bar, Restaurant', 'Seasons: Cook Islands, Micronesia — Fans vs. Favorites, South Pacific, Game Changers', 'active'),
      ('Rick Devens', 41, 'Season 50', 'Director of Communications at Middle Georgia State University', 'Seasons: Edge of Extinction', 'active'),
      ('Savannah Louie', 31, 'Season 50', 'Marketing Specialist', 'Seasons: 49 and currently lives in Atlanta, GA', 'active'),
      ('Charlie Davis', 27, 'Season 50', 'Attorney', 'Seasons: 46 and currently lives in Boston, MA', 'active'),
      ('Chrissy Hofbeck', 54, 'Season 50', 'Actuary', 'Seasons: Heroes v. Healers v. Hustlers, and currently lives in The Villages, FL', 'active'),
      ('Benjamin "Coach" Wade', 53, 'Season 50', 'Music teacher and Coach and Super Dad!', 'Seasons: Tocantins, Heroes vs. Villains, South Pacific', 'active'),
      ('Dee Valladares', 28, 'Season 50', 'Entrepreneur', 'Seasons: 45 and currently lives in Miami, FL', 'active'),
      ('Jonathan Young', 32, 'Season 50', 'Beach service owner', 'Seasons: 42 and currently lives in Gulf Shores, AL', 'active'),
      ('Kamilla Karthigesu', 31, 'Season 50', 'Software Engineer', 'Seasons: 48 and currently lives in Foster City, CA', 'active'),
      ('Mike White', 54, 'Season 50', 'Writer/director', 'Seasons: David vs. Goliath and currently lives in Hanalei, HI', 'active'),
      ('Tiffany Ervin', 43, 'Season 50', 'Artist / Creative Producer', 'Seasons: 46 and currently lives in Los Angeles, CA', 'active'),
      ('Angelina Keeley', 35, 'Season 50', 'Entrepreneur / Small Business Owner', 'Seasons: David vs. Goliath and currently lives in San Diego, CA', 'active'),
      ('Aubry Bracco', 39, 'Season 50', 'None listed', 'Seasons: Kaôh Rōng, Game Changes, Edge of Extinction', 'active'),
      ('Colby Donaldson', 51, 'Season 50', 'Rancher, Welder', 'Seasons: The Australian Outback, All-Stars, Heroes vs. Villains', 'active'),
      ('Genevieve Mushaluk', 34, 'Season 50', 'Lawyer', 'Seasons: 47 and currently lives in Winnipeg, Manitoba', 'active'),
      ('Kyle Fraser', 31, 'Season 50', 'Defense Attorney', 'Seasons: 48 and currently lives in Brooklyn, NY', 'active'),
      ('Q Burdette', 31, 'Season 50', 'Real estate broker', 'Seasons: 46 menance, and currently lives in Germantown, TN', 'active'),
      ('Rizo Velovic', 26, 'Season 50', 'Tech Sales', 'Seasons: 49 and currently lives in Yonkers, NY', 'active'),
      ('Stephenie LaGrossa Kendrick', 45, 'Season 50', 'Part time recess monitor, full time busy mom of three', 'Seasons: Palau, Guatemala, Heroes vs. Villains and was born in Delco lol', 'active');
  `;

  // Execute using sql.query for raw SQL
  const insertResult = await sql.query(rawInsertSQL);

  console.log('✅ Inserted 24 contestants!\n');

  console.log('🔍 Verifying...\n');

  const contestants = await sql`SELECT name, profession FROM contestants WHERE season = 'Season 50' ORDER BY name`;

  console.log(`📊 Total: ${contestants.length} contestants\n`);
  console.log('Contestants in database:');
  console.log('─────────────────────────────────────────────');
  contestants.forEach((c, i) => {
    console.log(`${(i + 1).toString().padStart(2, ' ')}. ${c.name}`);
  });
  console.log('─────────────────────────────────────────────\n');

  console.log('🎉 Success! Your database now has the actual Survivor 50 cast!\n');
  console.log('📸 Next steps:');
  console.log('   1. Start your dev server: npm run dev');
  console.log('   2. Visit http://localhost:3000/admin');
  console.log('   3. Upload contestant photos\n');
}

updateDatabase().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
