/**
 * New Owner.com-Inspired Themes Tests
 * 
 * Verifies that breakfast-diner and fast-casual themes are properly defined.
 */

import { describe, it, expect } from 'vitest';
import { getTheme } from '@/lib/themes';

describe('New Owner.com-Inspired Themes', () => {
  describe('breakfast-diner theme', () => {
    it('should return Theme object for breakfast-diner key', () => {
      const theme = getTheme('breakfast-diner');
      expect(theme).toBeDefined();
      expect(theme.name).toBe('Breakfast Diner');
    });

    it('should have all required tokens', () => {
      const theme = getTheme('breakfast-diner');
      expect(theme.colors.accent).toBeDefined();
      expect(theme.typography.heading).toBeDefined();
      expect(theme.radii).toBeDefined();
    });
  });

  describe('fast-casual theme', () => {
    it('should return Theme object for fast-casual key', () => {
      const theme = getTheme('fast-casual');
      expect(theme).toBeDefined();
      expect(theme.name).toBe('Fast Casual');
    });

    it('should have all required tokens', () => {
      const theme = getTheme('fast-casual');
      expect(theme.colors.accent).toBeDefined();
      expect(theme.typography.heading).toBeDefined();
      expect(theme.radii).toBeDefined();
    });
  });
});

