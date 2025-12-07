/**
 * Theme system for restaurant platform
 * Defines theme tokens and theme configurations
 */

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  radii?: {
    card: string;
    button: string;
    badge: string;
  };
}

export const themes: Record<string, Theme> = {
  'sushi-dark': {
    name: 'Sushi Dark',
    colors: {
      primary: 'bg-black text-white',
      secondary: 'bg-gray-900 text-white',
      background: 'bg-black text-white',
      surface: 'bg-gray-900 text-white',
      accent: 'bg-gray-700 text-white', // Placeholder - will be updated in TASK-1.3.2
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-800',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
  },
  'cafe-warm': {
    name: 'Cafe Warm',
    colors: {
      primary: 'bg-amber-900 text-white',
      secondary: 'bg-amber-800 text-white',
      background: 'bg-amber-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-amber-700 text-white', // Placeholder - will be updated in TASK-1.3.2
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-amber-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
  },
  'pizza-bright': {
    name: 'Pizza Bright',
    colors: {
      primary: 'bg-red-600 text-white',
      secondary: 'bg-red-500 text-white',
      background: 'bg-white text-gray-900',
      surface: 'bg-gray-50 text-gray-900',
      accent: 'bg-red-400 text-white', // Placeholder - will be updated in TASK-1.3.2
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
  },
};

export type ThemeKey = keyof typeof themes;

/**
 * Get theme by key, with fallback to default theme
 */
export function getTheme(themeKey: string): Theme {
  return themes[themeKey] || themes['sushi-dark'];
}

