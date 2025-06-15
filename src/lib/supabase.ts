import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'student' | 'instructor' | 'admin';
          avatar?: string;
          bio?: string;
          streak: number;
          last_login_date?: string;
          joined_date: string;
          is_verified: boolean;
          accessibility_settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'student' | 'instructor' | 'admin';
          avatar?: string;
          bio?: string;
          streak?: number;
          last_login_date?: string;
          joined_date?: string;
          is_verified?: boolean;
          accessibility_settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'student' | 'instructor' | 'admin';
          avatar?: string;
          bio?: string;
          streak?: number;
          last_login_date?: string;
          joined_date?: string;
          is_verified?: boolean;
          accessibility_settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string;
          instructor_id: string;
          thumbnail?: string;
          price: number;
          original_price?: number;
          rating: number;
          total_ratings: number;
          total_students: number;
          duration?: string;
          level: 'Beginner' | 'Intermediate' | 'Advanced';
          category: string;
          tags: string[];
          requirements: string[];
          what_you_will_learn: string[];
          target_audience: string[];
          language: string;
          has_subtitles: boolean;
          has_certificate: boolean;
          total_lessons: number;
          total_quizzes: number;
          total_assignments: number;
          is_published: boolean;
          is_draft: boolean;
          is_approved: boolean;
          rejection_reason?: string;
          revenue: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description: string;
          instructor_id: string;
          thumbnail?: string;
          price?: number;
          original_price?: number;
          rating?: number;
          total_ratings?: number;
          total_students?: number;
          duration?: string;
          level?: 'Beginner' | 'Intermediate' | 'Advanced';
          category: string;
          tags?: string[];
          requirements?: string[];
          what_you_will_learn?: string[];
          target_audience?: string[];
          language?: string;
          has_subtitles?: boolean;
          has_certificate?: boolean;
          total_lessons?: number;
          total_quizzes?: number;
          total_assignments?: number;
          is_published?: boolean;
          is_draft?: boolean;
          is_approved?: boolean;
          rejection_reason?: string;
          revenue?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          instructor_id?: string;
          thumbnail?: string;
          price?: number;
          original_price?: number;
          rating?: number;
          total_ratings?: number;
          total_students?: number;
          duration?: string;
          level?: 'Beginner' | 'Intermediate' | 'Advanced';
          category?: string;
          tags?: string[];
          requirements?: string[];
          what_you_will_learn?: string[];
          target_audience?: string[];
          language?: string;
          has_subtitles?: boolean;
          has_certificate?: boolean;
          total_lessons?: number;
          total_quizzes?: number;
          total_assignments?: number;
          is_published?: boolean;
          is_draft?: boolean;
          is_approved?: boolean;
          rejection_reason?: string;
          revenue?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
          completed_lessons: string[];
          completed_quizzes: string[];
          completed_assignments: string[];
          enrolled_at: string;
          last_accessed_at: string;
          certificate_issued: boolean;
          certificate_id?: string;
          total_time_spent: number;
          current_lesson?: string;
          payment_id?: string;
          amount_paid?: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          completed_lessons?: string[];
          completed_quizzes?: string[];
          completed_assignments?: string[];
          enrolled_at?: string;
          last_accessed_at?: string;
          certificate_issued?: boolean;
          certificate_id?: string;
          total_time_spent?: number;
          current_lesson?: string;
          payment_id?: string;
          amount_paid?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
          completed_lessons?: string[];
          completed_quizzes?: string[];
          completed_assignments?: string[];
          enrolled_at?: string;
          last_accessed_at?: string;
          certificate_issued?: boolean;
          certificate_id?: string;
          total_time_spent?: number;
          current_lesson?: string;
          payment_id?: string;
          amount_paid?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount: number;
          platform_fee: number;
          instructor_earnings: number;
          payment_method: 'card' | 'paypal' | 'bank';
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          transaction_id: string;
          created_at: string;
          processed_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount: number;
          platform_fee: number;
          instructor_earnings: number;
          payment_method: 'card' | 'paypal' | 'bank';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          transaction_id: string;
          created_at?: string;
          processed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          amount?: number;
          platform_fee?: number;
          instructor_earnings?: number;
          payment_method?: 'card' | 'paypal' | 'bank';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          transaction_id?: string;
          created_at?: string;
          processed_at?: string;
        };
      };
    };
  };
}