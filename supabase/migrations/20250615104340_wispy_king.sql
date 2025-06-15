/*
  # Create enrollments table

  1. New Tables
    - `enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `progress` (decimal, default 0)
      - `completed_lessons` (uuid array, default empty)
      - `completed_quizzes` (uuid array, default empty)
      - `completed_assignments` (uuid array, default empty)
      - `enrolled_at` (timestamptz, default now())
      - `last_accessed_at` (timestamptz, default now())
      - `certificate_issued` (boolean, default false)
      - `certificate_id` (uuid, optional)
      - `total_time_spent` (integer, default 0)
      - `current_lesson` (uuid, optional)
      - `payment_id` (uuid, optional)
      - `amount_paid` (decimal)

  2. Security
    - Enable RLS on `enrollments` table
    - Add policies for enrollment access
*/

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  progress decimal(5,2) DEFAULT 0,
  completed_lessons uuid[] DEFAULT '{}',
  completed_quizzes uuid[] DEFAULT '{}',
  completed_assignments uuid[] DEFAULT '{}',
  enrolled_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  certificate_issued boolean DEFAULT false,
  certificate_id uuid,
  total_time_spent integer DEFAULT 0,
  current_lesson uuid,
  payment_id uuid,
  amount_paid decimal(10,2),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments"
  ON enrollments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Instructors can read enrollments for their courses"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );