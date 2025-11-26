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
 * Read all text files from a directory and combine their content
 * 
 * @param dirPath - Path to the directory
 * @returns Combined content of all text files in the directory
 */
function readFilesFromDirectory(dirPath: string): string {
  const files = readdirSync(dirPath);
  const textFiles = files
    .filter(file => {
      const filePath = join(dirPath, file);
      return isFile(filePath) && extname(file).toLowerCase() === '.txt';
    })
    .sort(); // Sort for consistent ordering
  
  if (textFiles.length === 0) {
    throw new Error(`No .txt files found in directory: ${dirPath}`);
  }
  
  const contents: string[] = [];
  for (const file of textFiles) {
    const filePath = join(dirPath, file);
    const content = readFileSync(filePath, 'utf-8');
    contents.push(`\n--- ${file} ---\n${content}`);
  }
  
  return contents.join('\n\n');
}

/**
 * Read raw text from a file or directory
 * 
 * @param inputPath - Path to file or directory
 * @returns Raw text content
 */
function readInputText(inputPath: string): string {
  if (isDirectory(inputPath)) {
    return readFilesFromDirectory(inputPath);
  } else if (isFile(inputPath)) {
    return readFileSync(inputPath, 'utf-8');
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
    // Read raw text from input file or folder
    const rawText = readInputText(inputPath);
    
    // Call LLM to generate menu JSON
    const menuJson = await callLLMToGenerateMenuJson(rawText);
    
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

export { main as ingestMenu, readInputText, readFilesFromDirectory, isDirectory, isFile };

