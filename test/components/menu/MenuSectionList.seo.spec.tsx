/**
 * MenuSectionList SEO Tests
 * 
 * Verifies that MenuSectionList uses SEO-friendly heading hierarchy (h2 for categories).
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { CartProvider } from '@/components/order/CartProvider';
import { Menu } from '@/lib/schemas/menu';

const mockMenu: Menu = {
  id: 'test-menu',
  name: 'Test Menu',
  currency: 'USD',
  categories: [
    {
      id: 'appetizers',
      name: 'Appetizers',
      description: 'Start your meal with these delicious appetizers',
      items: [
        {
          id: 'item-1',
          name: 'Spring Roll',
          price: 5.99,
          description: 'Crispy spring roll',
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
          price: 12.99,
        },
      ],
    },
  ],
};

describe('MenuSectionList SEO Structure', () => {
  it('should render each category as a section with h2 heading', () => {
    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(2);

    const h2Elements = container.querySelectorAll('h2');
    expect(h2Elements.length).toBe(2);
    expect(h2Elements[0].textContent).toBe('Appetizers');
    expect(h2Elements[1].textContent).toBe('Main Courses');
  });

  it('should render category description when present', () => {
    const { getByText } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );

    expect(getByText('Start your meal with these delicious appetizers')).toBeInTheDocument();
  });

  it('should not render description when category description is missing', () => {
    const menuWithoutDescription: Menu = {
      ...mockMenu,
      categories: [
        {
          id: 'mains',
          name: 'Main Courses',
          items: [
            {
              id: 'item-2',
              name: 'Pizza',
              price: 12.99,
            },
          ],
        },
      ],
    };

    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={menuWithoutDescription} />
        </RestaurantThemeProvider>
      </CartProvider>
    );

    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('Main Courses');

    // Description paragraph should not exist
    // There might be other paragraphs (item descriptions), so we check that
    // the category description paragraph doesn't exist by checking it's not
    // directly after the h2
    const categorySection = container.querySelector('section');
    const categoryDescription = categorySection?.querySelector('div.mb-4 > p');
    expect(categoryDescription).not.toBeInTheDocument();
  });

  it('should ensure only one h2 per category section', () => {
    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );

    const sections = container.querySelectorAll('section');
    sections.forEach((section) => {
      const h2InSection = section.querySelectorAll('h2');
      expect(h2InSection.length).toBe(1);
    });
  });

  it('should use semantic section elements for each category', () => {
    const { container } = render(
      <CartProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      </CartProvider>
    );

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(mockMenu.categories.length);

    sections.forEach((section, index) => {
      const h2 = section.querySelector('h2');
      expect(h2).toBeInTheDocument();
      expect(h2?.textContent).toBe(mockMenu.categories[index].name);
    });
  });
});

