/**
 * Test for MenuSectionList component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { menuSchema } from '@/lib/schemas/menu';

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
    render(<MenuSectionList menu={mockMenu} />);
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main Courses')).toBeInTheDocument();
  });

  it('should render category descriptions when provided', () => {
    render(<MenuSectionList menu={mockMenu} />);
    expect(screen.getByText('Start your meal')).toBeInTheDocument();
  });

  it('should render all items from all categories', () => {
    render(<MenuSectionList menu={mockMenu} />);
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('should render item details correctly', () => {
    render(<MenuSectionList menu={mockMenu} />);
    expect(screen.getByText('Toasted bread')).toBeInTheDocument();
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  it('should render item tags when present', () => {
    render(<MenuSectionList menu={mockMenu} />);
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
  });

  it('should accept and apply className prop', () => {
    const { container } = render(
      <MenuSectionList menu={mockMenu} className="custom-class" />
    );
    const wrapper = container.querySelector('div');
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

    render(<MenuSectionList menu={singleCategoryMenu} />);
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
  });

  it('should handle empty categories gracefully', () => {
    const emptyMenu = menuSchema.parse({
      id: 'empty-menu',
      name: 'Empty Menu',
      categories: [],
    });

    const { container } = render(<MenuSectionList menu={emptyMenu} />);
    // Should render without errors even with no categories
    expect(container).toBeInTheDocument();
  });
});

