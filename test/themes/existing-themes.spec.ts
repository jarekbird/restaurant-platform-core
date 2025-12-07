/**
 * Existing Themes Tests
 * 
 * Verifies that all existing themes have complete token sets,
 * including the new accent color and optional radii tokens.
 */

import { describe, it, expect } from 'vitest';
import { getTheme } from '@/lib/themes';

describe('Existing Themes', () => {
  const themeKeys = ['sushi-dark', 'cafe-warm', 'pizza-bright'] as const;

  describe('Accent Color Token', () => {
    themeKeys.forEach((themeKey) => {
      it(`should have accent color in ${themeKey} theme`, () => {
        const theme = getTheme(themeKey);
        expect(theme.colors.accent).toBeDefined();
        expect(typeof theme.colors.accent).toBe('string');
        expect(theme.colors.accent.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Required Color Tokens', () => {
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

    themeKeys.forEach((themeKey) => {
      it(`should have all required color tokens in ${themeKey} theme`, () => {
        const theme = getTheme(themeKey);
        requiredColorTokens.forEach((token) => {
          expect(theme.colors).toHaveProperty(token);
          expect(typeof theme.colors[token as keyof typeof theme.colors]).toBe('string');
          expect(theme.colors[token as keyof typeof theme.colors].length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Required Typography Tokens', () => {
    const requiredTypographyTokens = ['heading', 'body'];

    themeKeys.forEach((themeKey) => {
      it(`should have all required typography tokens in ${themeKey} theme`, () => {
        const theme = getTheme(themeKey);
        requiredTypographyTokens.forEach((token) => {
          expect(theme.typography).toHaveProperty(token);
          expect(typeof theme.typography[token as keyof typeof theme.typography]).toBe('string');
        });
      });
    });
  });

  describe('Optional Radii Tokens', () => {
    themeKeys.forEach((themeKey) => {
      it(`should have radii tokens in ${themeKey} theme`, () => {
        const theme = getTheme(themeKey);
        expect(theme.radii).toBeDefined();
        if (theme.radii) {
          expect(theme.radii).toHaveProperty('card');
          expect(theme.radii).toHaveProperty('button');
          expect(theme.radii).toHaveProperty('badge');
          expect(typeof theme.radii.card).toBe('string');
          expect(typeof theme.radii.button).toBe('string');
          expect(typeof theme.radii.badge).toBe('string');
        }
      });
    });
  });

  describe('Theme Completeness', () => {
    themeKeys.forEach((themeKey) => {
      it(`should have complete token set in ${themeKey} theme`, () => {
        const theme = getTheme(themeKey);
        
        // Verify all required properties exist
        expect(theme.name).toBeDefined();
        expect(theme.colors).toBeDefined();
        expect(theme.typography).toBeDefined();
        
        // Verify colors object has all required tokens
        expect(theme.colors.primary).toBeDefined();
        expect(theme.colors.secondary).toBeDefined();
        expect(theme.colors.background).toBeDefined();
        expect(theme.colors.surface).toBeDefined();
        expect(theme.colors.accent).toBeDefined();
        expect(theme.colors.text).toBeDefined();
        expect(theme.colors.textMuted).toBeDefined();
        expect(theme.colors.border).toBeDefined();
        
        // Verify typography object has all required tokens
        expect(theme.typography.heading).toBeDefined();
        expect(theme.typography.body).toBeDefined();
        
        // Verify radii is defined (optional but should be present in existing themes)
        expect(theme.radii).toBeDefined();
      });
    });
  });
});

