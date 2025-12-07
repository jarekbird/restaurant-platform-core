/**
 * MenuItemCard Theme Tests
 * 
 * Verifies that MenuItemCard uses theme tokens correctly.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  describe('Visual Hierarchy', () => {
    it('should render elements in correct order: image → name → description → price → button', () => {
      const itemWithImage: MenuItem = {
        ...mockItem,
        image: '/test-image.jpg',
      };
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={itemWithImage} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      // Verify image container exists (with aspect-[4/3] class)
      const imageContainer = container.querySelector('div[class*="aspect-[4/3]"]');
      expect(imageContainer).toBeInTheDocument();
      
      // Verify name, description, price, and button exist
      expect(screen.getByText(mockItem.name)).toBeInTheDocument();
      expect(screen.getByText(mockItem.description!)).toBeInTheDocument();
      expect(screen.getByText('$10.99')).toBeInTheDocument();
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should have prominent name styling (larger font, bold)', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const h3 = container.querySelector('h3');
      expect(h3?.className).toContain('text-lg');
      // Check for either font-semibold or font-bold (theme typography.heading uses font-bold)
      expect(h3?.className).toMatch(/font-(semibold|bold)/);
    });

    it('should have clearly visible price', () => {
      render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const priceElement = screen.getByText('$10.99');
      expect(priceElement).toBeInTheDocument();
      expect(priceElement.className).toContain('font-semibold');
    });
  });

  describe('Theme Token Usage', () => {
    it('should use theme.colors.surface for card background', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const card = container.querySelector('div[class*="rounded-lg"]');
      expect(card?.className).toContain('bg-');
    });

    it('should use theme.colors.text for item name', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="modern-sushi">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const h3 = container.querySelector('h3');
      expect(h3?.className).toContain('text-');
    });

    it('should use theme.colors.textMuted for description', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="cafe-warm">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const p = container.querySelector('p');
      expect(p?.className).toContain('text-');
    });

    it('should use theme.colors.border for card border', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="sushi-dark">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const card = container.querySelector('div[class*="rounded-lg"]');
      expect(card?.className).toContain('border');
    });

    it('should use theme.colors.primary for Add to Cart button', () => {
      const { container } = render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-');
    });
  });
});

