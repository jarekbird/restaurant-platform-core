#!/usr/bin/env node

/**
 * Scaffold Site CLI
 * 
 * Creates a new restaurant site by copying the template and populating it
 * with restaurant-specific data.
 */

import { cpSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { loadRestaurant } from '@/lib/loaders/restaurant';

interface CliArgs {
  restaurantSlug: string;
  outputPath: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: scaffold-site.ts <restaurantSlug> <outputPath>');
    process.exit(1);
  }
  
  return {
    restaurantSlug: args[0],
    outputPath: args[1],
  };
}

/**
 * Main scaffolding function
 */
async function main() {
  const { restaurantSlug, outputPath } = parseArgs();
  
  try {
    // Load restaurant data
    const { config, menu } = loadRestaurant(restaurantSlug);
    
    // Copy template directory to output path
    const templateDir = join(process.cwd(), 'templates', 'site');
    cpSync(templateDir, outputPath, { recursive: true });
    
    // Copy restaurant data files
    const dataDir = join(outputPath, 'data');
    mkdirSync(dataDir, { recursive: true });
    
    writeFileSync(
      join(dataDir, 'config.json'),
      JSON.stringify(config, null, 2),
      'utf-8'
    );
    
    writeFileSync(
      join(dataDir, 'menu.json'),
      JSON.stringify(menu, null, 2),
      'utf-8'
    );
    
    // Replace placeholders in package.json
    const packageJsonPath = join(outputPath, 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    packageJson.name = `${restaurantSlug}-site`;
    packageJson.description = `${config.name} website`;
    
    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );
    
    console.log(`Successfully scaffolded site for "${config.name}" at ${outputPath}`);
    console.log(`Restaurant slug: ${restaurantSlug}`);
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

export { main as scaffoldSite };

