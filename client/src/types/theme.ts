import React from 'react';
import { THEME } from '@/constants/shared';

export type TTheme = (typeof THEME)[keyof typeof THEME];

export type TThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: TTheme;
  storageKey?: string;
};

export type TThemeProviderState = {
  theme: TTheme;
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: TTheme) => void;
};
