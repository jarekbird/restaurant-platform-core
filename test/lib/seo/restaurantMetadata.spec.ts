/**
 * Restaurant Metadata Tests
 * 
 * Verifies that buildRestaurantMetadata generates correct SEO metadata.
 */

import { describe, it, expect } from 'vitest';
import { buildRestaurantMetadata } from '@/lib/seo/restaurantMetadata';
import { RestaurantConfig } from '@/lib/schemas/restaurant';

const mockConfig: RestaurantConfig = {
  id: 'test-restaurant',
  name: 'Test Restaurant',
  slug: 'test-restaurant',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  phone: '555-1234',
  hours: {
    mon: '09:00-17:00',
    tue: '09:00-17:00',
    wed: '09:00-17:00',
    thu: '09:00-17:00',
    fri: '09:00-17:00',
    sat: '09:00-17:00',
    sun: '09:00-17:00',
  },
  cuisine: 'Italian',
  theme: 'warm-pizza',
  orderOnlineEnabled: false,
};

describe('buildRestaurantMetadata', () => {
  it('should generate title for home page type', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'home');
    expect(metadata.title).toBe('Test Restaurant - Italian in Test City | Order Online');
  });

  it('should generate title for menu page type', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'menu');
    expect(metadata.title).toBe('Menu - Test Restaurant in Test City | Order Online');
  });

  it('should generate title for catering page type', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'catering');
    expect(metadata.title).toBe('Catering - Test Restaurant in Test City | Order Online');
  });

  it('should generate title for index page type', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'index');
    expect(metadata.title).toBe('Test Restaurant in Test City | Restaurant');
  });

  it('should generate description with cuisine and city', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'home');
    expect(metadata.description).toBe('Test Restaurant offers authentic italian in Test City. Order online for delivery or pickup.');
  });

  it('should handle config without cuisine', () => {
    const configWithoutCuisine = { ...mockConfig, cuisine: undefined };
    const metadata = buildRestaurantMetadata(configWithoutCuisine, 'home');
    expect(metadata.title).toBe('Test Restaurant in Test City | Order Online');
    expect(metadata.description).toBe('Test Restaurant in Test City. Order online for delivery or pickup.');
  });

  it('should handle config without city', () => {
    const configWithoutCity = { ...mockConfig, city: '' };
    const metadata = buildRestaurantMetadata(configWithoutCity, 'home');
    expect(metadata.title).toBe('Test Restaurant - Italian | Order Online');
    expect(metadata.description).toBe('Test Restaurant offers authentic italian. Order online for delivery or pickup.');
  });

  it('should include OpenGraph metadata', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'home');
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toBe(metadata.title);
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.openGraph?.type).toBe('website');
  });

  it('should include Twitter card metadata', () => {
    const metadata = buildRestaurantMetadata(mockConfig, 'home');
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe('summary');
    expect(metadata.twitter?.title).toBe(metadata.title);
    expect(metadata.twitter?.description).toBe(metadata.description);
  });
});

