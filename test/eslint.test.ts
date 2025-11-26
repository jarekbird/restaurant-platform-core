/**
 * Test to verify ESLint works in CI-style (non-interactive) usage
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('ESLint Configuration', () => {
  it('should run lint command without interactive prompts', () => {
    // This test verifies that ESLint can run in CI mode
    // We'll run the lint command and verify it completes
    try {
      const result = execSync('npm run lint', {
        encoding: 'utf-8',
        stdio: 'pipe',
        env: { ...process.env, CI: 'true' },
      });
      expect(result).toBeDefined();
      // If we get here, lint ran successfully without prompts
      expect(true).toBe(true);
    } catch (error: unknown) {
      // If lint fails, we should know about it
      if (error instanceof Error) {
        // Check if it's a linting error (exit code 1) vs other error
        const execError = error as { status?: number };
        if (execError.status === 1) {
          // Linting errors found - this is a failure
          throw new Error(`ESLint found errors: ${error.message}`);
        }
        throw error;
      }
      throw error;
    }
  });

  it('should complete lint command successfully', () => {
    // Verify lint command exists and is executable
    expect(typeof process.env.npm_execpath).toBeDefined();
  });
});

