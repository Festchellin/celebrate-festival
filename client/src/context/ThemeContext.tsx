import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const DEFAULT_THEME_COLOR = '#6366F1';

const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

interface ThemeContextType {
  themeColor: string;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', DEFAULT_THEME_COLOR);
    document.documentElement.style.setProperty('--color-primary-light', adjustColor(DEFAULT_THEME_COLOR, 30));
    document.documentElement.style.setProperty('--color-primary-dark', adjustColor(DEFAULT_THEME_COLOR, -30));
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
      if (storedMode && storedMode !== themeMode) {
        setThemeModeState(storedMode);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [themeMode]);

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeColor: DEFAULT_THEME_COLOR, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
