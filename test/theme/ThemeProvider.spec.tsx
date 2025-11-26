/**
 * Tests for ThemeProvider and useTheme hook
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  RestaurantThemeProvider,
  useTheme,
} from '@/components/theme/ThemeProvider';

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const theme = useTheme();
    return <div data-testid="theme-name">{theme.name}</div>;
  };

  it('should provide correct theme for sushi-dark', () => {
    const { getByTestId } = render(
      <RestaurantThemeProvider themeKey="sushi-dark">
        <TestComponent />
      </RestaurantThemeProvider>
    );

    expect(getByTestId('theme-name').textContent).toBe('Sushi Dark');
  });

  it('should provide correct theme for cafe-warm', () => {
    const { getByTestId } = render(
      <RestaurantThemeProvider themeKey="cafe-warm">
        <TestComponent />
      </RestaurantThemeProvider>
    );

    expect(getByTestId('theme-name').textContent).toBe('Cafe Warm');
  });

  it('should provide correct theme for pizza-bright', () => {
    const { getByTestId } = render(
      <RestaurantThemeProvider themeKey="pizza-bright">
        <TestComponent />
      </RestaurantThemeProvider>
    );

    expect(getByTestId('theme-name').textContent).toBe('Pizza Bright');
  });

  it('should fallback to default theme for unknown theme key', () => {
    const { getByTestId } = render(
      <RestaurantThemeProvider themeKey="unknown-theme">
        <TestComponent />
      </RestaurantThemeProvider>
    );

    expect(getByTestId('theme-name').textContent).toBe('Sushi Dark');
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a RestaurantThemeProvider');

    consoleSpy.mockRestore();
  });

  it('should provide theme with all required properties', () => {
    const ThemeChecker = () => {
      const theme = useTheme();
      return (
        <div>
          <div data-testid="has-colors">
            {theme.colors ? 'yes' : 'no'}
          </div>
          <div data-testid="has-typography">
            {theme.typography ? 'yes' : 'no'}
          </div>
        </div>
      );
    };

    const { getByTestId } = render(
      <RestaurantThemeProvider themeKey="sushi-dark">
        <ThemeChecker />
      </RestaurantThemeProvider>
    );

    expect(getByTestId('has-colors').textContent).toBe('yes');
    expect(getByTestId('has-typography').textContent).toBe('yes');
  });
});

