/**
 * Modern Sushi Theme Tests
 * 
 * Verifies that the modern-sushi theme is properly defined and accessible.
 */

import { describe, it, expect } from 'vitest';
import { getTheme } from '@/lib/themes';

describe('Modern Sushi Theme', () => {
  it('should return Theme object for modern-sushi key', () => {
    const theme = getTheme('modern-sushi');
    
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Modern Sushi');
  });

  it('should have all required color tokens', () => {
    const theme = getTheme('modern-sushi');
    
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
      expect(theme.colors).toHaveProperty(token);
      expect(typeof theme.colors[token as keyof typeof theme.colors]).toBe('string');
      expect(theme.colors[token as keyof typeof theme.colors].length).toBeGreaterThan(0);
    });
  });

  it('should have all required typography tokens', () => {
    const theme = getTheme('modern-sushi');
    
    expect(theme.typography.heading).toBeDefined();
    expect(theme.typography.body).toBeDefined();
    expect(typeof theme.typography.heading).toBe('string');
    expect(typeof theme.typography.body).toBe('string');
  });

  it('should have modern color palette (slate/emerald)', () => {
    const theme = getTheme('modern-sushi');
    
    // Verify modern colors are used
    expect(theme.colors.primary).toContain('slate');
    expect(theme.colors.accent).toContain('emerald');
  });

  it('should have radii tokens', () => {
    const theme = getTheme('modern-sushi');
    
    expect(theme.radii).toBeDefined();
    if (theme.radii) {
      expect(theme.radii.card).toBeDefined();
      expect(theme.radii.button).toBeDefined();
      expect(theme.radii.badge).toBeDefined();
    }
  });
});

