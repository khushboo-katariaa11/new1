import { supabase } from '../lib/supabase';
import { AccessibilitySettings } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'instructor';
  accessibilitySettings?: AccessibilitySettings;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role,
            accessibility_settings: data.accessibilitySettings || { disabilityType: 'none' },
          });

        if (profileError) throw profileError;

        // Create initial streak record
        const { error: streakError } = await supabase
          .from('streaks')
          .insert({
            user_id: authData.user.id,
            current_streak: 0,
            longest_streak: 0,
            total_points: 0,
            level: 1,
          });

        if (streakError) console.warn('Failed to create streak record:', streakError);
      }

      return { data: authData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Update last login date
      if (authData.user) {
        await supabase
          .from('users')
          .update({ last_login_date: new Date().toISOString().split('T')[0] })
          .eq('id', authData.user.id);
      }

      return { data: authData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { user: null, profile: null };

      // Get user profile from our users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return { user, profile };
    } catch (error) {
      return { user: null, profile: null, error };
    }
  },

  async updateAccessibilitySettings(userId: string, settings: AccessibilitySettings) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ accessibility_settings: settings })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};