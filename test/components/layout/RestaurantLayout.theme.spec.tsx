/**
 * RestaurantLayout Theme Tests
 * 
 * Verifies that RestaurantLayout uses theme tokens correctly.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { CartProvider } from '@/components/order/CartProvider';
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
  theme: 'warm-pizza',
  orderOnlineEnabled: false,
};

describe('RestaurantLayout Theme Usage', () => {
  const themeKeys = ['sushi-dark', 'cafe-warm', 'warm-pizza', 'modern-sushi'] as const;

  themeKeys.forEach((themeKey) => {
    it(`should render with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <CartProvider>
          <RestaurantLayout config={config}>
            <div>Test Content</div>
          </RestaurantLayout>
        </CartProvider>
      );

      const header = container.querySelector('header');
      const footer = container.querySelector('footer');
      
      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it(`should use theme colors in header with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <CartProvider>
          <RestaurantLayout config={config}>
            <div>Test Content</div>
          </RestaurantLayout>
        </CartProvider>
      );

      const header = container.querySelector('header');
      expect(header?.className).toContain('bg-');
    });

    it(`should use theme colors in footer with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <CartProvider>
          <RestaurantLayout config={config}>
            <div>Test Content</div>
          </RestaurantLayout>
        </CartProvider>
      );

      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('bg-');
    });

    it(`should use theme colors in header border with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <CartProvider>
          <RestaurantLayout config={config}>
            <div>Test Content</div>
          </RestaurantLayout>
        </CartProvider>
      );

      const header = container.querySelector('header');
      expect(header?.className).toContain('border-');
    });

    it(`should use theme text colors in footer with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <CartProvider>
          <RestaurantLayout config={config}>
            <div>Test Content</div>
          </RestaurantLayout>
        </CartProvider>
      );

      const footerText = container.querySelector('footer p');
      expect(footerText?.className).toContain('text-');
    });
  });
});

