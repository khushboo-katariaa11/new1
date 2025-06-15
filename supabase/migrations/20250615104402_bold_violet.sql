/*
  # Create streaks table

  1. New Tables
    - `streaks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users, unique)
      - `current_streak` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `last_activity_date` (date)
      - `streak_start_date` (date)
      - `total_points` (integer, default 0)
      - `level` (integer, default 1)
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `streaks` table
    - Add policies for streak access
*/

CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  streak_start_date date,
  total_points integer DEFAULT 0,
  level integer DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own streak"
  ON streaks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own streak"
  ON streaks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();