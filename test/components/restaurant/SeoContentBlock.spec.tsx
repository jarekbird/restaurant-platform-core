/**
 * SeoContentBlock Tests
 * 
 * Verifies that SeoContentBlock renders correctly with theme tokens and SEO-friendly content.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeoContentBlock } from '@/components/restaurant/SeoContentBlock';
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
  cuisine: 'Italian',
  theme: 'warm-pizza',
  orderOnlineEnabled: false,
};

describe('SeoContentBlock', () => {
  it('should render descriptive paragraphs', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <SeoContentBlock config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const paragraphs = screen.getAllByText(/./).filter(el => el.tagName === 'P');
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
  });

  it('should include restaurant name in content', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <SeoContentBlock config={mockConfig} />
      </RestaurantThemeProvider>
    );

    expect(screen.getByText(new RegExp(mockConfig.name))).toBeInTheDocument();
  });

  it('should use theme tokens for styling', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <SeoContentBlock config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    const p = container.querySelector('p');

    expect(section?.className).toContain('bg-');
    expect(p?.className).toContain('text-');
  });

  it('should customize content based on cuisine type', () => {
    const pizzaConfig = { ...mockConfig, cuisine: 'Pizza' };
    const { getByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <SeoContentBlock config={pizzaConfig} />
      </RestaurantThemeProvider>
    );

    expect(getByText(/Italian-style pizzas/)).toBeInTheDocument();
  });

  it('should use semantic HTML (section, p tags)', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <SeoContentBlock config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    const paragraphs = container.querySelectorAll('p');

    expect(section).toBeInTheDocument();
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});

