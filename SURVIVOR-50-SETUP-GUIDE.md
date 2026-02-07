# Survivor 50 Contestant Setup Guide

This guide will walk you through adding the actual Survivor Season 50 contestants with their photos and bios to your app.

## Overview

Survivor Season 50: "In the Hands of the Fans" features 24 returning players. This season premieres February 25, 2026, on CBS.

## Step-by-Step Process

### Step 1: Gather Contestant Information

Visit these official sources to get contestant data:
- CBS Official Survivor page
- Parade's Survivor 50 cast page
- Survivor Wiki (survivor.fandom.com)
- CBS Mornings announcement

For each of the 24 contestants, collect:
- Full name
- Age (current age for Season 50)
- Original season(s) they appeared in
- Current occupation/profession
- Hometown
- Bio (their story, strategy, why they're back, etc.)
- Official CBS photo (high quality headshot)

### Step 2: Update the Database with Contestant Info

1. Open the SQL script template at:
   ```
   scripts/survivor-50-contestants.sql
   ```

2. Fill in each contestant's information:
   - Replace "Name Here" with their full name
   - Replace `00` with their age
   - Keep `'Season 50'` as is
   - Replace "Profession Here" with their occupation
   - Replace "Bio description here" with their full bio

3. Save your changes to the SQL file

4. Run the script on your Neon database:
   - Option A: Use the Neon console's SQL Editor
     - Go to your Neon project dashboard
     - Click "SQL Editor"
     - Copy and paste the entire SQL script
     - Click "Run"

   - Option B: Use the `psql` command line
     ```bash
     psql $DATABASE_URL -f scripts/survivor-50-contestants.sql
     ```

### Step 3: Upload Contestant Photos

Your app already has an admin panel with photo upload functionality built in!

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin panel:
   ```
   http://localhost:3000/admin
   ```

3. For each contestant:
   - Download their official CBS photo (save as `firstname-lastname.jpg`)
   - In the admin panel, find the contestant in the "Contestant Management" section
   - Click "Choose File" next to their name
   - Select their photo from your computer
   - The photo will automatically upload to Vercel Blob storage
   - The database will be updated with the image URL

4. Verify photos are displaying:
   - Visit the home page: `http://localhost:3000`
   - All contestants should now show their actual photos

### Step 4: Verify Everything Works

Check these pages to ensure everything looks good:

1. **Home/Dashboard** (`/`)
   - All 24 contestants display with photos
   - Bios appear in contestant cards
   - Search and filter functionality works

2. **Rankings Page** (`/rankings`)
   - Contestants appear in the ranking interface
   - Photos display correctly in draggable cards
   - You can rank all 24 contestants

3. **Leaderboard** (`/leaderboard`)
   - Scores track properly when eliminations happen

4. **Admin Panel** (`/admin`)
   - All contestants visible
   - Can eliminate contestants
   - Photos show thumbnails

## Tips for Photo Collection

### Where to Find Official Photos

1. **CBS.com** - Official cast photos gallery
2. **CBS Press Express** - High-resolution press photos
3. **Parade.com** - Usually has full cast photo gallery
4. **Entertainment Weekly** - Often posts cast photo galleries
5. **Survivor Wiki** - Community-curated photos (check licensing)

### Photo Guidelines

- **Format**: JPG or PNG
- **Resolution**: At least 400x400px (higher is better)
- **Aspect Ratio**: Square or portrait orientation works best
- **File Size**: Under 5MB per image
- **Naming**: Use `firstname-lastname.jpg` for easy organization

### Photo Optimization (Optional)

To keep your app loading fast, consider optimizing photos before upload:
- Use a tool like TinyPNG or ImageOptim
- Resize to 800x800px (sufficient for web display)
- Save as JPG with 85% quality

## Data Schema Reference

Your contestants table structure:
```sql
contestants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  season VARCHAR(100) NOT NULL,
  profession VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  final_rank INTEGER,
  eliminated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Troubleshooting

### Photos not uploading?
- Check that Vercel Blob storage is configured in your `.env` file
- Ensure `BLOB_READ_WRITE_TOKEN` is set
- Verify file size is under upload limit

### Database connection errors?
- Check your `DATABASE_URL` in `.env`
- Ensure Neon database is running
- Verify SQL syntax in your script

### Contestants not showing?
- Check browser console for errors
- Verify data was inserted: Run `SELECT * FROM contestants` in Neon
- Clear browser cache and refresh

## Need Help?

If you run into issues:
1. Check the browser console for errors (F12)
2. Check server logs in your terminal
3. Verify environment variables are set correctly
4. Make sure the database script ran successfully

## Notable Survivor 50 Cast Members

Some highlighted contestants (as of the announcement):
- **Cirie Fields** - 5th appearance (tying Boston Rob)
- **Ozzy Lusth** - 5th appearance
- **Mike White** - "White Lotus" creator
- **Winners returning**: Dee Valladares (45), Kyle Fraser (48), Savannah Louie (49)
- Other legends: Colby Donaldson, Stephenie LaGrossa, Jerri Manthey, and more

---

Happy ranking! May the best predictor win! 🏝️🔥
