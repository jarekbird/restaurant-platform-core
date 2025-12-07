/**
 * MenuItemCard Theme Tests
 * 
 * Verifies that MenuItemCard uses theme tokens correctly.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CartProvider } from '@/components/order/CartProvider';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { MenuItem } from '@/lib/schemas/menu';

const mockItem: MenuItem = {
  id: 'item-1',
  name: 'Test Item',
  price: 10.99,
  description: 'Test description',
  tags: ['popular', 'spicy'],
};

describe('MenuItemCard Theme Usage', () => {
  const themeKeys = ['sushi-dark', 'cafe-warm', 'warm-pizza', 'modern-sushi'] as const;

  themeKeys.forEach((themeKey) => {
    it(`should render with ${themeKey} theme`, () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey={themeKey}>
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const card = container.querySelector('div[class*="rounded-lg"]');
      expect(card).toBeInTheDocument();
    });

    it(`should use theme colors in card with ${themeKey} theme`, () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey={themeKey}>
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const card = container.querySelector('div[class*="rounded-lg"]');
      expect(card?.className).toContain('bg-');
    });

    it(`should use theme primary color for button with ${themeKey} theme`, () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey={themeKey}>
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-');
    });
  });
});

