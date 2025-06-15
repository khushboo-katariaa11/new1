/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `duration` (text)
      - `order_index` (integer)
      - `is_preview` (boolean, default false)
      - `transcript` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `lessons` table
    - Add policies for lesson access
*/

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration text,
  order_index integer NOT NULL,
  is_preview boolean DEFAULT false,
  transcript text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read preview lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    is_preview = true AND 
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND is_published = true AND is_approved = true
    )
  );

CREATE POLICY "Enrolled students can read lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE course_id = lessons.course_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage own course lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();