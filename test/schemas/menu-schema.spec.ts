/**
 * Tests for menu.ts Zod schemas
 */

import { describe, it, expect } from 'vitest';
import {
  modifierOptionSchema,
  modifierGroupSchema,
  menuItemSchema,
  menuCategorySchema,
  menuSchema,
} from '@/lib/schemas/menu';

describe('Menu Schemas', () => {
  describe('modifierOptionSchema', () => {
    it('should parse valid modifier option', () => {
      const valid = {
        name: 'Large',
        priceDelta: 2.5,
      };
      const result = modifierOptionSchema.parse(valid);
      expect(result.name).toBe('Large');
      expect(result.priceDelta).toBe(2.5);
    });

    it('should apply default priceDelta of 0', () => {
      const valid = {
        name: 'Small',
      };
      const result = modifierOptionSchema.parse(valid);
      expect(result.priceDelta).toBe(0);
    });

    it('should accept optional id', () => {
      const valid = {
        id: 'opt-1',
        name: 'Medium',
        priceDelta: 1.0,
      };
      const result = modifierOptionSchema.parse(valid);
      expect(result.id).toBe('opt-1');
    });

    it('should throw error for missing name', () => {
      const invalid = {
        priceDelta: 1.0,
      };
      expect(() => modifierOptionSchema.parse(invalid)).toThrow();
    });
  });

  describe('modifierGroupSchema', () => {
    it('should parse valid modifier group', () => {
      const valid = {
        name: 'Size',
        options: [
          { name: 'Small', priceDelta: 0 },
          { name: 'Large', priceDelta: 2.0 },
        ],
      };
      const result = modifierGroupSchema.parse(valid);
      expect(result.name).toBe('Size');
      expect(result.options).toHaveLength(2);
    });

    it('should accept optional min and max', () => {
      const valid = {
        name: 'Toppings',
        min: 0,
        max: 3,
        options: [{ name: 'Cheese', priceDelta: 1.0 }],
      };
      const result = modifierGroupSchema.parse(valid);
      expect(result.min).toBe(0);
      expect(result.max).toBe(3);
    });

    it('should throw error for empty options array', () => {
      const invalid = {
        name: 'Size',
        options: [],
      };
      expect(() => modifierGroupSchema.parse(invalid)).toThrow();
    });
  });

  describe('menuItemSchema', () => {
    it('should parse valid menu item', () => {
      const valid = {
        id: 'item-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato and mozzarella',
        price: 12.99,
      };
      const result = menuItemSchema.parse(valid);
      expect(result.id).toBe('item-1');
      expect(result.name).toBe('Margherita Pizza');
      expect(result.price).toBe(12.99);
    });

    it('should accept optional fields', () => {
      const valid = {
        id: 'item-2',
        name: 'Pepperoni Pizza',
        price: 14.99,
        image: 'https://example.com/pizza.jpg',
        tags: ['pizza', 'popular'],
        modifiers: [
          {
            name: 'Size',
            options: [{ name: 'Small', priceDelta: 0 }],
          },
        ],
      };
      const result = menuItemSchema.parse(valid);
      expect(result.image).toBe('https://example.com/pizza.jpg');
      expect(result.tags).toEqual(['pizza', 'popular']);
      expect(result.modifiers).toHaveLength(1);
    });

    it('should throw error for missing required id', () => {
      const invalid = {
        name: 'Pizza',
        price: 10.0,
      };
      expect(() => menuItemSchema.parse(invalid)).toThrow();
    });

    it('should throw error for negative price', () => {
      const invalid = {
        id: 'item-1',
        name: 'Pizza',
        price: -5.0,
      };
      expect(() => menuItemSchema.parse(invalid)).toThrow();
    });
  });

  describe('menuCategorySchema', () => {
    it('should parse valid menu category', () => {
      const valid = {
        id: 'cat-1',
        name: 'Pizzas',
        items: [
          {
            id: 'item-1',
            name: 'Margherita',
            price: 12.99,
          },
        ],
      };
      const result = menuCategorySchema.parse(valid);
      expect(result.id).toBe('cat-1');
      expect(result.items).toHaveLength(1);
    });

    it('should throw error for empty items array', () => {
      const invalid = {
        id: 'cat-1',
        name: 'Pizzas',
        items: [],
      };
      expect(() => menuCategorySchema.parse(invalid)).toThrow();
    });
  });

  describe('menuSchema', () => {
    it('should parse valid menu with all fields', () => {
      const valid = {
        id: 'menu-1',
        name: 'Main Menu',
        currency: 'USD',
        categories: [
          {
            id: 'cat-1',
            name: 'Pizzas',
            items: [
              {
                id: 'item-1',
                name: 'Margherita',
                price: 12.99,
              },
            ],
          },
        ],
      };
      const result = menuSchema.parse(valid);
      expect(result.id).toBe('menu-1');
      expect(result.currency).toBe('USD');
      expect(result.categories).toHaveLength(1);
    });

    it('should apply default currency of USD', () => {
      const valid = {
        id: 'menu-1',
        name: 'Main Menu',
        categories: [
          {
            id: 'cat-1',
            name: 'Pizzas',
            items: [
              {
                id: 'item-1',
                name: 'Margherita',
                price: 12.99,
              },
            ],
          },
        ],
      };
      const result = menuSchema.parse(valid);
      expect(result.currency).toBe('USD');
    });

    it('should throw error for missing required id', () => {
      const invalid = {
        name: 'Main Menu',
        categories: [
          {
            id: 'cat-1',
            name: 'Pizzas',
            items: [
              {
                id: 'item-1',
                name: 'Margherita',
                price: 12.99,
              },
            ],
          },
        ],
      };
      expect(() => menuSchema.parse(invalid)).toThrow();
    });

    it('should throw error for empty categories array', () => {
      const invalid = {
        id: 'menu-1',
        name: 'Main Menu',
        categories: [],
      };
      expect(() => menuSchema.parse(invalid)).toThrow();
    });
  });

  describe('Complete menu validation', () => {
    it('should parse a complete valid menu object', () => {
      const completeMenu = {
        id: 'menu-1',
        name: 'Restaurant Menu',
        currency: 'USD',
        categories: [
          {
            id: 'cat-1',
            name: 'Appetizers',
            description: 'Start your meal right',
            items: [
              {
                id: 'item-1',
                name: 'Bruschetta',
                description: 'Toasted bread with tomatoes',
                price: 8.99,
                tags: ['vegetarian'],
                modifiers: [
                  {
                    name: 'Size',
                    min: 1,
                    max: 1,
                    options: [
                      { id: 'opt-1', name: 'Small', priceDelta: 0 },
                      { id: 'opt-2', name: 'Large', priceDelta: 3.0 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = menuSchema.parse(completeMenu);
      expect(result.id).toBe('menu-1');
      expect(result.categories[0].items[0].modifiers?.[0].options).toHaveLength(2);
    });
  });
});

