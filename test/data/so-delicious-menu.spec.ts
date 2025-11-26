/**
 * Test for so-delicious menu.json validation
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { menuSchema } from '@/lib/schemas/menu';

describe('so-delicious menu.json', () => {
  it('should read and parse menu.json without errors', () => {
    const menuPath = join(process.cwd(), 'data', 'restaurants', 'so-delicious', 'menu.json');
    const menuContent = readFileSync(menuPath, 'utf-8');
    const menuData = JSON.parse(menuContent);
    
    const result = menuSchema.parse(menuData);
    
    expect(result.id).toBe('so-delicious-menu');
    expect(result.name).toBe('So Delicious Menu');
    expect(result.currency).toBe('USD');
    expect(result.categories.length).toBeGreaterThan(0);
  });

  it('should have valid categories with items', () => {
    const menuPath = join(process.cwd(), 'data', 'restaurants', 'so-delicious', 'menu.json');
    const menuContent = readFileSync(menuPath, 'utf-8');
    const menuData = JSON.parse(menuContent);
    
    const result = menuSchema.parse(menuData);
    
    result.categories.forEach((category) => {
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.items.length).toBeGreaterThan(0);
      
      category.items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.price).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('should have valid modifiers when present', () => {
    const menuPath = join(process.cwd(), 'data', 'restaurants', 'so-delicious', 'menu.json');
    const menuContent = readFileSync(menuPath, 'utf-8');
    const menuData = JSON.parse(menuContent);
    
    const result = menuSchema.parse(menuData);
    
    // Find an item with modifiers
    const itemWithModifiers = result.categories
      .flatMap((cat) => cat.items)
      .find((item) => item.modifiers && item.modifiers.length > 0);
    
    if (itemWithModifiers && itemWithModifiers.modifiers) {
      itemWithModifiers.modifiers.forEach((modifier) => {
        expect(modifier.name).toBeDefined();
        expect(modifier.options.length).toBeGreaterThan(0);
        
        modifier.options.forEach((option) => {
          expect(option.name).toBeDefined();
          expect(typeof option.priceDelta).toBe('number');
        });
      });
    }
  });
});

