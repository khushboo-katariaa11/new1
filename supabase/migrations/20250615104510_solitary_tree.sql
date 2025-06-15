/*
  # Create database functions

  1. Functions
    - increment_course_students: Increment student count for a course
    - update_course_revenue: Update course revenue
    - calculate_course_rating: Calculate average rating for a course
*/

-- Function to increment course student count
CREATE OR REPLACE FUNCTION increment_course_students(course_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE courses 
  SET total_students = total_students + 1
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update course revenue
CREATE OR REPLACE FUNCTION update_course_revenue(course_id uuid, amount decimal)
RETURNS void AS $$
BEGIN
  UPDATE courses 
  SET revenue = revenue + amount
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate course rating
CREATE OR REPLACE FUNCTION calculate_course_rating(course_id uuid)
RETURNS void AS $$
DECLARE
  avg_rating decimal;
  rating_count integer;
BEGIN
  SELECT AVG(rating), COUNT(*) 
  INTO avg_rating, rating_count
  FROM reviews 
  WHERE course_id = calculate_course_rating.course_id;
  
  UPDATE courses 
  SET rating = COALESCE(avg_rating, 0),
      total_ratings = rating_count
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update course rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_course_rating_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_course_rating(OLD.course_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_course_rating(NEW.course_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for review changes
DROP TRIGGER IF EXISTS review_rating_trigger ON reviews;
CREATE TRIGGER review_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating_trigger();