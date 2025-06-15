import { supabase } from '../lib/supabase';

export const enrollmentService = {
  async enrollInCourse(userId: string, courseId: string, paymentId: string, amountPaid: number) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          payment_id: paymentId,
          amount_paid: amountPaid,
        })
        .select()
        .single();

      if (error) throw error;

      // Update course student count
      await supabase.rpc('increment_course_students', { course_id: courseId });

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserEnrollments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            *,
            instructor:users!instructor_id(id, name, avatar, bio)
          )
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProgress(enrollmentId: string, progress: number, completedLessons: string[]) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .update({
          progress,
          completed_lessons: completedLessons,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async isUserEnrolled(userId: string, courseId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { enrolled: !!data, error: null };
    } catch (error) {
      return { enrolled: false, error };
    }
  },

  async getCourseEnrollments(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          user:users(id, name, email, avatar)
        `)
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};