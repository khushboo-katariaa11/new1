import React, { useState } from 'react';
import { 
  Eye, EyeOff, Volume2, VolumeX, Type, Palette, 
  MousePointer, Keyboard, Settings, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from './AccessibilityProvider';
import { AccessibilitySettings } from '../../types';

const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, updateAccessibilitySettings } = useAuth();
  const { speak } = useAccessibility();
  const settings = user?.accessibilitySettings;

  const toggleSetting = (category: string, setting: string, value?: any) => {
    if (!settings) return;

    const newSettings = { ...settings };
    
    if (category === 'visual' && newSettings.visualSettings) {
      newSettings.visualSettings = {
        ...newSettings.visualSettings,
        [setting]: value !== undefined ? value : !newSettings.visualSettings[setting as keyof typeof newSettings.visualSettings]
      };
    } else if (category === 'hearing' && newSettings.hearingSettings) {
      newSettings.hearingSettings = {
        ...newSettings.hearingSettings,
        [setting]: value !== undefined ? value : !newSettings.hearingSettings[setting as keyof typeof newSettings.hearingSettings]
      };
    } else if (category === 'motor' && newSettings.motorSettings) {
      newSettings.motorSettings = {
        ...newSettings.motorSettings,
        [setting]: value !== undefined ? value : !newSettings.motorSettings[setting as keyof typeof newSettings.motorSettings]
      };
    } else if (category === 'cognitive' && newSettings.cognitiveSettings) {
      newSettings.cognitiveSettings = {
        ...newSettings.cognitiveSettings,
        [setting]: value !== undefined ? value : !newSettings.cognitiveSettings[setting as keyof typeof newSettings.cognitiveSettings]
      };
    }

    updateAccessibilitySettings(newSettings);
  };

  const increaseFontSize = () => {
    const currentSize = settings?.visualSettings?.fontSize || 'medium';
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(currentSize);
    const nextSize = sizes[Math.min(currentIndex + 1, sizes.length - 1)];
    toggleSetting('visual', 'fontSize', nextSize);
  };

  const decreaseFontSize = () => {
    const currentSize = settings?.visualSettings?.fontSize || 'medium';
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(currentSize);
    const prevSize = sizes[Math.max(currentIndex - 1, 0)];
    toggleSetting('visual', 'fontSize', prevSize);
  };

  if (!user || !settings) return null;

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open accessibility toolbar"
        title="Accessibility Options"
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Accessibility Toolbar */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close accessibility toolbar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Visual Settings */}
            {settings.disabilityType === 'visual' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visual</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Font Size</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={decreaseFontSize}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        aria-label="Decrease font size"
                      >
                        <Type className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-gray-500 w-12 text-center">
                        {settings.visualSettings?.fontSize}
                      </span>
                      <button
                        onClick={increaseFontSize}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        aria-label="Increase font size"
                      >
                        <Type className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">High Contrast</span>
                    <button
                      onClick={() => toggleSetting('visual', 'highContrast')}
                      className={`p-1 rounded ${
                        settings.visualSettings?.highContrast 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle high contrast"
                    >
                      <Palette className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dyslexia Font</span>
                    <button
                      onClick={() => toggleSetting('visual', 'dyslexiaFont')}
                      className={`p-1 rounded ${
                        settings.visualSettings?.dyslexiaFont 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle dyslexia-friendly font"
                    >
                      <Type className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Screen Reader</span>
                    <button
                      onClick={() => toggleSetting('visual', 'screenReader')}
                      className={`p-1 rounded ${
                        settings.visualSettings?.screenReader 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle screen reader support"
                    >
                      {settings.visualSettings?.screenReader ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Hearing Settings */}
            {settings.disabilityType === 'hearing' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Hearing</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Video Captions</span>
                    <button
                      onClick={() => toggleSetting('hearing', 'captions')}
                      className={`p-1 rounded ${
                        settings.hearingSettings?.captions 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle video captions"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Visual Alerts</span>
                    <button
                      onClick={() => toggleSetting('hearing', 'visualAlerts')}
                      className={`p-1 rounded ${
                        settings.hearingSettings?.visualAlerts 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle visual alerts"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Motor Settings */}
            {settings.disabilityType === 'motor' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Motor</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Keyboard Navigation</span>
                    <button
                      onClick={() => toggleSetting('motor', 'keyboardOnly')}
                      className={`p-1 rounded ${
                        settings.motorSettings?.keyboardOnly 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle keyboard navigation"
                    >
                      <Keyboard className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Large Click Areas</span>
                    <button
                      onClick={() => toggleSetting('motor', 'largeClickAreas')}
                      className={`p-1 rounded ${
                        settings.motorSettings?.largeClickAreas 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle large click areas"
                    >
                      <MousePointer className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Voice Navigation</span>
                    <button
                      onClick={() => toggleSetting('motor', 'voiceNavigation')}
                      className={`p-1 rounded ${
                        settings.motorSettings?.voiceNavigation 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle voice navigation"
                    >
                      {settings.motorSettings?.voiceNavigation ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Cognitive Settings */}
            {settings.disabilityType === 'cognitive' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cognitive</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Simplified Layout</span>
                    <button
                      onClick={() => toggleSetting('cognitive', 'simplifiedLayout')}
                      className={`p-1 rounded ${
                        settings.cognitiveSettings?.simplifiedLayout 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle simplified layout"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Text-to-Speech</span>
                    <button
                      onClick={() => toggleSetting('cognitive', 'textToSpeech')}
                      className={`p-1 rounded ${
                        settings.cognitiveSettings?.textToSpeech 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle text-to-speech"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Reduced Animations</span>
                    <button
                      onClick={() => toggleSetting('cognitive', 'reducedAnimations')}
                      className={`p-1 rounded ${
                        settings.cognitiveSettings?.reducedAnimations 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}
                      aria-label="Toggle reduced animations"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => speak('Reading page content')}
                  className="p-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  aria-label="Read page aloud"
                >
                  Read Page
                </button>
                <button
                  onClick={() => {
                    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                    if (searchInput) searchInput.focus();
                  }}
                  className="p-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  aria-label="Focus search"
                >
                  Focus Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityToolbar;