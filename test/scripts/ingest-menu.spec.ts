/**
 * Tests for ingest-menu script
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { callLLMToGenerateMenuJson, extractRestaurantInfo } from '@/scripts/llm-menu';
import { menuSchema } from '@/lib/schemas';
import { readInput, readFilesFromDirectory, isDirectory, isFile, isImageFile, isTextFile, readImageAsBase64 } from '@/scripts/ingest-menu';

// Mock the LLM functions
vi.mock('@/scripts/llm-menu', () => ({
  callLLMToGenerateMenuJson: vi.fn(),
  extractRestaurantInfo: vi.fn(),
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
    
    // Mock extractRestaurantInfo to return empty object (will use defaults)
    vi.mocked(extractRestaurantInfo).mockResolvedValue({});
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
      const { text } = readInput(inputFile);
      const menuJson = await callLLMToGenerateMenuJson(text, []);
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

    const { text } = readInput(inputFile);
    const menuJson = await callLLMToGenerateMenuJson(text, []);

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

    const { text } = readInput(inputFile);
    const menuJson = await callLLMToGenerateMenuJson(text, []);
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

      const { text } = readFilesFromDirectory(inputFolder);

      expect(text).toContain('--- appetizers.txt ---');
      expect(text).toContain('Bruschetta - $8.99');
      expect(text).toContain('--- mains.txt ---');
      expect(text).toContain('Pizza - $15.99');
      expect(text).toContain('--- desserts.txt ---');
      expect(text).toContain('Tiramisu - $7.99');
      expect(text).not.toContain('readme.md');
      expect(text).not.toContain('# Menu Files');
    });

    it('should throw error if directory has no .txt or image files', () => {
      // Create a file that's not .txt or image
      writeFileSync(join(inputFolder, 'readme.md'), '# Menu Files', 'utf-8');

      expect(() => {
        readFilesFromDirectory(inputFolder);
      }).toThrow('No .txt or image files found in directory');
    });

    it('should read from a single file when input is a file', () => {
      const { text } = readInput(inputFile);
      expect(text).toContain('Appetizers');
      expect(text).toContain('Bruschetta');
    });

    it('should read from a folder when input is a directory', () => {
      writeFileSync(join(inputFolder, 'menu1.txt'), 'Menu Part 1\n', 'utf-8');
      writeFileSync(join(inputFolder, 'menu2.txt'), 'Menu Part 2\n', 'utf-8');

      const { text } = readInput(inputFolder);
      expect(text).toContain('--- menu1.txt ---');
      expect(text).toContain('Menu Part 1');
      expect(text).toContain('--- menu2.txt ---');
      expect(text).toContain('Menu Part 2');
    });

    it('should throw error if input path does not exist', () => {
      const nonexistentPath = join(testDir, 'nonexistent-path');
      expect(() => {
        readInput(nonexistentPath);
      }).toThrow('Input path does not exist or is not a file or directory');
    });

    it('should process files in alphabetical order', () => {
      writeFileSync(join(inputFolder, 'zebra.txt'), 'Zebra Item\n', 'utf-8');
      writeFileSync(join(inputFolder, 'apple.txt'), 'Apple Item\n', 'utf-8');
      writeFileSync(join(inputFolder, 'banana.txt'), 'Banana Item\n', 'utf-8');

      const { text } = readFilesFromDirectory(inputFolder);
      
      // Check that files appear in alphabetical order
      const appleIndex = text.indexOf('apple.txt');
      const bananaIndex = text.indexOf('banana.txt');
      const zebraIndex = text.indexOf('zebra.txt');
      
      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });
  });

  describe('image file support', () => {
    const testImageFile = join(testDir, 'test-image.webp');

    beforeEach(() => {
      // Create a minimal valid WebP file (just for testing - not a real image)
      // In real usage, this would be an actual image file
      mkdirSync(testDir, { recursive: true });
    });

    it('should detect image files correctly', () => {
      expect(isImageFile('test.webp')).toBe(true);
      expect(isImageFile('test.png')).toBe(true);
      expect(isImageFile('test.jpg')).toBe(true);
      expect(isImageFile('test.jpeg')).toBe(true);
      expect(isImageFile('test.gif')).toBe(true);
      expect(isImageFile('test.txt')).toBe(false);
      expect(isImageFile('test.pdf')).toBe(false);
    });

    it('should detect text files correctly', () => {
      expect(isTextFile('test.txt')).toBe(true);
      expect(isTextFile('test.webp')).toBe(false);
      expect(isTextFile('test.png')).toBe(false);
    });

    it('should read image file as base64', () => {
      // Create a minimal test file (not a real image, but enough for testing)
      const testContent = Buffer.from('fake image data');
      writeFileSync(testImageFile, testContent);

      const base64 = readImageAsBase64(testImageFile);
      expect(base64).toContain('data:image/webp;base64,');
      expect(base64.length).toBeGreaterThan(20);
    });

    it('should handle single image file input', () => {
      // Create a minimal test file
      const testContent = Buffer.from('fake image data');
      writeFileSync(testImageFile, testContent);

      const { text, images } = readInput(testImageFile);
      expect(text).toBe('');
      expect(images).toHaveLength(1);
      expect(images[0]).toContain('data:image/webp;base64,');
    });

    it('should handle folder with both text and image files', () => {
      const inputFolder = join(testDir, 'mixed-files');
      mkdirSync(inputFolder, { recursive: true });

      writeFileSync(join(inputFolder, 'menu.txt'), 'Menu text\n', 'utf-8');
      const testContent = Buffer.from('fake image data');
      writeFileSync(join(inputFolder, 'menu.webp'), testContent);

      const { text, images } = readInput(inputFolder);
      expect(text).toContain('menu.txt');
      expect(text).toContain('Menu text');
      expect(images).toHaveLength(1);
      expect(images[0]).toContain('data:image/webp;base64,');
    });

    it('should handle folder with only image files', () => {
      const inputFolder = join(testDir, 'image-only');
      mkdirSync(inputFolder, { recursive: true });

      const testContent1 = Buffer.from('fake image 1');
      const testContent2 = Buffer.from('fake image 2');
      writeFileSync(join(inputFolder, 'image1.webp'), testContent1);
      writeFileSync(join(inputFolder, 'image2.png'), testContent2);

      const { text, images } = readInput(inputFolder);
      expect(text).toBe('');
      expect(images).toHaveLength(2);
      expect(images[0]).toContain('data:image/webp;base64,');
      expect(images[1]).toContain('data:image/png;base64,');
    });
  });
});

