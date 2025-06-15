/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `short_description` (text)
      - `instructor_id` (uuid, foreign key to users)
      - `thumbnail` (text)
      - `price` (decimal)
      - `original_price` (decimal, optional)
      - `rating` (decimal, default 0)
      - `total_ratings` (integer, default 0)
      - `total_students` (integer, default 0)
      - `duration` (text)
      - `level` (enum)
      - `category` (text)
      - `tags` (text array)
      - `requirements` (text array)
      - `what_you_will_learn` (text array)
      - `target_audience` (text array)
      - `language` (text, default 'English')
      - `has_subtitles` (boolean, default false)
      - `has_certificate` (boolean, default false)
      - `total_lessons` (integer, default 0)
      - `total_quizzes` (integer, default 0)
      - `total_assignments` (integer, default 0)
      - `is_published` (boolean, default false)
      - `is_draft` (boolean, default true)
      - `is_approved` (boolean, default false)
      - `rejection_reason` (text, optional)
      - `revenue` (decimal, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `courses` table
    - Add policies for course access
*/

-- Create enum for course levels
CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  instructor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  thumbnail text,
  price decimal(10,2) DEFAULT 0,
  original_price decimal(10,2),
  rating decimal(3,2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  total_students integer DEFAULT 0,
  duration text,
  level course_level DEFAULT 'Beginner',
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  what_you_will_learn text[] DEFAULT '{}',
  target_audience text[] DEFAULT '{}',
  language text DEFAULT 'English',
  has_subtitles boolean DEFAULT false,
  has_certificate boolean DEFAULT false,
  total_lessons integer DEFAULT 0,
  total_quizzes integer DEFAULT 0,
  total_assignments integer DEFAULT 0,
  is_published boolean DEFAULT false,
  is_draft boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  rejection_reason text,
  revenue decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read published courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_published = true AND is_approved = true);

CREATE POLICY "Instructors can read own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Admins can read all courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();