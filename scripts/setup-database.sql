-- Survivor Prediction App Database Schema

-- Users table for tracking players
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contestants table
CREATE TABLE IF NOT EXISTS contestants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  season VARCHAR(100) NOT NULL,
  profession VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'eliminated')),
  final_rank INTEGER,
  eliminated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rankings table - stores user predictions
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contestant_id INTEGER NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  predicted_position INTEGER NOT NULL CHECK (predicted_position > 0),
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, contestant_id)
);

-- Scores table - tracks user points
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_total INTEGER DEFAULT 0,
  perfect_matches INTEGER DEFAULT 0,
  one_off_matches INTEGER DEFAULT 0,
  two_off_matches INTEGER DEFAULT 0,
  top3_bonuses INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Score history for tracking weekly changes
CREATE TABLE IF NOT EXISTS score_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  contestant_id INTEGER REFERENCES contestants(id),
  match_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some sample contestants for Season 50
INSERT INTO contestants (name, age, season, profession, bio, status) VALUES
  ('Marcus Chen', 32, 'Season 50', 'Software Engineer', 'A strategic mastermind from Silicon Valley who plans to outwit everyone with his analytical mind.', 'active'),
  ('Jasmine Williams', 28, 'Season 50', 'Fitness Trainer', 'Physical powerhouse with a social game to match. Jasmine believes in forming genuine connections.', 'active'),
  ('Derek Morrison', 45, 'Season 50', 'Firefighter', 'A natural leader who has spent 20 years saving lives. Now he wants to win for his family.', 'active'),
  ('Luna Rodriguez', 24, 'Season 50', 'Marine Biologist', 'Ocean lover with a fierce competitive spirit. Underestimate her at your own risk.', 'active'),
  ('Tyler Brooks', 31, 'Season 50', 'Personal Chef', 'Plans to cook his way into alliances and feed his tribe to victory.', 'active'),
  ('Priya Patel', 29, 'Season 50', 'ER Nurse', 'Calm under pressure and ready to diagnose the competition elimination by elimination.', 'active'),
  ('Jake Thompson', 26, 'Season 50', 'Pro Surfer', 'Laid-back attitude masks a fierce competitor who rides waves and blindsides.', 'active'),
  ('Maya Johnson', 35, 'Season 50', 'Criminal Lawyer', 'Expert at reading people and building cases. Every tribal council is just another courtroom.', 'active'),
  ('Carlos Reyes', 40, 'Season 50', 'Construction Foreman', 'Built everything from houses to businesses. Now building his path to a million dollars.', 'active'),
  ('Emma Davis', 23, 'Season 50', 'College Student', 'Youngest player this season but has been studying Survivor strategy since childhood.', 'active'),
  ('Nathan Kim', 38, 'Season 50', 'Investment Banker', 'Knows when to hold and when to fold. Treating this game like his biggest deal yet.', 'active'),
  ('Sarah Mitchell', 33, 'Season 50', 'Yoga Instructor', 'Zen on the outside, fierce competitor on the inside. Balance is her secret weapon.', 'active'),
  ('David Okonkwo', 42, 'Season 50', 'High School Principal', 'Has managed thousands of students. Managing 17 competitors should be easy.', 'active'),
  ('Lily Chang', 27, 'Season 50', 'Social Media Manager', 'Knows how to build a following and influence people. The island is just another platform.', 'active'),
  ('Ryan Foster', 30, 'Season 50', 'Wilderness Guide', 'Lived off the grid for years. Survival is second nature, strategy is the real challenge.', 'active'),
  ('Olivia Martinez', 36, 'Season 50', 'Event Planner', 'Every tribal council is just another event to plan. She controls the narrative.', 'active'),
  ('Brandon Lee', 29, 'Season 50', 'Stand-up Comedian', 'Uses humor to disarm and charm. But make no mistake, hes playing to win.', 'active'),
  ('Zoe Wilson', 25, 'Season 50', 'Graduate Student', 'Studying psychology and using this as her thesis. Everyone is a test subject.', 'active')
ON CONFLICT DO NOTHING;

-- Create a demo user
INSERT INTO users (name, email, is_admin) VALUES
  ('Demo Player', 'demo@survivor.app', FALSE),
  ('Admin', 'admin@survivor.app', TRUE)
ON CONFLICT (email) DO NOTHING;
