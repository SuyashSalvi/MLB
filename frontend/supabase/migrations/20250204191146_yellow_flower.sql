/*
  # MLB Stats Database Schema

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text)
      - `team` (text)
      - `position` (text)
      - `image_url` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `player_stats`
      - `id` (uuid, primary key)
      - `player_id` (uuid, foreign key)
      - `year` (integer)
      - `avg` (numeric)
      - `hr` (integer)
      - `rbi` (integer)
      - `ops` (numeric)
      - `is_prediction` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL,
  image_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  year integer NOT NULL,
  avg numeric(4,3) NOT NULL,
  hr integer NOT NULL,
  rbi integer NOT NULL,
  ops numeric(4,3),
  is_prediction boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to players"
  ON players
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to player stats"
  ON player_stats
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO players (name, team, position, image_url, bio)
VALUES 
  ('Mike Trout', 'Los Angeles Angels', 'CF', 
   'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100&h=100',
   'Mike Trout is widely regarded as one of the greatest baseball players of all time. His combination of power, speed, and defensive prowess has earned him numerous accolades.'),
  ('Shohei Ohtani', 'Los Angeles Dodgers', 'DH/SP',
   'https://images.unsplash.com/photo-1629285483773-6b5cde2171d1?auto=format&fit=crop&q=80&w=100&h=100',
   'Shohei Ohtani is a unique talent in MLB history, excelling both as a pitcher and hitter. His two-way ability has drawn comparisons to Babe Ruth.');

-- Insert historical stats for Mike Trout
WITH trout AS (SELECT id FROM players WHERE name = 'Mike Trout')
INSERT INTO player_stats (player_id, year, avg, hr, rbi, ops, is_prediction)
SELECT 
  trout.id,
  year,
  avg,
  hr,
  rbi,
  ops,
  is_prediction
FROM trout, (VALUES 
  (2020, 0.281, 17, 46, 0.993, false),
  (2021, 0.296, 39, 79, 1.090, false),
  (2022, 0.283, 40, 80, 0.999, false),
  (2023, 0.296, 40, 95, 0.972, false),
  (2024, 0.291, 42, 98, 0.985, true),
  (2025, 0.288, 38, 92, 0.975, true),
  (2026, 0.285, 36, 88, 0.965, true)
) AS stats(year, avg, hr, rbi, ops, is_prediction);

-- Insert historical stats for Shohei Ohtani
WITH ohtani AS (SELECT id FROM players WHERE name = 'Shohei Ohtani')
INSERT INTO player_stats (player_id, year, avg, hr, rbi, ops, is_prediction)
SELECT 
  ohtani.id,
  year,
  avg,
  hr,
  rbi,
  ops,
  is_prediction
FROM ohtani, (VALUES 
  (2020, 0.286, 7, 24, 0.848, false),
  (2021, 0.257, 46, 100, 0.965, false),
  (2022, 0.273, 34, 95, 0.875, false),
  (2023, 0.304, 44, 95, 1.066, false),
  (2024, 0.298, 45, 102, 1.050, true),
  (2025, 0.301, 47, 105, 1.070, true),
  (2026, 0.295, 43, 98, 1.045, true)
) AS stats(year, avg, hr, rbi, ops, is_prediction);