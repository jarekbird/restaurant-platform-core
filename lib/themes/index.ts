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
      accent: 'bg-gray-700 text-white',
      text: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-800',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-lg',
      button: 'rounded-md',
      badge: 'rounded-full',
    },
  },
  'cafe-warm': {
    name: 'Cafe Warm',
    colors: {
      primary: 'bg-amber-900 text-white',
      secondary: 'bg-amber-800 text-white',
      background: 'bg-amber-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-amber-600 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-amber-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-xl',
      button: 'rounded-lg',
      badge: 'rounded-full',
    },
  },
  'pizza-bright': {
    name: 'Pizza Bright',
    colors: {
      primary: 'bg-red-600 text-white',
      secondary: 'bg-red-500 text-white',
      background: 'bg-white text-gray-900',
      surface: 'bg-gray-50 text-gray-900',
      accent: 'bg-orange-500 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-lg',
      button: 'rounded-md',
      badge: 'rounded-full',
    },
  },
  'warm-pizza': {
    name: 'Warm Pizza',
    colors: {
      primary: 'bg-orange-600 text-white',
      secondary: 'bg-orange-700 text-white',
      background: 'bg-orange-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-red-500 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-700',
      border: 'border-orange-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-xl',
      button: 'rounded-lg',
      badge: 'rounded-full',
    },
  },
  'modern-sushi': {
    name: 'Modern Sushi',
    colors: {
      primary: 'bg-slate-800 text-white',
      secondary: 'bg-slate-700 text-white',
      background: 'bg-slate-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-emerald-600 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-slate-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-lg',
      button: 'rounded-md',
      badge: 'rounded-full',
    },
  },
  'breakfast-diner': {
    name: 'Breakfast Diner',
    colors: {
      primary: 'bg-yellow-600 text-white',
      secondary: 'bg-yellow-700 text-white',
      background: 'bg-yellow-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-orange-500 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-700',
      border: 'border-yellow-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-lg',
      button: 'rounded-md',
      badge: 'rounded-full',
    },
  },
  'fast-casual': {
    name: 'Fast Casual',
    colors: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-blue-700 text-white',
      background: 'bg-blue-50 text-gray-900',
      surface: 'bg-white text-gray-900',
      accent: 'bg-cyan-500 text-white',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      border: 'border-blue-200',
    },
    typography: {
      heading: 'font-bold',
      body: 'font-normal',
    },
    radii: {
      card: 'rounded-lg',
      button: 'rounded-md',
      badge: 'rounded-full',
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

