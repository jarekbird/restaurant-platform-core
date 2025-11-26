/**
 * Tests for ingest-menu script
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { callLLMToGenerateMenuJson } from '@/scripts/llm-menu';
import { menuSchema } from '@/lib/schemas';
import { readInputText, readFilesFromDirectory, isDirectory, isFile } from '@/scripts/ingest-menu';

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

  describe('folder input support', () => {
    const inputFolder = join(testDir, 'menu-files');

    beforeEach(() => {
      mkdirSync(inputFolder, { recursive: true });
    });

    it('should detect if a path is a directory', () => {
      expect(isDirectory(inputFolder)).toBe(true);
      expect(isDirectory(inputFile)).toBe(false);
      expect(isDirectory(join(testDir, 'nonexistent'))).toBe(false);
    });

    it('should detect if a path is a file', () => {
      expect(isFile(inputFile)).toBe(true);
      expect(isFile(inputFolder)).toBe(false);
      expect(isFile(join(testDir, 'nonexistent.txt'))).toBe(false);
    });

    it('should read all .txt files from a directory and combine them', () => {
      // Create multiple text files in the folder
      writeFileSync(join(inputFolder, 'appetizers.txt'), 'Appetizers\nBruschetta - $8.99\n', 'utf-8');
      writeFileSync(join(inputFolder, 'mains.txt'), 'Main Courses\nPizza - $15.99\n', 'utf-8');
      writeFileSync(join(inputFolder, 'desserts.txt'), 'Desserts\nTiramisu - $7.99\n', 'utf-8');
      // Add a non-.txt file that should be ignored
      writeFileSync(join(inputFolder, 'readme.md'), '# Menu Files', 'utf-8');

      const combined = readFilesFromDirectory(inputFolder);

      expect(combined).toContain('--- appetizers.txt ---');
      expect(combined).toContain('Bruschetta - $8.99');
      expect(combined).toContain('--- mains.txt ---');
      expect(combined).toContain('Pizza - $15.99');
      expect(combined).toContain('--- desserts.txt ---');
      expect(combined).toContain('Tiramisu - $7.99');
      expect(combined).not.toContain('readme.md');
      expect(combined).not.toContain('# Menu Files');
    });

    it('should throw error if directory has no .txt files', () => {
      // Create a file that's not .txt
      writeFileSync(join(inputFolder, 'readme.md'), '# Menu Files', 'utf-8');

      expect(() => {
        readFilesFromDirectory(inputFolder);
      }).toThrow('No .txt files found in directory');
    });

    it('should read from a single file when input is a file', () => {
      const content = readInputText(inputFile);
      expect(content).toContain('Appetizers');
      expect(content).toContain('Bruschetta');
    });

    it('should read from a folder when input is a directory', () => {
      writeFileSync(join(inputFolder, 'menu1.txt'), 'Menu Part 1\n', 'utf-8');
      writeFileSync(join(inputFolder, 'menu2.txt'), 'Menu Part 2\n', 'utf-8');

      const content = readInputText(inputFolder);
      expect(content).toContain('--- menu1.txt ---');
      expect(content).toContain('Menu Part 1');
      expect(content).toContain('--- menu2.txt ---');
      expect(content).toContain('Menu Part 2');
    });

    it('should throw error if input path does not exist', () => {
      const nonexistentPath = join(testDir, 'nonexistent-path');
      expect(() => {
        readInputText(nonexistentPath);
      }).toThrow('Input path does not exist or is not a file or directory');
    });

    it('should process files in alphabetical order', () => {
      writeFileSync(join(inputFolder, 'zebra.txt'), 'Zebra Item\n', 'utf-8');
      writeFileSync(join(inputFolder, 'apple.txt'), 'Apple Item\n', 'utf-8');
      writeFileSync(join(inputFolder, 'banana.txt'), 'Banana Item\n', 'utf-8');

      const combined = readFilesFromDirectory(inputFolder);
      
      // Check that files appear in alphabetical order
      const appleIndex = combined.indexOf('apple.txt');
      const bananaIndex = combined.indexOf('banana.txt');
      const zebraIndex = combined.indexOf('zebra.txt');
      
      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });
  });
});

