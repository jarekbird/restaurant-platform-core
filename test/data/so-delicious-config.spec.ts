/**
 * Test for so-delicious config.json validation
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { restaurantConfigSchema } from '@/lib/schemas/restaurant';

describe('so-delicious config.json', () => {
  it('should read and parse config.json without errors', () => {
    const configPath = join(process.cwd(), 'data', 'restaurants', 'so-delicious', 'config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const configData = JSON.parse(configContent);
    
    const result = restaurantConfigSchema.parse(configData);
    
    expect(result.id).toBe('so-delicious');
    expect(result.name).toBe('So Delicious Sushi');
    expect(result.slug).toBe('so-delicious-sushi');
    expect(result.theme).toBe('sushi-dark');
    expect(result.orderOnlineEnabled).toBe(true);
  });

  it('should have valid hours for all days of the week', () => {
    const configPath = join(process.cwd(), 'data', 'restaurants', 'so-delicious', 'config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const configData = JSON.parse(configContent);
    
    const result = restaurantConfigSchema.parse(configData);
    
    expect(result.hours.mon).toBeDefined();
    expect(result.hours.tue).toBeDefined();
    expect(result.hours.wed).toBeDefined();
    expect(result.hours.thu).toBeDefined();
    expect(result.hours.fri).toBeDefined();
    expect(result.hours.sat).toBeDefined();
    expect(result.hours.sun).toBeDefined();
  });
});

