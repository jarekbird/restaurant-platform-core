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
    
    const header = screen.getByText('Test Restaurant').closest('header');
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
    
    const logo = screen.getByAltText('Test Restaurant');
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
    
    const footer = screen.getByText(/123 Test St/i).closest('footer');
    expect(footer).toBeInTheDocument();
    expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
    expect(screen.getByText(/Test City, TS 12345/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1-555-123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('should render Order Online button in header', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    const header = screen.getByText('Test Restaurant').closest('header');
    expect(header).toBeInTheDocument();
    
    // Check Order Online button is in the header - there may be multiple (header + mobile sticky bar)
    const orderButtons = screen.getAllByRole('button', { name: /Order Online/i });
    expect(orderButtons.length).toBeGreaterThanOrEqual(1);
    // Verify at least one is in the header
    const headerButton = Array.from(orderButtons).find(btn => header?.contains(btn));
    expect(headerButton).toBeInTheDocument();
  });
});

