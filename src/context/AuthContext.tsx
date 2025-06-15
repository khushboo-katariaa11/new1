import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccessibilitySettings } from '../types';

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
    // Check for stored user on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Check and update streak on app load
      updateUserStreak(userData);
      // Apply accessibility settings
      applyAccessibilitySettings(userData.accessibilitySettings);
    }
    setIsLoading(false);
  }, []);

  const applyAccessibilitySettings = (settings?: AccessibilitySettings) => {
    if (!settings || settings.disabilityType === 'none') return;

    const root = document.documentElement;

    // Reset previous accessibility classes
    root.className = root.className.replace(/\b(high-contrast|large-click-areas|keyboard-navigation|simplified-layout|reduced-animations|generous-spacing|screen-magnifier-compatible|large-click-targets|keyboard-focus-indicators)\b/g, '');

    // Visual accessibility
    if (settings.visualSettings) {
      const { visualSettings } = settings;
      
      // Font size
      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '22px'
      };
      root.style.fontSize = fontSizeMap[visualSettings.fontSize];

      // Dyslexia font
      if (visualSettings.dyslexiaFont) {
        root.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
      }

      // High contrast
      if (visualSettings.highContrast) {
        root.classList.add('high-contrast');
      }

      // New partial vision features
      if (visualSettings.type === 'partial') {
        // High contrast modes
        if (visualSettings.highContrastMode && visualSettings.highContrastMode !== 'none') {
          root.setAttribute('data-contrast-mode', visualSettings.highContrastMode);
          root.classList.add('partial-vision-contrast');
        }

        // Font weight
        if (visualSettings.fontWeight && visualSettings.fontWeight !== 'normal') {
          root.style.setProperty('--partial-vision-font-weight', visualSettings.fontWeight);
          root.classList.add('partial-vision-font-weight');
        }

        // Screen magnifier compatibility
        if (visualSettings.screenMagnifierCompatible) {
          root.classList.add('screen-magnifier-compatible');
        }

        // Generous spacing
        if (visualSettings.generousSpacing) {
          root.classList.add('generous-spacing');
        }

        // Large click targets
        if (visualSettings.largeClickTargets) {
          root.classList.add('large-click-targets');
        }

        // Keyboard focus indicators
        if (visualSettings.keyboardFocusIndicators) {
          root.classList.add('keyboard-focus-indicators');
        }
      }

      // Color blindness filters
      if (visualSettings.type === 'colorBlind' && visualSettings.colorBlindType) {
        root.classList.add(`color-blind-${visualSettings.colorBlindType}`);
      }

      // Screen reader support
      if (visualSettings.screenReader) {
        root.setAttribute('aria-live', 'polite');
      }
    }

    // Motor accessibility
    if (settings.motorSettings) {
      const { motorSettings } = settings;
      
      if (motorSettings.largeClickAreas) {
        root.classList.add('large-click-areas');
      }
      
      if (motorSettings.keyboardOnly) {
        root.classList.add('keyboard-navigation');
      }
    }

    // Cognitive accessibility
    if (settings.cognitiveSettings) {
      const { cognitiveSettings } = settings;
      
      if (cognitiveSettings.simplifiedLayout) {
        root.classList.add('simplified-layout');
      }
      
      if (cognitiveSettings.reducedAnimations) {
        root.classList.add('reduced-animations');
      }
    }
  };

  const updateUserStreak = (userData: User) => {
    const today = new Date().toDateString();
    const lastLogin = userData.lastLoginDate;
    
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = userData.streak || 0;
      
      if (lastLogin === yesterday.toDateString()) {
        // Consecutive day - increment streak
        newStreak += 1;
      } else if (lastLogin && lastLogin !== today) {
        // Missed a day - reset streak
        newStreak = 1;
      } else if (!lastLogin) {
        // First login
        newStreak = 1;
      }
      
      const updatedUser = {
        ...userData,
        streak: newStreak,
        lastLoginDate: today
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateStreak = () => {
    if (user) {
      updateUserStreak(user);
    }
  };

  const updateAccessibilitySettings = (settings: AccessibilitySettings) => {
    if (user) {
      const updatedUser = {
        ...user,
        accessibilitySettings: settings
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      applyAccessibilitySettings(settings);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in a real app, this would call an API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@student.com',
        role: 'student',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        enrolledCourses: ['1', '2'],
        streak: 7,
        lastLoginDate: new Date().toDateString(),
        joinedDate: '2024-01-01',
        isVerified: true,
        accessibilitySettings: {
          disabilityType: 'none'
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@instructor.com',
        role: 'instructor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        bio: 'Full-stack developer with 10+ years of experience',
        createdCourses: ['1', '3'],
        totalStudents: 45621,
        totalRevenue: 45230.50,
        rating: 4.8,
        totalReviews: 12543,
        joinedDate: '2023-06-15',
        isVerified: true,
        paymentInfo: {
          stripeAccountId: 'acct_1234567890',
          paypalEmail: 'jane@instructor.com'
        },
        accessibilitySettings: {
          disabilityType: 'none'
        }
      },
      {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@learnhub.com',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        joinedDate: '2023-01-01',
        isVerified: true,
        accessibilitySettings: {
          disabilityType: 'none'
        }
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      updateUserStreak(foundUser);
      applyAccessibilitySettings(foundUser.accessibilitySettings);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google user data
      const googleUser: User = {
        id: `google_${Date.now()}`,
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'student',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        enrolledCourses: [],
        streak: 1,
        lastLoginDate: new Date().toDateString(),
        joinedDate: new Date().toISOString().split('T')[0],
        isVerified: true,
        accessibilitySettings: {
          disabilityType: 'none'
        }
      };
      
      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));
      applyAccessibilitySettings(googleUser.accessibilitySettings);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithTwitter = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate Twitter OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Twitter user data
      const twitterUser: User = {
        id: `twitter_${Date.now()}`,
        name: 'Twitter User',
        email: 'user@twitter.com',
        role: 'student',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        enrolledCourses: [],
        streak: 1,
        lastLoginDate: new Date().toDateString(),
        joinedDate: new Date().toISOString().split('T')[0],
        isVerified: true,
        accessibilitySettings: {
          disabilityType: 'none'
        }
      };
      
      setUser(twitterUser);
      localStorage.setItem('user', JSON.stringify(twitterUser));
      applyAccessibilitySettings(twitterUser.accessibilitySettings);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Twitter login failed:', error);
      setIsLoading(false);
      return false;
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
    
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      enrolledCourses: [],
      createdCourses: [],
      streak: 1,
      lastLoginDate: new Date().toDateString(),
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: false,
      accessibilitySettings
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    applyAccessibilitySettings(accessibilitySettings);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Reset accessibility settings
    const root = document.documentElement;
    root.className = '';
    root.style.fontSize = '';
    root.style.fontFamily = '';
    root.removeAttribute('data-contrast-mode');
    root.style.removeProperty('--partial-vision-font-weight');
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