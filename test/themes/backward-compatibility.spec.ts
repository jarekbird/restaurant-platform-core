/**
 * Theme Backward Compatibility Tests
 * 
 * Verifies that getTheme() and useTheme() work correctly with the extended Theme interface.
 * Ensures backward compatibility and that all required tokens are present.
 */

import { describe, it, expect } from 'vitest';
import { getTheme } from '@/lib/themes';
import { render } from '@testing-library/react';
import {
  RestaurantThemeProvider,
  useTheme,
} from '@/components/theme/ThemeProvider';

describe('Theme Backward Compatibility', () => {
  describe('getTheme() function', () => {
    it('should return complete Theme object for known theme keys', () => {
      const knownKeys = ['sushi-dark', 'cafe-warm', 'pizza-bright'] as const;

      knownKeys.forEach((key) => {
        const theme = getTheme(key);
        
        // Verify theme structure
        expect(theme).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.colors).toBeDefined();
        expect(theme.typography).toBeDefined();
        
        // Verify all required color tokens
        expect(theme.colors.primary).toBeDefined();
        expect(theme.colors.secondary).toBeDefined();
        expect(theme.colors.background).toBeDefined();
        expect(theme.colors.surface).toBeDefined();
        expect(theme.colors.accent).toBeDefined();
        expect(theme.colors.text).toBeDefined();
        expect(theme.colors.textMuted).toBeDefined();
        expect(theme.colors.border).toBeDefined();
        
        // Verify all required typography tokens
        expect(theme.typography.heading).toBeDefined();
        expect(theme.typography.body).toBeDefined();
      });
    });

    it('should return default theme for unknown theme keys', () => {
      const unknownKey = 'non-existent-theme';
      const theme = getTheme(unknownKey);
      
      // Should fallback to sushi-dark (default)
      expect(theme.name).toBe('Sushi Dark');
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.accent).toBeDefined();
    });

    it('should return Theme with all required tokens for known keys', () => {
      const theme = getTheme('sushi-dark');
      
      // Verify all required color tokens are present and non-empty
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
      
      requiredColorTokens.forEach((token) => {
        const value = theme.colors[token as keyof typeof theme.colors];
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
      
      // Verify all required typography tokens are present
      expect(theme.typography.heading).toBeDefined();
      expect(theme.typography.body).toBeDefined();
    });

    it('should return Theme with optional radii tokens', () => {
      const theme = getTheme('sushi-dark');
      
      // Radii should be defined (we added them in TASK-1.3.2)
      expect(theme.radii).toBeDefined();
      if (theme.radii) {
        expect(theme.radii.card).toBeDefined();
        expect(theme.radii.button).toBeDefined();
        expect(theme.radii.badge).toBeDefined();
      }
    });
  });

  describe('useTheme() hook', () => {
    it('should provide access to all theme tokens', () => {
      const ThemeTokenChecker = () => {
        const theme = useTheme();
        return (
          <div>
            <div data-testid="has-accent">
              {theme.colors.accent ? 'yes' : 'no'}
            </div>
            <div data-testid="has-primary">
              {theme.colors.primary ? 'yes' : 'no'}
            </div>
            <div data-testid="has-radii">
              {theme.radii ? 'yes' : 'no'}
            </div>
          </div>
        );
      };

      const { getByTestId } = render(
        <RestaurantThemeProvider themeKey="sushi-dark">
          <ThemeTokenChecker />
        </RestaurantThemeProvider>
      );

      expect(getByTestId('has-accent').textContent).toBe('yes');
      expect(getByTestId('has-primary').textContent).toBe('yes');
      expect(getByTestId('has-radii').textContent).toBe('yes');
    });

    it('should provide access to accent color token', () => {
      const AccentColorChecker = () => {
        const theme = useTheme();
        return (
          <div data-testid="accent-color">{theme.colors.accent}</div>
        );
      };

      const { getByTestId } = render(
        <RestaurantThemeProvider themeKey="cafe-warm">
          <AccentColorChecker />
        </RestaurantThemeProvider>
      );

      const accentColor = getByTestId('accent-color').textContent;
      expect(accentColor).toBeDefined();
      expect(accentColor?.length).toBeGreaterThan(0);
    });

    it('should provide access to optional radii tokens', () => {
      const RadiiChecker = () => {
        const theme = useTheme();
        return (
          <div>
            <div data-testid="card-radius">
              {theme.radii?.card || 'not-defined'}
            </div>
            <div data-testid="button-radius">
              {theme.radii?.button || 'not-defined'}
            </div>
            <div data-testid="badge-radius">
              {theme.radii?.badge || 'not-defined'}
            </div>
          </div>
        );
      };

      const { getByTestId } = render(
        <RestaurantThemeProvider themeKey="pizza-bright">
          <RadiiChecker />
        </RestaurantThemeProvider>
      );

      expect(getByTestId('card-radius').textContent).not.toBe('not-defined');
      expect(getByTestId('button-radius').textContent).not.toBe('not-defined');
      expect(getByTestId('badge-radius').textContent).not.toBe('not-defined');
    });

    it('should work with different theme keys', () => {
      const ThemeNameChecker = () => {
        const theme = useTheme();
        return <div data-testid="theme-name">{theme.name}</div>;
      };

      const themeKeys = ['sushi-dark', 'cafe-warm', 'pizza-bright'] as const;
      const expectedNames = ['Sushi Dark', 'Cafe Warm', 'Pizza Bright'];

      themeKeys.forEach((key, index) => {
        const { getByTestId, unmount } = render(
          <RestaurantThemeProvider themeKey={key}>
            <ThemeNameChecker />
          </RestaurantThemeProvider>
        );

        expect(getByTestId('theme-name').textContent).toBe(expectedNames[index]);
        unmount();
      });
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for sushi-dark theme', () => {
      const theme = getTheme('sushi-dark');
      
      // Create a snapshot of the theme structure
      const themeSnapshot = {
        name: theme.name,
        hasColors: !!theme.colors,
        hasTypography: !!theme.typography,
        hasRadii: !!theme.radii,
        colorKeys: Object.keys(theme.colors).sort(),
        typographyKeys: Object.keys(theme.typography).sort(),
        radiiKeys: theme.radii ? Object.keys(theme.radii).sort() : [],
      };
      
      // Verify theme structure matches expected format
      expect(themeSnapshot.name).toBe('Sushi Dark');
      expect(themeSnapshot.hasColors).toBe(true);
      expect(themeSnapshot.hasTypography).toBe(true);
      expect(themeSnapshot.hasRadii).toBe(true);
      expect(themeSnapshot.colorKeys).toContain('accent');
      expect(themeSnapshot.colorKeys).toContain('primary');
      expect(themeSnapshot.colorKeys).toContain('background');
      expect(themeSnapshot.radiiKeys).toContain('card');
      expect(themeSnapshot.radiiKeys).toContain('button');
      expect(themeSnapshot.radiiKeys).toContain('badge');
    });
  });
});

