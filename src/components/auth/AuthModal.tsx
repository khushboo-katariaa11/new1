import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AccessibilitySettings } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'instructor'
  });
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    disabilityType: 'none'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessibilityForm, setShowAccessibilityForm] = useState(false);
  
  const { login, register, loginWithGoogle, loginWithTwitter } = useAuth();

  // Apply accessibility settings immediately when they change
  useEffect(() => {
    if (accessibilitySettings.disabilityType !== 'none') {
      applyAccessibilitySettingsImmediately(accessibilitySettings);
    } else {
      // Reset accessibility settings if none selected
      resetAccessibilitySettings();
    }
  }, [accessibilitySettings]);

  const applyAccessibilitySettingsImmediately = (settings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Reset previous accessibility classes
    root.className = root.className.replace(/\b(high-contrast|large-click-areas|keyboard-navigation|simplified-layout|reduced-animations|generous-spacing|screen-magnifier-compatible|large-click-targets|keyboard-focus-indicators|partial-vision-contrast|partial-vision-font-weight|color-blind-\w+)\b/g, '');
    root.removeAttribute('data-contrast-mode');
    root.style.removeProperty('--partial-vision-font-weight');

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
      } else {
        root.style.fontFamily = '';
      }

      // High contrast (existing)
      if (visualSettings.highContrast) {
        root.classList.add('high-contrast');
      }

      // Partial vision features
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

  const resetAccessibilitySettings = () => {
    const root = document.documentElement;
    root.className = root.className.replace(/\b(high-contrast|large-click-areas|keyboard-navigation|simplified-layout|reduced-animations|generous-spacing|screen-magnifier-compatible|large-click-targets|keyboard-focus-indicators|partial-vision-contrast|partial-vision-font-weight|color-blind-\w+)\b/g, '');
    root.style.fontSize = '';
    root.style.fontFamily = '';
    root.removeAttribute('data-contrast-mode');
    root.style.removeProperty('--partial-vision-font-weight');
    root.removeAttribute('aria-live');
  };

  // Clean up accessibility settings when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetAccessibilitySettings();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password. Try: john@student.com or jane@instructor.com');
        }
      } else {
        success = await register(formData.name, formData.email, formData.password, formData.role, accessibilitySettings);
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }

      if (success) {
        onClose();
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setAccessibilitySettings({ disabilityType: 'none' });
        setShowAccessibilityForm(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const success = await loginWithGoogle();
      if (success) {
        onClose();
      } else {
        setError('Google login failed. Please try again.');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const success = await loginWithTwitter();
      if (success) {
        onClose();
      } else {
        setError('Twitter login failed. Please try again.');
      }
    } catch (err) {
      setError('Twitter login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAccessibilityChange = (field: string, value: any) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDisabilityTypeChange = (type: string) => {
    setAccessibilitySettings({
      disabilityType: type as any,
      ...(type === 'visual' && {
        visualSettings: {
          type: 'partial',
          fontSize: 'medium',
          highContrast: false,
          screenReader: false,
          dyslexiaFont: false,
          // New partial vision features
          highContrastMode: 'none',
          fontWeight: 'normal',
          screenMagnifierCompatible: false,
          generousSpacing: false,
          largeClickTargets: false,
          keyboardFocusIndicators: false
        }
      }),
      ...(type === 'hearing' && {
        hearingSettings: {
          captions: true,
          visualAlerts: true,
          signLanguage: false
        }
      }),
      ...(type === 'motor' && {
        motorSettings: {
          voiceNavigation: false,
          keyboardOnly: true,
          largeClickAreas: true,
          headMovement: false
        }
      }),
      ...(type === 'cognitive' && {
        cognitiveSettings: {
          simplifiedLayout: true,
          textToSpeech: false,
          consistentNavigation: true,
          reducedAnimations: true
        }
      })
    });
  };

  const handlePartialVisionFeatureChange = (feature: string, value: any) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      visualSettings: {
        ...prev.visualSettings!,
        [feature]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to your account to continue learning' 
              : 'Join LearnHub and start your learning journey'
            }
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">
              {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </button>

          <button
            onClick={handleTwitterLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="text-gray-700 font-medium">
              {mode === 'login' ? 'Sign in with Twitter' : 'Sign up with Twitter'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {mode === 'login' && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-700">
              <strong>Demo Accounts:</strong><br />
              Student: john@student.com<br />
              Instructor: jane@instructor.com<br />
              Admin: admin@learnhub.com<br />
              Password: any text
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  I want to
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="student">Learn (Student)</option>
                  <option value="instructor">Teach (Instructor)</option>
                </select>
              </div>

              {/* Accessibility Settings */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Accessibility Settings (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAccessibilityForm(!showAccessibilityForm)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showAccessibilityForm ? 'Hide' : 'Configure'}
                  </button>
                </div>

                {showAccessibilityForm && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you have any accessibility needs?
                      </label>
                      <select
                        value={accessibilitySettings.disabilityType}
                        onChange={(e) => handleDisabilityTypeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="none">No accessibility needs</option>
                        <option value="visual">Visual impairment</option>
                        <option value="hearing">Hearing impairment</option>
                        <option value="motor">Motor disability</option>
                        <option value="cognitive">Cognitive disability</option>
                      </select>
                    </div>

                    {/* Visual Settings */}
                    {accessibilitySettings.disabilityType === 'visual' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Visual Impairment Type
                          </label>
                          <select
                            value={accessibilitySettings.visualSettings?.type}
                            onChange={(e) => handleAccessibilityChange('visualSettings', {
                              ...accessibilitySettings.visualSettings,
                              type: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="partial">Partial vision</option>
                            <option value="colorBlind">Color blindness</option>
                            <option value="blind">Complete blindness</option>
                          </select>
                        </div>

                        {/* Color Blindness Types */}
                        {accessibilitySettings.visualSettings?.type === 'colorBlind' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Color Blindness Type
                            </label>
                            <select
                              value={accessibilitySettings.visualSettings?.colorBlindType}
                              onChange={(e) => handleAccessibilityChange('visualSettings', {
                                ...accessibilitySettings.visualSettings,
                                colorBlindType: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                              <option value="protanopia">Protanopia (Red-blind)</option>
                              <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                              <option value="tritanopia">Tritanopia (Blue-blind)</option>
                              <option value="protanomaly">Protanomaly (Reduced red sensitivity)</option>
                              <option value="deuteranomaly">Deuteranomaly (Reduced green sensitivity)</option>
                              <option value="tritanomaly">Tritanomaly (Reduced blue sensitivity)</option>
                              <option value="monochromacy">Monochromacy (Complete color blindness)</option>
                              <option value="achromatopsia">Achromatopsia (No color vision)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              The entire interface will adapt to your specific type of color blindness
                            </p>
                          </div>
                        )}

                        {/* Partial Vision Features */}
                        {accessibilitySettings.visualSettings?.type === 'partial' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-3">Partial Vision Features</h4>
                            
                            {/* Clarity & Readability */}
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-blue-800 mb-2">Clarity & Readability</h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">
                                    High-Contrast Mode
                                  </label>
                                  <select
                                    value={accessibilitySettings.visualSettings?.highContrastMode || 'none'}
                                    onChange={(e) => handlePartialVisionFeatureChange('highContrastMode', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                  >
                                    <option value="none">None</option>
                                    <option value="black-yellow">Black text on yellow background</option>
                                    <option value="white-black">White text on black background</option>
                                    <option value="yellow-black">Yellow text on black background</option>
                                    <option value="blue-white">Blue text on white background</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Font Weight
                                  </label>
                                  <select
                                    value={accessibilitySettings.visualSettings?.fontWeight || 'normal'}
                                    onChange={(e) => handlePartialVisionFeatureChange('fontWeight', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="medium">Medium (500)</option>
                                    <option value="semibold">Semi-bold (600)</option>
                                    <option value="bold">Bold (700)</option>
                                    <option value="extrabold">Extra-bold (800)</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Layout & Magnification */}
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-blue-800 mb-2">Layout & Magnification</h5>
                              <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={accessibilitySettings.visualSettings?.screenMagnifierCompatible || false}
                                    onChange={(e) => handlePartialVisionFeatureChange('screenMagnifierCompatible', e.target.checked)}
                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Screen magnifier compatibility</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={accessibilitySettings.visualSettings?.generousSpacing || false}
                                    onChange={(e) => handlePartialVisionFeatureChange('generousSpacing', e.target.checked)}
                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Generous spacing between elements</span>
                                </label>
                              </div>
                            </div>

                            {/* Interaction */}
                            <div>
                              <h5 className="text-sm font-medium text-blue-800 mb-2">Interaction</h5>
                              <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={accessibilitySettings.visualSettings?.largeClickTargets || false}
                                    onChange={(e) => handlePartialVisionFeatureChange('largeClickTargets', e.target.checked)}
                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Large, clear click targets</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={accessibilitySettings.visualSettings?.keyboardFocusIndicators || false}
                                    onChange={(e) => handlePartialVisionFeatureChange('keyboardFocusIndicators', e.target.checked)}
                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Prominent keyboard focus indicators</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Existing Visual Settings */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={accessibilitySettings.visualSettings?.dyslexiaFont}
                              onChange={(e) => handleAccessibilityChange('visualSettings', {
                                ...accessibilitySettings.visualSettings,
                                dyslexiaFont: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Use dyslexia-friendly font</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={accessibilitySettings.visualSettings?.highContrast}
                              onChange={(e) => handleAccessibilityChange('visualSettings', {
                                ...accessibilitySettings.visualSettings,
                                highContrast: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">High contrast mode</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={accessibilitySettings.visualSettings?.screenReader}
                              onChange={(e) => handleAccessibilityChange('visualSettings', {
                                ...accessibilitySettings.visualSettings,
                                screenReader: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Screen reader support</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Hearing Settings */}
                    {accessibilitySettings.disabilityType === 'hearing' && (
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.hearingSettings?.captions}
                            onChange={(e) => handleAccessibilityChange('hearingSettings', {
                              ...accessibilitySettings.hearingSettings,
                              captions: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Enable video captions</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.hearingSettings?.visualAlerts}
                            onChange={(e) => handleAccessibilityChange('hearingSettings', {
                              ...accessibilitySettings.hearingSettings,
                              visualAlerts: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Visual alerts for sounds</span>
                        </label>
                      </div>
                    )}

                    {/* Motor Settings */}
                    {accessibilitySettings.disabilityType === 'motor' && (
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.motorSettings?.keyboardOnly}
                            onChange={(e) => handleAccessibilityChange('motorSettings', {
                              ...accessibilitySettings.motorSettings,
                              keyboardOnly: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Keyboard-only navigation</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.motorSettings?.largeClickAreas}
                            onChange={(e) => handleAccessibilityChange('motorSettings', {
                              ...accessibilitySettings.motorSettings,
                              largeClickAreas: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Large clickable areas</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.motorSettings?.voiceNavigation}
                            onChange={(e) => handleAccessibilityChange('motorSettings', {
                              ...accessibilitySettings.motorSettings,
                              voiceNavigation: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Voice navigation</span>
                        </label>
                      </div>
                    )}

                    {/* Cognitive Settings */}
                    {accessibilitySettings.disabilityType === 'cognitive' && (
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.cognitiveSettings?.simplifiedLayout}
                            onChange={(e) => handleAccessibilityChange('cognitiveSettings', {
                              ...accessibilitySettings.cognitiveSettings,
                              simplifiedLayout: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Simplified layout</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.cognitiveSettings?.textToSpeech}
                            onChange={(e) => handleAccessibilityChange('cognitiveSettings', {
                              ...accessibilitySettings.cognitiveSettings,
                              textToSpeech: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Text-to-speech</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={accessibilitySettings.cognitiveSettings?.reducedAnimations}
                            onChange={(e) => handleAccessibilityChange('cognitiveSettings', {
                              ...accessibilitySettings.cognitiveSettings,
                              reducedAnimations: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Reduced animations</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setFormData({ name: '', email: '', password: '', role: 'student' });
                setShowAccessibilityForm(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;