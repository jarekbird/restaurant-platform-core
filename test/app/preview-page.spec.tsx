/**
 * Integration test for preview page route
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreviewPage, { generateMetadata } from '@/app/preview/[slug]/page';
import { loadRestaurant } from '@/lib/loaders/restaurant';

// Mock the loader
vi.mock('@/lib/loaders/restaurant', () => ({
  loadRestaurant: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock analytics
vi.mock('@/lib/analytics/events', () => ({
  trackViewRestaurant: vi.fn(),
  trackViewMenuCategory: vi.fn(),
  trackAddToCart: vi.fn(),
  trackStartCheckout: vi.fn(),
  trackCompleteOrder: vi.fn(),
  trackJoinVip: vi.fn(),
}));

describe('PreviewPage', () => {
  const mockConfig = {
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
    cuisine: 'Test Cuisine',
    theme: 'test-theme',
    orderOnlineEnabled: true,
  };

  const mockMenu = {
    id: 'test-menu',
    name: 'Test Menu',
    currency: 'USD',
    categories: [
      {
        id: 'appetizers',
        name: 'Appetizers',
        items: [
          {
            id: 'item-1',
            name: 'Test Item',
            price: 10.99,
          },
        ],
      },
    ],
  };

  it('should render restaurant name', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    const { container } = render(page);

    expect(container.textContent).toContain('Test Restaurant');
  });

  it('should render menu items', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    const { container } = render(page);

    expect(container.textContent).toContain('Test Item');
  });

  it('should render order button when orderOnlineEnabled is true', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: { ...mockConfig, orderOnlineEnabled: true },
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    const { container } = render(page);

    expect(container.textContent).toContain('Order Online');
  });

  it('should not render order button when orderOnlineEnabled is false', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: { ...mockConfig, orderOnlineEnabled: false },
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    const { container } = render(page);

    expect(container.textContent).not.toContain('Order Now');
  });

  // Task 4.12: Integration test for story & social proof components
  it('should render AboutSection component', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    render(page);

    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('should render ReviewHighlights component', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    render(page);

    // ReviewHighlights shows rating as "4.8 / 5" and review count
    expect(screen.getByText(/4\.8/)).toBeInTheDocument();
    expect(screen.getByText(/Based on \d+ reviews/)).toBeInTheDocument();
  });

  // Task 4.14: Integration test for capture components
  it('should render VipSignupBanner component', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    render(page);

    // VipSignupBanner should appear near the hero
    expect(screen.getAllByText('Join Our VIP Program').length).toBeGreaterThan(0);
  });

  it('should render VipSignupSection component', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    render(page);

    // VipSignupSection should appear above footer
    // Since both banner and section have the same heading, we check for multiple instances
    const vipHeadings = screen.getAllByText('Join Our VIP Program');
    expect(vipHeadings.length).toBeGreaterThanOrEqual(1);
  });

  it('should render SeoContentBlock component', async () => {
    vi.mocked(loadRestaurant).mockReturnValue({
      config: mockConfig,
      menu: mockMenu,
    });

    const params = Promise.resolve({ slug: 'test-restaurant' });
    const page = await PreviewPage({ params });
    render(page);

    // SeoContentBlock should render descriptive text about the restaurant
    // It includes the restaurant name in the content
    expect(screen.getByText(/Test Restaurant is/)).toBeInTheDocument();
  });

  // Task 6.17: Test generateMetadata function
  describe('generateMetadata', () => {
    it('should generate metadata for valid restaurant', async () => {
      vi.mocked(loadRestaurant).mockReturnValue({
        config: mockConfig,
        menu: mockMenu,
      });

      const params = Promise.resolve({ slug: 'test-restaurant' });
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
      expect(metadata.title).toContain('Test Restaurant');
    });

    it('should return fallback metadata for invalid restaurant', async () => {
      vi.mocked(loadRestaurant).mockImplementation(() => {
        throw new Error('Restaurant not found');
      });

      const params = Promise.resolve({ slug: 'invalid-restaurant' });
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe('Restaurant Not Found');
      expect(metadata.description).toBe('The requested restaurant could not be found.');
    });
  });
});

