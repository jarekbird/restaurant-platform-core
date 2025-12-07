/**
 * HeroSection Theme Tests
 * 
 * Verifies that HeroSection uses theme tokens correctly with different themes.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HeroSection } from '@/components/restaurant/HeroSection';
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
  cuisine: 'Test Cuisine',
  theme: 'sushi-dark',
  orderOnlineEnabled: false,
};

describe('HeroSection Theme Usage', () => {
  const themeKeys = ['sushi-dark', 'cafe-warm', 'pizza-bright', 'warm-pizza', 'modern-sushi'] as const;

  themeKeys.forEach((themeKey) => {
    it(`should render with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <RestaurantThemeProvider themeKey={themeKey}>
          <HeroSection config={config} />
        </RestaurantThemeProvider>
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it(`should use theme colors with ${themeKey} theme`, () => {
      const config = { ...mockConfig, theme: themeKey };
      const { container } = render(
        <RestaurantThemeProvider themeKey={themeKey}>
          <HeroSection config={config} />
        </RestaurantThemeProvider>
      );

      const section = container.querySelector('section');
      const h1 = container.querySelector('h1');
      
      // Section should have theme background class
      expect(section?.className).toContain('bg-');
      
      // H1 should have theme text class
      expect(h1?.className).toContain('text-');
    });
  });

  it('should use theme typography for heading', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('font-bold');
  });

  it('should use theme textMuted for cuisine text', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="modern-sushi">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const cuisineText = container.querySelector('p');
    expect(cuisineText?.className).toContain('text-');
  });

  it('should render tagline when both cuisine and city are present', () => {
    const configWithCity = { ...mockConfig, city: 'Test City' };
    const { getByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={configWithCity} />
      </RestaurantThemeProvider>
    );

    expect(getByText(/Authentic.*in Test City/)).toBeInTheDocument();
  });

  it('should not render tagline when city is missing', () => {
    const configWithoutCity = { ...mockConfig, city: '' };
    const { queryByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={configWithoutCity} />
      </RestaurantThemeProvider>
    );

    expect(queryByText(/Authentic.*in/)).not.toBeInTheDocument();
  });

  it('should render Order Online button when orderOnlineEnabled is true', () => {
    const configWithOrdering = { ...mockConfig, orderOnlineEnabled: true };
    const { getByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={configWithOrdering} />
      </RestaurantThemeProvider>
    );

    expect(getByText('Order Online')).toBeInTheDocument();
  });

  it('should not render Order Online button when orderOnlineEnabled is false', () => {
    const { queryByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    expect(queryByText('Order Online')).not.toBeInTheDocument();
  });

  it('should call onOrderClick when button is clicked', () => {
    const handleOrderClick = vi.fn();
    const configWithOrdering = { ...mockConfig, orderOnlineEnabled: true };
    const { getByText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={configWithOrdering} onOrderClick={handleOrderClick} />
      </RestaurantThemeProvider>
    );

    const button = getByText('Order Online');
    button.click();
    expect(handleOrderClick).toHaveBeenCalledTimes(1);
  });

  it('should have accessible button with ARIA label', () => {
    const configWithOrdering = { ...mockConfig, orderOnlineEnabled: true };
    const { getByLabelText } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={configWithOrdering} />
      </RestaurantThemeProvider>
    );

    const button = getByLabelText('Order Online');
    expect(button).toBeInTheDocument();
  });

  it('should have responsive text sizing classes', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <HeroSection config={mockConfig} />
      </RestaurantThemeProvider>
    );

    const h1 = container.querySelector('h1');
    expect(h1?.className).toContain('text-4xl');
    expect(h1?.className).toContain('md:text-5xl');
    expect(h1?.className).toContain('lg:text-6xl');
  });
});

