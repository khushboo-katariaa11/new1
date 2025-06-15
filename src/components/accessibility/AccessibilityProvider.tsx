import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AccessibilitySettings } from '../../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings | null;
  updateSettings: (settings: AccessibilitySettings) => void;
  speak: (text: string) => void;
  enableKeyboardNavigation: () => void;
  enableVoiceNavigation: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateAccessibilitySettings } = useAuth();
  const settings = user?.accessibilitySettings || null;

  useEffect(() => {
    if (settings) {
      applyAccessibilityFeatures(settings);
    }
  }, [settings]);

  const applyAccessibilityFeatures = (settings: AccessibilitySettings) => {
    // Keyboard navigation
    if (settings.motorSettings?.keyboardOnly) {
      enableKeyboardNavigation();
    }

    // Voice navigation
    if (settings.motorSettings?.voiceNavigation) {
      enableVoiceNavigation();
    }

    // Screen reader announcements
    if (settings.visualSettings?.screenReader) {
      announcePageChanges();
    }

    // Text-to-speech
    if (settings.cognitiveSettings?.textToSpeech) {
      enableTextToSpeech();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const enableKeyboardNavigation = () => {
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Make all interactive elements focusable
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach((element, index) => {
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
  };

  const handleKeyboardNavigation = (event: KeyboardEvent) => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);
    
    switch (event.key) {
      case 'Tab':
        // Default tab behavior
        break;
      case 'Enter':
      case ' ':
        if (document.activeElement?.tagName === 'BUTTON') {
          (document.activeElement as HTMLButtonElement).click();
        }
        break;
      case 'Escape':
        // Close modals or return to main content
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('[aria-label="Close"]');
          if (closeButton) {
            (closeButton as HTMLButtonElement).click();
          }
        }
        break;
    }
  };

  const enableVoiceNavigation = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        handleVoiceCommand(command);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      // Start listening for voice commands
      recognition.start();

      // Restart recognition when it ends
      recognition.onend = () => {
        recognition.start();
      };
    }
  };

  const handleVoiceCommand = (command: string) => {
    const commands = {
      'go home': () => window.location.href = '/',
      'open menu': () => {
        const menuButton = document.querySelector('[aria-label="Menu"]');
        if (menuButton) (menuButton as HTMLButtonElement).click();
      },
      'search': () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
        if (searchInput) (searchInput as HTMLInputElement).focus();
      },
      'next page': () => {
        const nextButton = document.querySelector('[aria-label="Next"], [aria-label="Next page"]');
        if (nextButton) (nextButton as HTMLButtonElement).click();
      },
      'previous page': () => {
        const prevButton = document.querySelector('[aria-label="Previous"], [aria-label="Previous page"]');
        if (prevButton) (prevButton as HTMLButtonElement).click();
      },
      'play video': () => {
        const playButton = document.querySelector('[aria-label="Play"], .react-player button');
        if (playButton) (playButton as HTMLButtonElement).click();
      },
      'pause video': () => {
        const pauseButton = document.querySelector('[aria-label="Pause"], .react-player button');
        if (pauseButton) (pauseButton as HTMLButtonElement).click();
      }
    };

    const matchedCommand = Object.keys(commands).find(cmd => command.includes(cmd));
    if (matchedCommand) {
      commands[matchedCommand as keyof typeof commands]();
      speak(`Executing ${matchedCommand}`);
    }
  };

  const announcePageChanges = () => {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('accessibility-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Announce page title changes
    const observer = new MutationObserver(() => {
      const title = document.title;
      if (liveRegion) {
        liveRegion.textContent = `Page changed to ${title}`;
      }
    });

    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });
  };

  const enableTextToSpeech = () => {
    // Add click listeners to read content aloud
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.hasAttribute('data-speak') || target.closest('[data-speak]')) {
        const textToSpeak = target.textContent || target.getAttribute('aria-label') || '';
        if (textToSpeak) {
          speak(textToSpeak);
        }
      }
    });

    // Add keyboard shortcut for reading current focus
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        const activeElement = document.activeElement as HTMLElement;
        const textToSpeak = activeElement?.textContent || activeElement?.getAttribute('aria-label') || '';
        if (textToSpeak) {
          speak(textToSpeak);
        }
      }
    });
  };

  const updateSettings = (newSettings: AccessibilitySettings) => {
    updateAccessibilitySettings(newSettings);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      speak,
      enableKeyboardNavigation,
      enableVoiceNavigation
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};