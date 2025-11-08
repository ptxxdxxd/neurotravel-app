import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  name: string;
  displayName: string;
  className: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

interface ThemeContextType {
  currentTheme: string;
  currentThemeObject: Theme;
  currentThemeName: string;
  themes: Record<string, Theme>;
  changeTheme: (themeName: string) => void;
  toggleTheme: () => void;
  fontSize: string;
  changeFontSize: (size: string) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function useTheme() {
  return useContext(ThemeContext);
}

const themes: Record<string, Theme> = {
  light: {
    name: 'light',
    displayName: 'Light',
    className: 'theme-light',
    colors: {
      primary: 'bg-indigo-600',
      secondary: 'bg-blue-500',
      background: 'bg-white',
      surface: 'bg-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600'
    }
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    className: 'theme-dark',
    colors: {
      primary: 'bg-indigo-500',
      secondary: 'bg-blue-400',
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300'
    }
  },
  highContrast: {
    name: 'highContrast',
    displayName: 'High Contrast',
    className: 'theme-high-contrast',
    colors: {
      primary: 'bg-black',
      secondary: 'bg-yellow-400',
      background: 'bg-white',
      surface: 'bg-gray-100',
      text: 'text-black',
      textSecondary: 'text-gray-900'
    }
  },
  warm: {
    name: 'warm',
    displayName: 'Warm',
    className: 'theme-warm',
    colors: {
      primary: 'bg-orange-500',
      secondary: 'bg-red-400',
      background: 'bg-orange-50',
      surface: 'bg-orange-100',
      text: 'text-orange-900',
      textSecondary: 'text-orange-700'
    }
  },
  cool: {
    name: 'cool',
    displayName: 'Cool',
    className: 'theme-cool',
    colors: {
      primary: 'bg-teal-500',
      secondary: 'bg-cyan-400',
      background: 'bg-teal-50',
      surface: 'bg-teal-100',
      text: 'text-teal-900',
      textSecondary: 'text-teal-700'
    }
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeName, setCurrentThemeName] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('neurotravel-theme');
    const savedFontSize = localStorage.getItem('neurotravel-font-size');
    const savedReducedMotion = localStorage.getItem('neurotravel-reduced-motion');

    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeName(savedTheme);
    }
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
    if (savedReducedMotion) {
      setReducedMotion(JSON.parse(savedReducedMotion));
    }

    // Check for system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !savedReducedMotion) {
      setReducedMotion(true);
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(themes).forEach(theme => {
      root.classList.remove(theme.className);
    });
    
    // Add current theme class
    root.classList.add(themes[currentThemeName].className);
    
    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    const fontSizeClass = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      'extra-large': 'text-xl'
    }[fontSize] || 'text-base';
    root.classList.add(fontSizeClass);
    
    // Apply reduced motion
    if (reducedMotion) {
      root.style.setProperty('--motion-duration', '0s');
      root.classList.add('motion-reduce');
    } else {
      root.style.removeProperty('--motion-duration');
      root.classList.remove('motion-reduce');
    }
  }, [currentThemeName, fontSize, reducedMotion]);

  const changeTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
      localStorage.setItem('neurotravel-theme', themeName);
    }
  };

  const toggleTheme = () => {
    const themeNames = Object.keys(themes);
    const currentIndex = themeNames.indexOf(currentThemeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    changeTheme(themeNames[nextIndex]);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem('neurotravel-font-size', size);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('neurotravel-reduced-motion', JSON.stringify(newValue));
  };

  const value = {
    currentTheme: themes[currentThemeName].className,
    currentThemeObject: themes[currentThemeName],
    currentThemeName,
    themes,
    changeTheme,
    toggleTheme,
    fontSize,
    changeFontSize,
    reducedMotion,
    toggleReducedMotion
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}