/**
 * ReviewHighlights Tests
 * 
 * Verifies that ReviewHighlights renders correctly with theme tokens and mock content.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewHighlights } from '@/components/restaurant/ReviewHighlights';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';

describe('ReviewHighlights', () => {
  it('should render aggregate rating', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <ReviewHighlights />
      </RestaurantThemeProvider>
    );

    expect(screen.getByText('4.8 / 5')).toBeInTheDocument();
  });

  it('should render review count', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <ReviewHighlights />
      </RestaurantThemeProvider>
    );

    expect(screen.getByText(/Based on 127 reviews/)).toBeInTheDocument();
  });

  it('should render review quotes', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <ReviewHighlights />
      </RestaurantThemeProvider>
    );

    expect(screen.getByText(/Absolutely amazing food/)).toBeInTheDocument();
    expect(screen.getByText(/Great atmosphere/)).toBeInTheDocument();
    expect(screen.getByText(/The quality and freshness/)).toBeInTheDocument();
  });

  it('should use theme tokens for styling', () => {
    const { container } = render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <ReviewHighlights />
      </RestaurantThemeProvider>
    );

    const section = container.querySelector('section');
    const rating = container.querySelector('.text-5xl');
    const reviewCard = container.querySelector('div[class*="rounded-lg"]');

    expect(section?.className).toContain('bg-');
    expect(rating?.className).toContain('text-');
    expect(reviewCard?.className).toContain('bg-');
  });

  it('should render with different theme keys', () => {
    const themeKeys = ['sushi-dark', 'cafe-warm', 'modern-sushi'] as const;

    themeKeys.forEach((themeKey) => {
      const { container } = render(
        <RestaurantThemeProvider themeKey={themeKey}>
          <ReviewHighlights />
        </RestaurantThemeProvider>
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('4.8 / 5')).toBeInTheDocument();
    });
  });
});

