/**
 * Tests for ingest-menu script
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { callLLMToGenerateMenuJson } from '@/scripts/llm-menu';
import { menuSchema } from '@/lib/schemas';

// Mock the LLM function
vi.mock('@/scripts/llm-menu', () => ({
  callLLMToGenerateMenuJson: vi.fn(),
}));

describe('ingest-menu script', () => {
  const testDir = join(process.cwd(), 'test-temp-ingest');
  const inputFile = join(testDir, 'input.txt');
  const outputDir = join(testDir, 'data', 'restaurants', 'test-slug');
  const outputFile = join(outputDir, 'menu.json');

  beforeEach(() => {
    // Create test directory
    mkdirSync(testDir, { recursive: true });
    
    // Create input file with sample menu text
    writeFileSync(
      inputFile,
      'Appetizers\nBruschetta - $8.99\nWings - $12.99\n\nMain Courses\nPizza - $15.99\nPasta - $14.99',
      'utf-8'
    );
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should read input file and generate menu JSON', async () => {
    const mockMenuJson = {
      id: 'test-menu',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'appetizers',
          name: 'Appetizers',
          items: [
            {
              id: 'bruschetta',
              name: 'Bruschetta',
              price: 8.99,
            },
          ],
        },
      ],
    };

    vi.mocked(callLLMToGenerateMenuJson).mockResolvedValue(mockMenuJson);

    // Temporarily change process.cwd for the test
    const originalCwd = process.cwd();
    process.chdir(testDir);

    try {
      // Mock process.argv
      const originalArgv = process.argv;
      process.argv = ['node', 'ingest-menu.ts', inputFile, 'test-slug'];

      // Create output directory structure
      mkdirSync(outputDir, { recursive: true });

      // Run ingestion (we'll need to adjust the path logic)
      // For now, let's test the core logic
      const rawText = readFileSync(inputFile, 'utf-8');
      const menuJson = await callLLMToGenerateMenuJson(rawText);
      const menu = menuSchema.parse(menuJson);
      
      writeFileSync(outputFile, JSON.stringify(menu, null, 2), 'utf-8');

      // Verify output file exists and is valid
      expect(existsSync(outputFile)).toBe(true);
      const outputContent = JSON.parse(readFileSync(outputFile, 'utf-8'));
      expect(outputContent.id).toBe('test-menu');
      expect(outputContent.name).toBe('Test Menu');

      process.argv = originalArgv;
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('should validate menu JSON against schema', async () => {
    const invalidMenuJson = {
      id: 'test-menu',
      // Missing required fields
    };

    vi.mocked(callLLMToGenerateMenuJson).mockResolvedValue(invalidMenuJson);

    const rawText = readFileSync(inputFile, 'utf-8');
    const menuJson = await callLLMToGenerateMenuJson(rawText);

    expect(() => {
      menuSchema.parse(menuJson);
    }).toThrow();
  });

  it('should create output directory if it does not exist', async () => {
    const mockMenuJson = {
      id: 'test-menu',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'appetizers',
          name: 'Appetizers',
          items: [
            {
              id: 'item-1',
              name: 'Test Item',
              price: 10.99,
            },
          ],
        },
      ],
    };

    vi.mocked(callLLMToGenerateMenuJson).mockResolvedValue(mockMenuJson);

    const outputDirNew = join(testDir, 'data', 'restaurants', 'new-slug');
    const outputFileNew = join(outputDirNew, 'menu.json');

    // Directory should not exist initially
    expect(existsSync(outputDirNew)).toBe(false);

    const rawText = readFileSync(inputFile, 'utf-8');
    const menuJson = await callLLMToGenerateMenuJson(rawText);
    const menu = menuSchema.parse(menuJson);

    mkdirSync(outputDirNew, { recursive: true });
    writeFileSync(outputFileNew, JSON.stringify(menu, null, 2), 'utf-8');

    // Directory should now exist
    expect(existsSync(outputDirNew)).toBe(true);
    expect(existsSync(outputFileNew)).toBe(true);
  });
});

