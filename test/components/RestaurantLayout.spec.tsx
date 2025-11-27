/**
 * Test for RestaurantLayout component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { CartProvider } from '@/components/order/CartProvider';
import { restaurantConfigSchema } from '@/lib/schemas/restaurant';

describe('RestaurantLayout', () => {
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
    cuisine: 'Test Cuisine',
    theme: 'test-theme',
    orderOnlineEnabled: true,
  });

  it('should render header with restaurant name', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('should render header with logo when provided', () => {
    const configWithLogo = {
      ...mockConfig,
      logo: 'https://example.com/logo.png',
    };
    
    render(
      <CartProvider>
        <RestaurantLayout config={configWithLogo}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    const logo = screen.getByAltText('Test Restaurant logo');
    expect(logo).toBeInTheDocument();
    // Next.js Image transforms the src URL (URL-encodes it), so we check it contains the encoded version
    expect(logo.getAttribute('src')).toContain('example.com');
    expect(logo.getAttribute('src')).toContain('logo.png');
  });

  it('should render main content area with children', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Main Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('should render footer with address, hours, and phone', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
    expect(screen.getByText(/Test City, TS 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1-555-123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('should render navigation stub in header', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check navigation items are in the header
    const nav = header.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.textContent).toContain('Menu');
    expect(nav?.textContent).toContain('About');
    expect(nav?.textContent).toContain('Contact');
  });
});

