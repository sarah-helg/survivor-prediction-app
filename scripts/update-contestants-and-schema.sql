-- Add 6 more contestants to reach 24 total for Season 50
-- Also make email optional on users table

-- Make email nullable for name-only submissions
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Add 6 more contestants
INSERT INTO contestants (name, age, season, profession, bio, status) VALUES
  ('Aaliyah Washington', 34, 'Season 50', 'Travel Blogger', 'Has visited 60 countries and knows how to adapt to any environment. Ready to outwit, outplay, outlast.', 'active'),
  ('Ethan Calloway', 27, 'Season 50', 'Park Ranger', 'Spent years protecting wildlife in remote areas. The jungle is his second home.', 'active'),
  ('Grace Nakamura', 31, 'Season 50', 'Architect', 'Designs buildings for a living but plans to deconstruct every alliance on the island.', 'active'),
  ('Isaiah Brown', 37, 'Season 50', 'Youth Pastor', 'Leads with heart and compassion, but wont hesitate to make bold moves when needed.', 'active'),
  ('Megan OConnor', 26, 'Season 50', 'Bartender', 'Reads people for tips every night. On the island, she will read them for strategy.', 'active'),
  ('Vincent Morales', 44, 'Season 50', 'Retired Military', 'Discipline and strategy are his trademarks. He has led teams through tougher situations than this.', 'active')
ON CONFLICT DO NOTHING;
