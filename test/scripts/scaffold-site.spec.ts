/**
 * Tests for scaffold-site script
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { scaffoldSite } from '@/scripts/scaffold-site';

describe('scaffold-site script', () => {
  const testOutputDir = join(process.cwd(), 'test-temp-scaffold');
  const restaurantSlug = 'so-delicious';

  beforeEach(() => {
    // Clean up test directory if it exists
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should copy template files to output path', async () => {
    // Mock process.argv to avoid parseArgs() calling process.exit
    const originalArgv = process.argv;
    process.argv = ['node', 'scaffold-site.ts', restaurantSlug, testOutputDir];
    
    try {
      await scaffoldSite(restaurantSlug, testOutputDir);
    } finally {
      process.argv = originalArgv;
    }

    // Check that template files were copied
    expect(existsSync(join(testOutputDir, 'package.json'))).toBe(true);
    expect(existsSync(join(testOutputDir, 'app', 'page.tsx'))).toBe(true);
    expect(existsSync(join(testOutputDir, 'app', 'layout.tsx'))).toBe(true);
    expect(existsSync(join(testOutputDir, 'tsconfig.json'))).toBe(true);
  });

  it('should copy restaurant data files', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'scaffold-site.ts', restaurantSlug, testOutputDir];
    
    try {
      await scaffoldSite(restaurantSlug, testOutputDir);
    } finally {
      process.argv = originalArgv;
    }

    const configPath = join(testOutputDir, 'data', 'config.json');
    const menuPath = join(testOutputDir, 'data', 'menu.json');

    expect(existsSync(configPath)).toBe(true);
    expect(existsSync(menuPath)).toBe(true);

    // Verify data files contain expected content
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const menu = JSON.parse(readFileSync(menuPath, 'utf-8'));

    expect(config.id).toBe(restaurantSlug);
    expect(menu.id).toBeTruthy();
  });

  it('should replace placeholders in package.json', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'scaffold-site.ts', restaurantSlug, testOutputDir];
    
    try {
      await scaffoldSite(restaurantSlug, testOutputDir);
    } finally {
      process.argv = originalArgv;
    }

    const packageJsonPath = join(testOutputDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    expect(packageJson.name).toBe(`${restaurantSlug}-site`);
    expect(packageJson.description).toBeTruthy();
  });

  it('should create data directory if it does not exist', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'scaffold-site.ts', restaurantSlug, testOutputDir];
    
    try {
      await scaffoldSite(restaurantSlug, testOutputDir);
    } finally {
      process.argv = originalArgv;
    }

    const dataDir = join(testOutputDir, 'data');
    expect(existsSync(dataDir)).toBe(true);
  });
});

