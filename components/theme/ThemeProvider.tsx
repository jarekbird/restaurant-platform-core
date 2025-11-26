'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Theme, getTheme } from '@/lib/themes';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface RestaurantThemeProviderProps {
  themeKey: string;
  children: ReactNode;
}

/**
 * RestaurantThemeProvider component
 * Provides theme context to child components
 * Selects theme from themes record based on themeKey
 */
export function RestaurantThemeProvider({
  themeKey,
  children,
}: RestaurantThemeProviderProps) {
  const theme = getTheme(themeKey);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme hook
 * Returns the current theme from context
 * Throws error if used outside RestaurantThemeProvider
 */
export function useTheme(): Theme {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a RestaurantThemeProvider'
    );
  }

  return context.theme;
}

