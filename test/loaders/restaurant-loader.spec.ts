/**
 * Tests for restaurant loader
 */

import { describe, it, expect } from 'vitest';
import { loadRestaurant } from '@/lib/loaders/restaurant';

describe('loadRestaurant', () => {
  it('should load restaurant config and menu for so-delicious', () => {
    const result = loadRestaurant('so-delicious');

    // Verify config
    expect(result.config).toBeDefined();
    expect(result.config.id).toBe('so-delicious');
    expect(result.config.name).toBe('So Delicious');
    expect(result.config.slug).toBe('so-delicious');
    expect(result.config.address).toBe('123 Sushi Street');
    expect(result.config.city).toBe('San Francisco');
    expect(result.config.state).toBe('CA');
    expect(result.config.zip).toBe('94102');
    expect(result.config.phone).toBe('+1-415-555-0123');
    expect(result.config.cuisine).toBe('Japanese');
    expect(result.config.theme).toBe('sushi-dark');

    // Verify menu
    expect(result.menu).toBeDefined();
    expect(result.menu.id).toBe('so-delicious-menu');
    expect(result.menu.name).toBeTruthy(); // Menu name exists
    expect(result.menu.currency).toBe('USD');
    expect(result.menu.categories).toBeDefined();
    expect(result.menu.categories.length).toBeGreaterThan(0);
  });

  it('should return validated config matching schema', () => {
    const result = loadRestaurant('so-delicious');
    
    // Config should have all required fields
    expect(result.config.id).toBeTruthy();
    expect(result.config.name).toBeTruthy();
    expect(result.config.slug).toBeTruthy();
    expect(result.config.address).toBeTruthy();
    expect(result.config.city).toBeTruthy();
    expect(result.config.state).toBeTruthy();
    expect(result.config.zip).toBeTruthy();
    expect(result.config.phone).toBeTruthy();
    expect(result.config.hours).toBeDefined();
    expect(result.config.cuisine).toBeTruthy();
    expect(result.config.theme).toBeTruthy();
  });

  it('should return validated menu matching schema', () => {
    const result = loadRestaurant('so-delicious');
    
    // Menu should have all required fields
    expect(result.menu.id).toBeTruthy();
    expect(result.menu.name).toBeTruthy();
    expect(result.menu.currency).toBeTruthy();
    expect(result.menu.categories).toBeDefined();
    expect(Array.isArray(result.menu.categories)).toBe(true);
    
    // Categories should have items
    if (result.menu.categories.length > 0) {
      const category = result.menu.categories[0];
      expect(category.id).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(Array.isArray(category.items)).toBe(true);
    }
  });

  it('should throw error for non-existent restaurant', () => {
    expect(() => {
      loadRestaurant('non-existent-restaurant');
    }).toThrow(/Failed to load restaurant/);
  });
});

