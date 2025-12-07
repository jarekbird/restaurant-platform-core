/**
 * Test for MenuSectionList component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { menuSchema } from '@/lib/schemas/menu';
import { CartProvider } from '@/components/order/CartProvider';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';

describe('MenuSectionList', () => {
  const mockMenu = menuSchema.parse({
    id: 'test-menu',
    name: 'Test Menu',
    currency: 'USD',
    categories: [
      {
        id: 'appetizers',
        name: 'Appetizers',
        description: 'Start your meal',
        items: [
          {
            id: 'item-1',
            name: 'Bruschetta',
            description: 'Toasted bread',
            price: 8.99,
            tags: ['vegetarian'],
          },
        ],
      },
      {
        id: 'mains',
        name: 'Main Courses',
        items: [
          {
            id: 'item-2',
            name: 'Pizza',
            price: 15.99,
          },
        ],
      },
    ],
  });

  it('should render all categories', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main Courses')).toBeInTheDocument();
  });

  it('should render category descriptions when provided', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Start your meal')).toBeInTheDocument();
  });

  it('should render all items from all categories', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    const bruschettaItems = screen.getAllByText('Bruschetta');
    expect(bruschettaItems.length).toBeGreaterThan(0);
    const pizzaItems = screen.getAllByText('Pizza');
    expect(pizzaItems.length).toBeGreaterThan(0);
  });

  it('should render item details correctly', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    const descriptions = screen.getAllByText('Toasted bread');
    expect(descriptions.length).toBeGreaterThan(0);
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  it('should render item tags when present', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    const vegetarianTags = screen.getAllByText('vegetarian');
    expect(vegetarianTags.length).toBeGreaterThan(0);
  });

  it('should accept and apply className prop', () => {
    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} className="custom-class" />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    const wrapper = container.querySelector('div[class*="container"]');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should handle menu with single category', () => {
    const singleCategoryMenu = menuSchema.parse({
      id: 'simple-menu',
      name: 'Simple Menu',
      categories: [
        {
          id: 'drinks',
          name: 'Drinks',
          items: [
            {
              id: 'water',
              name: 'Water',
              price: 2.99,
            },
          ],
        },
      ],
    });

    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={singleCategoryMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    const waterItems = screen.getAllByText('Water');
    expect(waterItems.length).toBeGreaterThan(0);
  });
});

