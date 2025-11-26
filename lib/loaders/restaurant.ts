import { readFileSync } from 'fs';
import { join } from 'path';
import { menuSchema, restaurantConfigSchema } from '@/lib/schemas';

/**
 * Load restaurant configuration and menu from filesystem
 * 
 * @param slug - Restaurant slug (directory name in data/restaurants/)
 * @returns Object containing validated config and menu
 * @throws Error if restaurant not found or validation fails
 */
export function loadRestaurant(slug: string) {
  const restaurantDir = join(process.cwd(), 'data', 'restaurants', slug);

  try {
    // Load and parse config.json
    const configPath = join(restaurantDir, 'config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const configData = JSON.parse(configContent);
    const config = restaurantConfigSchema.parse(configData);

    // Load and parse menu.json
    const menuPath = join(restaurantDir, 'menu.json');
    const menuContent = readFileSync(menuPath, 'utf-8');
    const menuData = JSON.parse(menuContent);
    const menu = menuSchema.parse(menuData);

    return { config, menu };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to load restaurant "${slug}": ${error.message}`
      );
    }
    throw error;
  }
}

