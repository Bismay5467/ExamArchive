/* eslint-disable react/jsx-no-constructed-context-values */

import { createContext, useContext, useEffect, useState } from 'react';

import {
  TTheme,
  TThemeProviderProps,
  TThemeProviderState,
} from '@/types/theme';
import { THEME } from '@/constants/shared';

const initialState: TThemeProviderState = {
  theme: THEME.SYSTEM,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<TThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = THEME.SYSTEM,
  storageKey = 'vite-ui-theme',
  ...props
}: TThemeProviderProps) {
  const [theme, setTheme] = useState<TTheme>(
    () => (localStorage.getItem(storageKey) as TTheme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(THEME.LIGHT, THEME.DARK);

    if (theme === THEME.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? THEME.DARK
        : THEME.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (themeval: TTheme) => {
      localStorage.setItem(storageKey, themeval);
      setTheme(themeval);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
