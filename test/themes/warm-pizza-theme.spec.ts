/**
 * Warm Pizza Theme Tests
 * 
 * Verifies that the warm-pizza theme is properly defined and accessible.
 */

import { describe, it, expect } from 'vitest';
import { getTheme } from '@/lib/themes';

describe('Warm Pizza Theme', () => {
  it('should return Theme object for warm-pizza key', () => {
    const theme = getTheme('warm-pizza');
    
    expect(theme).toBeDefined();
    expect(theme.name).toBe('Warm Pizza');
  });

  it('should have all required color tokens', () => {
    const theme = getTheme('warm-pizza');
    
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
    const theme = getTheme('warm-pizza');
    
    expect(theme.typography.heading).toBeDefined();
    expect(theme.typography.body).toBeDefined();
    expect(typeof theme.typography.heading).toBe('string');
    expect(typeof theme.typography.body).toBe('string');
  });

  it('should have warm color palette (oranges/reds)', () => {
    const theme = getTheme('warm-pizza');
    
    // Verify warm colors are used
    expect(theme.colors.primary).toContain('orange');
    expect(theme.colors.accent).toContain('red');
    expect(theme.colors.background).toContain('orange');
  });

  it('should have radii tokens', () => {
    const theme = getTheme('warm-pizza');
    
    expect(theme.radii).toBeDefined();
    if (theme.radii) {
      expect(theme.radii.card).toBeDefined();
      expect(theme.radii.button).toBeDefined();
      expect(theme.radii.badge).toBeDefined();
    }
  });
});

