/*
  # Create certificates table

  1. New Tables
    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `course_name` (text)
      - `instructor_name` (text)
      - `issued_at` (timestamptz, default now())
      - `completion_date` (timestamptz)
      - `grade` (text, optional)
      - `certificate_url` (text, optional)
      - `verification_code` (text, unique)

  2. Security
    - Enable RLS on `certificates` table
    - Add policies for certificate access
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  instructor_name text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  completion_date timestamptz NOT NULL,
  grade text,
  certificate_url text,
  verification_code text UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can verify certificates by code"
  ON certificates
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "System can create certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());