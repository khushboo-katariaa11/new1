import { supabase } from '../lib/supabase';
import { Course } from '../types';

export const courseService = {
  async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:users!instructor_id(id, name, avatar, bio)
        `)
        .eq('is_published', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCourseById(id: string) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:users!instructor_id(id, name, avatar, bio),
          lessons(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCoursesByInstructor(instructorId: string) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createCourse(courseData: any) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateCourse(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteCourse(id: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async searchCourses(query: string, filters?: any) {
    try {
      let queryBuilder = supabase
        .from('courses')
        .select(`
          *,
          instructor:users!instructor_id(id, name, avatar, bio)
        `)
        .eq('is_published', true)
        .eq('is_approved', true);

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (filters?.category && filters.category !== 'All Categories') {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (filters?.level && filters.level !== 'All Levels') {
        queryBuilder = queryBuilder.eq('level', filters.level);
      }

      if (filters?.minPrice !== undefined) {
        queryBuilder = queryBuilder.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};