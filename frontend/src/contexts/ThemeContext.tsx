import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'neo-brutalism' | 'light' | 'dark' | 'gaming';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('neo-brutalism');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('pc-builder-theme') as Theme;
    if (savedTheme && ['neo-brutalism', 'light', 'dark', 'gaming'].includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pc-builder-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
