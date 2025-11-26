#!/usr/bin/env node

/**
 * Menu Ingestion Script
 * 
 * Parses CLI args, reads raw text from input file or folder, calls LLM to generate
 * menu JSON, validates with menuSchema, and writes to output location.
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { menuSchema, restaurantConfigSchema } from '@/lib/schemas';
import { callLLMToGenerateMenuJson, extractRestaurantInfo } from './llm-menu';

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
 * Infer theme from cuisine type
 */
function inferThemeFromCuisine(cuisine?: string): string {
  if (!cuisine) {
    return 'sushi-dark'; // Default theme
  }

  const cuisineLower = cuisine.toLowerCase();
  
  // Map cuisine types to themes
  if (cuisineLower.includes('sushi') || cuisineLower.includes('japanese')) {
    return 'sushi-dark';
  }
  if (cuisineLower.includes('coffee') || cuisineLower.includes('cafe') || cuisineLower.includes('bakery')) {
    return 'cafe-warm';
  }
  if (cuisineLower.includes('pizza') || cuisineLower.includes('italian')) {
    return 'pizza-bright';
  }
  
  // Default theme
  return 'sushi-dark';
}

/**
 * Create default hours
 */
function createDefaultHours(): Record<string, string> {
  return {
    mon: '11:00-21:00',
    tue: '11:00-21:00',
    wed: '11:00-21:00',
    thu: '11:00-21:00',
    fri: '11:00-22:00',
    sat: '12:00-22:00',
    sun: '12:00-20:00',
  };
}

/**
 * Generate restaurant name from slug if not provided
 */
function generateNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main ingestion function
 */
async function main() {
  const { inputPath, restaurantSlug } = parseArgs();
  
  try {
    // Read input from file or folder (text and/or images)
    const { text, images } = readInput(inputPath);
    
    // Extract restaurant info and menu in parallel
    const [restaurantInfo, menuJson] = await Promise.all([
      extractRestaurantInfo(text, images),
      callLLMToGenerateMenuJson(text, images),
    ]);
    
    // Validate menu with menuSchema
    let menu;
    try {
      menu = menuSchema.parse(menuJson);
    } catch (validationError) {
      console.error('\n=== LLM Response (for debugging) ===');
      console.error(JSON.stringify(menuJson, null, 2));
      console.error('=====================================\n');
      if (validationError instanceof Error) {
        throw new Error(
          `Menu validation failed: ${validationError.message}`
        );
      }
      throw validationError;
    }
    
    // Determine restaurant directory
    const restaurantDir = join(
      process.cwd(),
      'data',
      'restaurants',
      restaurantSlug
    );
    
    // Create directories if needed
    mkdirSync(restaurantDir, { recursive: true });
    
    // Write menu.json
    const menuPath = join(restaurantDir, 'menu.json');
    writeFileSync(menuPath, JSON.stringify(menu, null, 2), 'utf-8');
    console.log(`Successfully wrote menu to ${menuPath}`);
    
    // Create config.json if it doesn't exist
    const configPath = join(restaurantDir, 'config.json');
    if (!existsSync(configPath)) {
      // Infer cuisine from menu if not extracted
      const cuisine = restaurantInfo.cuisine || 
        (menu.categories.some(cat => 
          cat.items.some(item => 
            item.name.toLowerCase().includes('sushi') || 
            item.name.toLowerCase().includes('roll') ||
            item.name.toLowerCase().includes('maki')
          )
        ) ? 'Japanese Sushi' : 'American');
      
      // Infer theme from cuisine
      const theme = inferThemeFromCuisine(cuisine);
      
      // Create config with extracted info and defaults
      const config = {
        id: restaurantSlug,
        name: restaurantInfo.name || generateNameFromSlug(restaurantSlug),
        slug: restaurantSlug,
        address: '123 Main Street', // Default - user should update
        city: 'San Francisco', // Default - user should update
        state: 'CA', // Default - user should update
        zip: '94102', // Default - user should update
        phone: restaurantInfo.phone || '+1-415-555-0100', // Default if not found
        email: restaurantInfo.email,
        hours: restaurantInfo.hours || createDefaultHours(),
        cuisine: cuisine,
        theme: theme,
        orderOnlineEnabled: false,
      };
      
      // Validate config
      try {
        const validatedConfig = restaurantConfigSchema.parse(config);
        writeFileSync(configPath, JSON.stringify(validatedConfig, null, 2), 'utf-8');
        console.log(`Successfully created config.json at ${configPath}`);
        console.log(`\nNote: Please update address, city, state, and zip in config.json with actual restaurant location.`);
      } catch (configError) {
        console.warn(`Warning: Could not create config.json: ${configError instanceof Error ? configError.message : 'Unknown error'}`);
        console.warn('You may need to create config.json manually.');
      }
    } else {
      console.log(`Config.json already exists at ${configPath}, skipping creation.`);
    }
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

