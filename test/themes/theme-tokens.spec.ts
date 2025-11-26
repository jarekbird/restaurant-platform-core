/**
 * Tests for theme tokens
 */

import { describe, it, expect } from 'vitest';
import { themes, getTheme } from '@/lib/themes';

describe('Theme Tokens', () => {
  it('should define sushi-dark theme', () => {
    const theme = themes['sushi-dark'];
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Sushi Dark');
    expect(theme.colors).toBeDefined();
    expect(theme.typography).toBeDefined();
  });

  it('should define cafe-warm theme', () => {
    const theme = themes['cafe-warm'];
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Cafe Warm');
    expect(theme.colors).toBeDefined();
    expect(theme.typography).toBeDefined();
  });

  it('should define pizza-bright theme', () => {
    const theme = themes['pizza-bright'];
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Pizza Bright');
    expect(theme.colors).toBeDefined();
    expect(theme.typography).toBeDefined();
  });

  it('should have all required color properties', () => {
    const theme = themes['sushi-dark'];
    expect(theme.colors.primary).toBeDefined();
    expect(theme.colors.secondary).toBeDefined();
    expect(theme.colors.background).toBeDefined();
    expect(theme.colors.surface).toBeDefined();
    expect(theme.colors.text).toBeDefined();
    expect(theme.colors.textMuted).toBeDefined();
    expect(theme.colors.border).toBeDefined();
  });

  it('should have all required typography properties', () => {
    const theme = themes['sushi-dark'];
    expect(theme.typography.heading).toBeDefined();
    expect(theme.typography.body).toBeDefined();
  });

  it('should return theme for valid key', () => {
    const theme = getTheme('cafe-warm');
    expect(theme.name).toBe('Cafe Warm');
  });

  it('should return default theme for invalid key', () => {
    const theme = getTheme('invalid-theme');
    expect(theme.name).toBe('Sushi Dark');
  });

  it('should return default theme for empty string', () => {
    const theme = getTheme('');
    expect(theme.name).toBe('Sushi Dark');
  });
});

