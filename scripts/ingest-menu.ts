#!/usr/bin/env node

/**
 * Menu Ingestion Script
 * 
 * Parses CLI args, reads raw text from input file or folder, calls LLM to generate
 * menu JSON, validates with menuSchema, and writes to output location.
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { menuSchema } from '@/lib/schemas';
import { callLLMToGenerateMenuJson } from './llm-menu';

/**
 * Supported image file extensions
 */
const IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];

interface CliArgs {
  inputPath: string;
  restaurantSlug: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: ingest-menu.ts <inputFileOrFolder> <restaurantSlug>');
    console.error('  inputFileOrFolder: Path to a single file or folder containing menu files');
    console.error('  restaurantSlug: Restaurant slug for output directory');
    process.exit(1);
  }
  
  return {
    inputPath: args[0],
    restaurantSlug: args[1],
  };
}

/**
 * Check if a path is a directory
 */
function isDirectory(path: string): boolean {
  try {
    const stats = statSync(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path is a file
 */
function isFile(path: string): boolean {
  try {
    const stats = statSync(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Check if a file is an image based on its extension
 */
function isImageFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Check if a file is a text file based on its extension
 */
function isTextFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return ext === '.txt';
}

/**
 * Read image file as base64 string
 */
function readImageAsBase64(filePath: string): string {
  const imageBuffer = readFileSync(filePath);
  const base64 = imageBuffer.toString('base64');
  const ext = extname(filePath).toLowerCase();
  // Determine MIME type
  const mimeTypes: Record<string, string> = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
  };
  const mimeType = mimeTypes[ext] || 'image/png';
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Read all text and image files from a directory and combine their content
 * 
 * @param dirPath - Path to the directory
 * @returns Object with combined text content and array of image data
 */
function readFilesFromDirectory(dirPath: string): { text: string; images: string[] } {
  const files = readdirSync(dirPath);
  const textFiles = files
    .filter(file => {
      const filePath = join(dirPath, file);
      return isFile(filePath) && isTextFile(filePath);
    })
    .sort();
  
  const imageFiles = files
    .filter(file => {
      const filePath = join(dirPath, file);
      return isFile(filePath) && isImageFile(filePath);
    })
    .sort();
  
  if (textFiles.length === 0 && imageFiles.length === 0) {
    throw new Error(`No .txt or image files found in directory: ${dirPath}`);
  }
  
  const textContents: string[] = [];
  for (const file of textFiles) {
    const filePath = join(dirPath, file);
    const content = readFileSync(filePath, 'utf-8');
    textContents.push(`\n--- ${file} ---\n${content}`);
  }
  
  const images: string[] = [];
  for (const file of imageFiles) {
    const filePath = join(dirPath, file);
    const base64Image = readImageAsBase64(filePath);
    images.push(base64Image);
  }
  
  return {
    text: textContents.join('\n\n'),
    images,
  };
}

/**
 * Read input from a file or directory
 * 
 * @param inputPath - Path to file or directory
 * @returns Object with text content and optional image data
 */
function readInput(inputPath: string): { text: string; images: string[] } {
  if (isDirectory(inputPath)) {
    return readFilesFromDirectory(inputPath);
  } else if (isFile(inputPath)) {
    if (isImageFile(inputPath)) {
      // Single image file
      return {
        text: '',
        images: [readImageAsBase64(inputPath)],
      };
    } else {
      // Single text file
      return {
        text: readFileSync(inputPath, 'utf-8'),
        images: [],
      };
    }
  } else {
    throw new Error(`Input path does not exist or is not a file or directory: ${inputPath}`);
  }
}

/**
 * Main ingestion function
 */
async function main() {
  const { inputPath, restaurantSlug } = parseArgs();
  
  try {
    // Read input from file or folder (text and/or images)
    const { text, images } = readInput(inputPath);
    
    // Call LLM to generate menu JSON (pass text and images)
    const menuJson = await callLLMToGenerateMenuJson(text, images);
    
    // Validate with menuSchema
    const menu = menuSchema.parse(menuJson);
    
    // Write menu.json to data/restaurants/<slug>/menu.json
    const outputPath = join(
      process.cwd(),
      'data',
      'restaurants',
      restaurantSlug,
      'menu.json'
    );
    
    // Create directories if needed
    mkdirSync(dirname(outputPath), { recursive: true });
    
    // Write validated menu
    writeFileSync(outputPath, JSON.stringify(menu, null, 2), 'utf-8');
    
    console.log(`Successfully wrote menu to ${outputPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { main as ingestMenu, readInput, readFilesFromDirectory, isDirectory, isFile, isImageFile, isTextFile, readImageAsBase64 };

