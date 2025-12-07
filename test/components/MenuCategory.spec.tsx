/**
 * Test for MenuCategory component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuCategory } from '@/components/menu/MenuCategory';
import { menuCategorySchema } from '@/lib/schemas/menu';
import { CartProvider } from '@/components/order/CartProvider';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';

describe('MenuCategory', () => {
  const mockCategory = menuCategorySchema.parse({
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal right',
    items: [
      {
        id: 'item-1',
        name: 'Bruschetta',
        description: 'Toasted bread with tomatoes',
        price: 8.99,
        tags: ['vegetarian'],
      },
      {
        id: 'item-2',
        name: 'Wings',
        description: 'Spicy chicken wings',
        price: 12.99,
        tags: ['spicy', 'popular'],
      },
    ],
  });

  it('should render category name', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
  });

  it('should render category description when provided', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Start your meal right')).toBeInTheDocument();
  });

  it('should render all menu items', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Wings')).toBeInTheDocument();
  });

  it('should render item descriptions when provided', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Toasted bread with tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Spicy chicken wings')).toBeInTheDocument();
  });

  it('should render item prices', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('should render item tags when provided', () => {
    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
    expect(screen.getByText('spicy')).toBeInTheDocument();
    expect(screen.getByText('popular')).toBeInTheDocument();
  });

  it('should accept and apply className prop', () => {
    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={mockCategory} className="custom-class" />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('should handle category without description', () => {
    const categoryWithoutDesc = menuCategorySchema.parse({
      id: 'mains',
      name: 'Main Courses',
      items: [
        {
          id: 'item-3',
          name: 'Pizza',
          price: 15.99,
        },
      ],
    });

    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={categoryWithoutDesc} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Main Courses')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('should handle items without descriptions or tags', () => {
    const simpleCategory = menuCategorySchema.parse({
      id: 'drinks',
      name: 'Drinks',
      items: [
        {
          id: 'item-4',
          name: 'Water',
          price: 2.99,
        },
      ],
    });

    render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuCategory category={simpleCategory} />
        </RestaurantThemeProvider>
      </CartProvider>
    );
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('$2.99')).toBeInTheDocument();
  });
});

