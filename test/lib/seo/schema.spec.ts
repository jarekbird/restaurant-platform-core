/**
 * Schema JSON-LD Tests
 * 
 * Verifies that buildRestaurantJsonLd generates correct structured data.
 */

import { describe, it, expect } from 'vitest';
import { buildRestaurantJsonLd } from '@/lib/seo/schema';
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

describe('buildRestaurantJsonLd', () => {
  it('should generate valid JSON-LD structure', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig);
    
    expect(jsonLd).toHaveProperty('@context', 'https://schema.org');
    expect(jsonLd).toHaveProperty('@type', 'Restaurant');
    expect(jsonLd).toHaveProperty('name', mockConfig.name);
  });

  it('should include address information', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig) as Record<string, unknown>;
    
    expect(jsonLd.address).toBeDefined();
    const address = jsonLd.address as Record<string, unknown>;
    expect(address['@type']).toBe('PostalAddress');
    expect(address.streetAddress).toBe(mockConfig.address);
    expect(address.addressLocality).toBe(mockConfig.city);
    expect(address.addressRegion).toBe(mockConfig.state);
    expect(address.postalCode).toBe(mockConfig.zip);
  });

  it('should include contact information', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig) as Record<string, unknown>;
    
    expect(jsonLd.telephone).toBe(mockConfig.phone);
    expect(jsonLd.servesCuisine).toBe(mockConfig.cuisine);
  });

  it('should include opening hours', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig) as Record<string, unknown>;
    
    expect(jsonLd.openingHoursSpecification).toBeDefined();
    expect(Array.isArray(jsonLd.openingHoursSpecification)).toBe(true);
    const hours = jsonLd.openingHoursSpecification as unknown[];
    expect(hours.length).toBe(7);
  });

  it('should include email if provided', () => {
    const configWithEmail = { ...mockConfig, email: 'test@example.com' };
    const jsonLd = buildRestaurantJsonLd(configWithEmail) as Record<string, unknown>;
    
    expect(jsonLd.email).toBe('test@example.com');
  });

  it('should not include email if not provided', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig) as Record<string, unknown>;
    
    expect(jsonLd.email).toBeUndefined();
  });

  it('should generate valid URL', () => {
    const jsonLd = buildRestaurantJsonLd(mockConfig, 'https://example.com') as Record<string, unknown>;
    
    expect(jsonLd.url).toBe(`https://example.com/preview/${mockConfig.slug}`);
  });
});

