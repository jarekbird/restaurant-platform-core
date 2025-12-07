/**
 * Theme Interface Tests
 * 
 * Verifies that the Theme interface includes all required tokens,
 * including the new accent color and optional radii tokens.
 */

import { describe, it, expect } from 'vitest';
import { Theme } from '@/lib/themes';

describe('Theme Interface', () => {
  describe('Required Color Tokens', () => {
    it('should include accent color token', () => {
      const mockTheme: Theme = {
        name: 'Test Theme',
        colors: {
          primary: 'bg-red-600 text-white',
          secondary: 'bg-red-500 text-white',
          background: 'bg-white text-gray-900',
          surface: 'bg-gray-50 text-gray-900',
          accent: 'bg-red-400 text-white',
          text: 'text-gray-900',
          textMuted: 'text-gray-600',
          border: 'border-gray-200',
        },
        typography: {
          heading: 'font-bold',
          body: 'font-normal',
        },
      };

      expect(mockTheme.colors.accent).toBeDefined();
      expect(typeof mockTheme.colors.accent).toBe('string');
    });

    it('should include all required color tokens', () => {
      const requiredColorTokens = [
        'primary',
        'secondary',
        'background',
        'surface',
        'accent',
        'text',
        'textMuted',
        'border',
      ];

      const mockTheme: Theme = {
        name: 'Test Theme',
        colors: {
          primary: 'bg-red-600 text-white',
          secondary: 'bg-red-500 text-white',
          background: 'bg-white text-gray-900',
          surface: 'bg-gray-50 text-gray-900',
          accent: 'bg-red-400 text-white',
          text: 'text-gray-900',
          textMuted: 'text-gray-600',
          border: 'border-gray-200',
        },
        typography: {
          heading: 'font-bold',
          body: 'font-normal',
        },
      };

      requiredColorTokens.forEach((token) => {
        expect(mockTheme.colors).toHaveProperty(token);
        expect(typeof mockTheme.colors[token as keyof typeof mockTheme.colors]).toBe('string');
      });
    });
  });

  describe('Optional Radii Tokens', () => {
    it('should allow optional radii object', () => {
      const mockThemeWithRadii: Theme = {
        name: 'Test Theme',
        colors: {
          primary: 'bg-red-600 text-white',
          secondary: 'bg-red-500 text-white',
          background: 'bg-white text-gray-900',
          surface: 'bg-gray-50 text-gray-900',
          accent: 'bg-red-400 text-white',
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
      };

      expect(mockThemeWithRadii.radii).toBeDefined();
      expect(mockThemeWithRadii.radii?.card).toBe('rounded-lg');
      expect(mockThemeWithRadii.radii?.button).toBe('rounded-md');
      expect(mockThemeWithRadii.radii?.badge).toBe('rounded-full');
    });

    it('should allow theme without radii (optional)', () => {
      const mockThemeWithoutRadii: Theme = {
        name: 'Test Theme',
        colors: {
          primary: 'bg-red-600 text-white',
          secondary: 'bg-red-500 text-white',
          background: 'bg-white text-gray-900',
          surface: 'bg-gray-50 text-gray-900',
          accent: 'bg-red-400 text-white',
          text: 'text-gray-900',
          textMuted: 'text-gray-600',
          border: 'border-gray-200',
        },
        typography: {
          heading: 'font-bold',
          body: 'font-normal',
        },
      };

      expect(mockThemeWithoutRadii.radii).toBeUndefined();
    });

    it('should include all radii properties when present', () => {
      const mockTheme: Theme = {
        name: 'Test Theme',
        colors: {
          primary: 'bg-red-600 text-white',
          secondary: 'bg-red-500 text-white',
          background: 'bg-white text-gray-900',
          surface: 'bg-gray-50 text-gray-900',
          accent: 'bg-red-400 text-white',
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
      };

      if (mockTheme.radii) {
        expect(mockTheme.radii).toHaveProperty('card');
        expect(mockTheme.radii).toHaveProperty('button');
        expect(mockTheme.radii).toHaveProperty('badge');
        expect(typeof mockTheme.radii.card).toBe('string');
        expect(typeof mockTheme.radii.button).toBe('string');
        expect(typeof mockTheme.radii.badge).toBe('string');
      }
    });
  });
});

