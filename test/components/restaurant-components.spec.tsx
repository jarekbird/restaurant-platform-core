/**
 * Tests for restaurant home page block components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { FeaturedItems } from '@/components/restaurant/FeaturedItems';
import { HoursAndLocation } from '@/components/restaurant/HoursAndLocation';
import { CallToActionBar } from '@/components/restaurant/CallToActionBar';
import { restaurantConfigSchema, menuItemSchema } from '@/lib/schemas';

describe('Restaurant Home Page Blocks', () => {
  const mockConfig = restaurantConfigSchema.parse({
    id: 'test-restaurant',
    name: 'Test Restaurant',
    slug: 'test-restaurant',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    phone: '+1-555-123-4567',
    email: 'test@example.com',
    hours: {
      mon: '11:00-21:00',
      tue: '11:00-21:00',
      wed: '11:00-21:00',
      thu: '11:00-21:00',
      fri: '11:00-22:00',
      sat: '12:00-22:00',
      sun: '12:00-20:00',
    },
    cuisine: 'Italian',
    theme: 'test-theme',
    heroImage: 'https://example.com/hero.jpg',
  });

  describe('HeroSection', () => {
    it('should render restaurant name', () => {
      render(<HeroSection config={mockConfig} />);
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    it('should render cuisine tagline when provided', () => {
      render(<HeroSection config={mockConfig} />);
      expect(screen.getByText('Italian Cuisine')).toBeInTheDocument();
    });

    it('should handle config without hero image', () => {
      const configWithoutHero = {
        ...mockConfig,
        heroImage: undefined,
      };
      render(<HeroSection config={configWithoutHero} />);
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });
  });

  describe('FeaturedItems', () => {
    const mockItems = [
      menuItemSchema.parse({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
        tags: ['popular'],
      }),
      menuItemSchema.parse({
        id: 'item-2',
        name: 'Pasta',
        description: 'Delicious pasta',
        price: 14.99,
      }),
    ];

    it('should render featured items title', () => {
      render(<FeaturedItems items={mockItems} />);
      expect(screen.getByText('Featured Items')).toBeInTheDocument();
    });

    it('should render all featured items', () => {
      render(<FeaturedItems items={mockItems} />);
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Pasta')).toBeInTheDocument();
    });

    it('should render custom title when provided', () => {
      render(<FeaturedItems items={mockItems} title="Today's Specials" />);
      expect(screen.getByText("Today's Specials")).toBeInTheDocument();
    });

    it('should return null when items array is empty', () => {
      const { container } = render(<FeaturedItems items={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('HoursAndLocation', () => {
    it('should render location information', () => {
      render(<HoursAndLocation config={mockConfig} />);
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
      expect(screen.getByText(/Test City, TS 12345/i)).toBeInTheDocument();
      expect(screen.getByText(/\+1-555-123-4567/i)).toBeInTheDocument();
    });

    it('should render hours information', () => {
      render(<HoursAndLocation config={mockConfig} />);
      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('Monday:')).toBeInTheDocument();
      const hours = screen.getAllByText('11:00-21:00');
      expect(hours.length).toBeGreaterThan(0);
      expect(screen.getByText('Friday:')).toBeInTheDocument();
      expect(screen.getByText('11:00-22:00')).toBeInTheDocument();
    });

    it('should render email when provided', () => {
      render(<HoursAndLocation config={mockConfig} />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should handle config without email', () => {
      const configWithoutEmail = {
        ...mockConfig,
        email: undefined,
      };
      render(<HoursAndLocation config={configWithoutEmail} />);
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });
  });

  describe('CallToActionBar', () => {
    it('should render primary action button', () => {
      render(
        <CallToActionBar
          primaryAction={{ label: 'Order Now', onClick: () => {} }}
        />
      );
      expect(screen.getByText('Order Now')).toBeInTheDocument();
    });

    it('should call onClick when button is clicked', () => {
      const handleClick = vi.fn();
      render(
        <CallToActionBar
          primaryAction={{ label: 'Order Now', onClick: handleClick }}
        />
      );
      const button = screen.getByText('Order Now');
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render as link when href is provided', () => {
      render(
        <CallToActionBar
          primaryAction={{ label: 'Order Now', href: '/order' }}
        />
      );
      const link = screen.getByText('Order Now').closest('a');
      expect(link).toHaveAttribute('href', '/order');
    });
  });
});

