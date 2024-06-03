import React from 'react';

export type TTheme = 'dark' | 'light' | 'system';

export type TThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: TTheme;
  storageKey?: string;
};

export type TThemeProviderState = {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
};
