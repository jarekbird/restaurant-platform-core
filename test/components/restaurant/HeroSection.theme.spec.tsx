/**
 * HeroSection Theme Tests
 * 
 * Verifies that HeroSection uses theme tokens correctly with different themes.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
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
  cuisine: 'Test Cuisine',
  theme: 'sushi-dark',
  orderOnlineEnabled: false,
};

describe('HeroSection Theme Usage', () => {
  const themeKeys = ['sushi-dark', 'cafe-warm', 'pizza-bright', 'warm-pizza', 'modern-sushi'] as const;

  themeKeys.forEach((themeKey) => {
    it(`should render with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <RestaurantThemeProvider themeKey={themeKey}>
          <HeroSection config={config} />
        </RestaurantThemeProvider>
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it(`should use theme colors with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <RestaurantThemeProvider themeKey={themeKey}>
          <HeroSection config={config} />
        </RestaurantThemeProvider>
      );

      const section = container.querySelector('section');
      const h1 = container.querySelector('h1');
      
      // Section should have theme background class
      expect(section?.className).toContain('bg-');
      
      // H1 should have theme text class
      expect(h1?.className).toContain('text-');
    });
  });

  it('should use theme typography for heading', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('font-bold');
  });

  it('should use theme textMuted for cuisine text', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="modern-sushi">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const cuisineText = container.querySelector('p');
    expect(cuisineText?.className).toContain('text-');
  });
});

