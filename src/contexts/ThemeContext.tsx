
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check for system preference if no saved theme
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return (savedTheme as ThemeType) || 'light';
  });

  // Effect to apply theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply theme immediately but with smooth transition
    const transitionClass = 'transition-colors';
    
    if (!root.classList.contains(transitionClass)) {
      root.classList.add(transitionClass);
    }
    
    // Update root class with small delay to allow transition to initialize
    setTimeout(() => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }, 10);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Cleanup transition class after transition completes
    const transitionTimeout = setTimeout(() => {
      root.classList.remove('transition-colors');
      root.style.removeProperty('--theme-transition');
    }, 500);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
