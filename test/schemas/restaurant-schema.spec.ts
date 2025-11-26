/**
 * Tests for restaurant.ts Zod schemas
 */

import { describe, it, expect } from 'vitest';
import {
  hoursSchema,
  restaurantConfigSchema,
} from '@/lib/schemas/restaurant';

describe('Restaurant Schemas', () => {
  describe('hoursSchema', () => {
    it('should parse valid hours object', () => {
      const valid = {
        mon: '11:00-21:00',
        tue: '11:00-21:00',
        wed: '11:00-21:00',
        thu: '11:00-21:00',
        fri: '11:00-22:00',
        sat: '12:00-22:00',
        sun: '12:00-20:00',
      };
      const result = hoursSchema.parse(valid);
      expect(result.mon).toBe('11:00-21:00');
      expect(result.sun).toBe('12:00-20:00');
    });

    it('should throw error for invalid day key', () => {
      const invalid = {
        monday: '11:00-21:00', // Should be 'mon'
      };
      expect(() => hoursSchema.parse(invalid)).toThrow();
    });

    it('should throw error for invalid time format', () => {
      const invalid = {
        mon: '11-21', // Should be "11:00-21:00"
      };
      expect(() => hoursSchema.parse(invalid)).toThrow();
    });
  });

  describe('restaurantConfigSchema', () => {
    it('should parse valid restaurant config', () => {
      const valid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        email: 'info@pizzapalace.com',
        hours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '12:00-22:00',
          sun: '12:00-20:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
        heroImage: 'https://example.com/hero.jpg',
        logo: 'https://example.com/logo.png',
        orderOnlineEnabled: true,
      };
      const result = restaurantConfigSchema.parse(valid);
      expect(result.id).toBe('rest-1');
      expect(result.slug).toBe('pizza-palace');
      expect(result.orderOnlineEnabled).toBe(true);
    });

    it('should apply default orderOnlineEnabled of false', () => {
      const valid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        hours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '12:00-22:00',
          sun: '12:00-20:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      const result = restaurantConfigSchema.parse(valid);
      expect(result.orderOnlineEnabled).toBe(false);
      expect(result.address).toBe('123 Main St');
    });

    it('should accept optional email, heroImage, and logo', () => {
      const valid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        hours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '12:00-22:00',
          sun: '12:00-20:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      const result = restaurantConfigSchema.parse(valid);
      expect(result.email).toBeUndefined();
      expect(result.heroImage).toBeUndefined();
      expect(result.logo).toBeUndefined();
    });

    it('should throw error for missing required slug', () => {
      const invalid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        hours: {
          mon: '11:00-21:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      expect(() => restaurantConfigSchema.parse(invalid)).toThrow();
    });

    it('should throw error for invalid slug format', () => {
      const invalid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'Pizza Palace', // Should be lowercase with hyphens
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        hours: {
          mon: '11:00-21:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      expect(() => restaurantConfigSchema.parse(invalid)).toThrow();
    });

    it('should throw error for invalid email format', () => {
      const invalid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '+1-555-123-4567',
        email: 'invalid-email', // Should be valid email
        hours: {
          mon: '11:00-21:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      expect(() => restaurantConfigSchema.parse(invalid)).toThrow();
    });

    it('should throw error for missing required address fields', () => {
      const invalid = {
        id: 'rest-1',
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        address: '123 Main St',
        // Missing city, state, zip
        phone: '+1-555-123-4567',
        hours: {
          mon: '11:00-21:00',
        },
        cuisine: 'Italian',
        theme: 'modern',
      };
      expect(() => restaurantConfigSchema.parse(invalid)).toThrow();
    });
  });
});

