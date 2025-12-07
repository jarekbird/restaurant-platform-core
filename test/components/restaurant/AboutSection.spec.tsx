/**
 * AboutSection Tests
 * 
 * Verifies that AboutSection renders correctly with theme tokens and mock content.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from '@/components/restaurant/AboutSection';
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

describe('AboutSection', () => {
  it('should render "Our Story" heading', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('should render descriptive paragraphs', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    // Should have at least 2 paragraphs - check for restaurant name which should be in content
    expect(screen.getByText(new RegExp(mockConfig.name))).toBeInTheDocument();
    
    const paragraphs = screen.getAllByText(/./).filter(el => el.tagName === 'P');
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
  });

  it('should use theme tokens for styling', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    const h2 = container.querySelector('h2');
    const p = container.querySelector('p');

    expect(section?.className).toContain('bg-');
    expect(h2?.className).toContain('text-');
    expect(p?.className).toContain('text-');
  });

  it('should customize content based on cuisine type', () => {
    const pizzaConfig = { ...mockConfig, cuisine: 'Pizza' };
    const { getByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <AboutSection config={pizzaConfig} />
      </RestaurantThemeProvider>
    );

    expect(getByText(/Italian-style pizzas/)).toBeInTheDocument();
  });

  it('should render with sushi-dark theme', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="sushi-dark">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('should render with cafe-warm theme', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="cafe-warm">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('should render with modern-sushi theme', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="modern-sushi">
        <AboutSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });
});

