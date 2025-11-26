/**
 * Test for MenuItemCard component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { menuItemSchema } from '@/lib/schemas/menu';

describe('MenuItemCard', () => {
  const mockItem = menuItemSchema.parse({
    id: 'item-1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato and mozzarella',
    price: 12.99,
    tags: ['vegetarian', 'popular'],
  });

  it('should render item title', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  });

  it('should render item description when provided', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(
      screen.getByText('Classic pizza with tomato and mozzarella')
    ).toBeInTheDocument();
  });

  it('should render item price', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('should render tags when provided', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
    expect(screen.getByText('popular')).toBeInTheDocument();
  });

  it('should show modifier placeholder when modifiers are present', () => {
    const itemWithModifiers = menuItemSchema.parse({
      id: 'item-2',
      name: 'Pizza',
      price: 15.99,
      modifiers: [
        {
          name: 'Size',
          options: [{ name: 'Small', priceDelta: 0 }],
        },
      ],
    });

    render(<MenuItemCard item={itemWithModifiers} />);
    expect(
      screen.getByText('Customization options available')
    ).toBeInTheDocument();
  });

  it('should accept and apply className prop', () => {
    const { container } = render(
      <MenuItemCard item={mockItem} className="custom-class" />
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });

  it('should handle item without description', () => {
    const itemWithoutDesc = menuItemSchema.parse({
      id: 'item-3',
      name: 'Water',
      price: 2.99,
    });

    render(<MenuItemCard item={itemWithoutDesc} />);
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('$2.99')).toBeInTheDocument();
  });

  it('should handle item without tags', () => {
    const itemWithoutTags = menuItemSchema.parse({
      id: 'item-4',
      name: 'Pasta',
      description: 'Delicious pasta',
      price: 14.99,
    });

    render(<MenuItemCard item={itemWithoutTags} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.queryByText('vegetarian')).not.toBeInTheDocument();
  });

  it('should handle item without modifiers', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(
      screen.queryByText('Customization options available')
    ).not.toBeInTheDocument();
  });
});

