/**
 * Integration test for preview page route
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import PreviewPage from '@/app/preview/[slug]/page';
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
});

