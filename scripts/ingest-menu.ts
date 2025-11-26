#!/usr/bin/env node

/**
 * Menu Ingestion Script
 * 
 * Parses CLI args, reads raw text from input file, calls LLM to generate
 * menu JSON, validates with menuSchema, and writes to output location.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { menuSchema } from '@/lib/schemas';
import { callLLMToGenerateMenuJson } from './llm-menu';

interface CliArgs {
  inputFile: string;
  restaurantSlug: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: ingest-menu.ts <inputFile> <restaurantSlug>');
    process.exit(1);
  }
  
  return {
    inputFile: args[0],
    restaurantSlug: args[1],
  };
}

/**
 * Main ingestion function
 */
async function main() {
  const { inputFile, restaurantSlug } = parseArgs();
  
  try {
    // Read raw text from input file
    const rawText = readFileSync(inputFile, 'utf-8');
    
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

export { main as ingestMenu };

