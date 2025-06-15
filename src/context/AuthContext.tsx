import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccessibilitySettings } from '../types';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor', accessibilitySettings?: AccessibilitySettings) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithTwitter: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateStreak: () => void;
  updateAccessibilitySettings: (settings: AccessibilitySettings) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar,
          bio: profile.bio,
          streak: profile.streak,
          lastLoginDate: profile.last_login_date,
          joinedDate: profile.joined_date,
          isVerified: profile.is_verified,
          accessibilitySettings: profile.accessibility_settings
        });

        // Update streak on login
        await updateUserStreak(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateUserStreak = async (userData: any) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.last_login_date;
    
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = userData.streak || 0;
      
      if (lastLogin === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak += 1;
      } else if (lastLogin && lastLogin !== today) {
        // Missed a day - reset streak
        newStreak = 1;
      } else if (!lastLogin) {
        // First login
        newStreak = 1;
      }
      
      // Update in database
      await supabase
        .from('users')
        .update({ 
          streak: newStreak,
          last_login_date: today 
        })
        .eq('id', userData.id);

      // Update streak table
      await supabase
        .from('streaks')
        .upsert({
          user_id: userData.id,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userData.longest_streak || 0),
          last_activity_date: today,
          streak_start_date: newStreak === 1 ? today : userData.streak_start_date
        });

      // Update local state
      setUser(prev => prev ? { ...prev, streak: newStreak, lastLoginDate: today } : null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await authService.signIn({ email, password });
      
      if (error || !data.user) {
        console.error('Login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'student' | 'instructor',
    accessibilitySettings: AccessibilitySettings = { disabilityType: 'none' }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await authService.signUp({
        name,
        email,
        password,
        role,
        accessibilitySettings
      });
      
      if (error || !data.user) {
        console.error('Registration error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTwitter = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Twitter login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateStreak = async () => {
    if (user) {
      await updateUserStreak(user);
    }
  };

  const updateAccessibilitySettings = async (settings: AccessibilitySettings) => {
    if (user) {
      try {
        const { error } = await authService.updateAccessibilitySettings(user.id, settings);
        
        if (!error) {
          setUser(prev => prev ? { ...prev, accessibilitySettings: settings } : null);
        }
      } catch (error) {
        console.error('Failed to update accessibility settings:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      loginWithGoogle,
      loginWithTwitter,
      logout, 
      isLoading, 
      updateStreak,
      updateAccessibilitySettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};