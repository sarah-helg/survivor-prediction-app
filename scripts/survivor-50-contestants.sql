-- Replace fictional Season 50 contestants with actual Survivor 50 cast
-- Instructions:
-- 1. Fill in the contestant information below from official CBS sources
-- 2. Run this script on your Neon database to update the contestants
-- 3. Upload photos via the admin panel at /admin

-- First, clear out the fictional contestants
DELETE FROM contestants WHERE season = 'Season 50';

-- Now insert the actual Survivor 50: In the Hands of the Fans cast
-- Fill in the information for all 24 contestants

INSERT INTO contestants (name, age, season, profession, bio, status) VALUES
  -- CONTESTANT 1
  ('Christian Hubicki', 39, 'Season 50', 'Robotics Professor', 'Season: David vs. Goliath and currently lives in Tallahassee, FL', 'active'),

  -- CONTESTANT 2
  ('Cirie Fields', 55, 'Season 50', 'Registered Nurse', 'Seasons: Panama — Exile Island, Micronesia — Fans vs. Favorites, Heroes vs. Villains, Game Changers, Australian Survivor: Australia V The World', 'active'),

  -- CONTESTANT 3
  ('Emily Flippen', 30, 'Season 50', 'Investment Analyst ', 'Seasons: 45 and currently lives in Laurel, MD', 'active'),

  -- CONTESTANT 4
  ('Jenna Lewis-Dougherty', 47, 'Season 50', 'Realtor', 'Seasons: Borneo and All-Stars and currently lives in Woodland, CA', 'active'),

  -- CONTESTANT 5
  ('Joseph “Joe” Hunter', 46, 'Season 50', 'Fire Captain', 'Seasons: 48 and currently lives in West Sacramento, CA', 'active'),

  -- CONTESTANT 6
  ('Ozzy Lusth', 43, 'Season 50', 'Owner of Xolazul; Music Venue, Vinyl Bar, Restaurant', 'Seasons: Cook Islands, Micronesia — Fans vs. Favorites, South Pacific, Game Changers', 'active'),

  -- CONTESTANT 7
  ('Rick Devens', 41, 'Season 50', 'Director of Communications at Middle Georgia State University', 'Seasons: Edge of Extinction', 'active'),

  -- CONTESTANT 8
  ('Savannah Louie', 31, 'Season 50', 'Marketing Specialist', 'Seasons: 49 and currently lives in Atlanta, GA', 'active'),

  -- CONTESTANT 9
  ('Charlie Davis', 27, 'Season 50', 'Attorney', 'Seasons: 46 and currently lives in Boston, MA', 'active'),

  -- CONTESTANT 10
  ('Chrissy Hofbeck', 54, 'Season 50', 'Actuary', 'Seasons: Heroes v. Healers v. Hustlers, and currently lives in The Villages, FL', 'active'),

  -- CONTESTANT 11
  ('Benjamin “Coach” Wade', 53, 'Season 50', 'Music teacher and Coach and Super Dad!', 'Seasons: Tocantins, Heroes vs. Villains, South Pacific', 'active'),

  -- CONTESTANT 12
  ('Dee Valladares', 28, 'Season 50', 'Entrepreneur', 'Seasons: 45 and currently lives in Miami, FL', 'active'),

  -- CONTESTANT 13
  ('Jonathan Young', 32, 'Season 50', 'Beach service owner', 'Seasons: 42 and currently lives in Gulf Shores, AL', 'active'),

  -- CONTESTANT 14
  ('Kamilla Karthigesu', 31, 'Season 50', 'Software Engineer', 'Seasons: 48 and currently lives in Foster City, CA', 'active'),

  -- CONTESTANT 15
  ('Mike White', 54, 'Season 50', 'Writer/director', 'Seasons: David vs. Goliath and currently lives in Hanalei, HI', 'active'),

  -- CONTESTANT 16
  ('Tiffany Ervin', 43, 'Season 50', 'Artist / Creative Producer', 'Seasons: 46 and currently lives in Los Angeles, CA', 'active'),

  -- CONTESTANT 17
  ('Angelina Keeley', 35, 'Season 50', 'Entrepreneur / Small Business Owner', 'Seasons: David vs. Goliath and currently lives in San Diego, CA', 'active'),

  -- CONTESTANT 18
  ('Aubry Bracco', 39, 'Season 50', 'None listed', 'Seasons: Kaôh Rōng, Game Changes, Edge of Extinction', 'active'),

  -- CONTESTANT 19
  ('Colby Donaldson', 51, 'Season 50', 'Rancher, Welder', 'Seasons: The Australian Outback, All-Stars, Heroes vs. Villains', 'active'),

  -- CONTESTANT 20
  ('Genevieve Mushaluk', 34, 'Season 50', 'Lawyer', 'Seasons: 47 and currently lives in Winnipeg, Manitoba', 'active'),

  -- CONTESTANT 21
  ('Kyle Fraser', 31, 'Season 50', 'Defense Attorney', 'Seasons: 48 and currently lives in Brooklyn, NY', 'active'),

  -- CONTESTANT 22
  ('Q Burdette', 31, 'Season 50', 'Real estate broker', 'Seasons: 46 menance, and currently lives in Germantown, TN', 'active'),

  -- CONTESTANT 23
  ('Rizo Velovic', 26, 'Season 50', 'Tech Sales', 'Seasons: 49 and currently lives in Yonkers, NY', 'active'),

  -- CONTESTANT 24
  ('Stephenie LaGrossa Kendrick', 45, 'Season 50', 'Part time recess monitor, full time busy mom of three', 'Seasons: Palau, Guatemala, Heroes vs. Villains and was born in Delco lol', 'active');

-- After running this script:
-- 1. Visit your admin panel at /admin
-- 2. Upload contestant photos using the image upload section
-- 3. Photos will be stored in Vercel Blob storage and linked to each contestant
