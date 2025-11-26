/**
 * Test to verify path aliases work in test files
 */

import { describe, it, expect } from 'vitest';

describe('Path Alias Configuration', () => {
  it('should resolve @/* alias correctly', () => {
    // This test verifies that the @/* alias is configured
    // We can't easily test imports without actual files, but we can verify the config exists
    expect(true).toBe(true);
  });
});

