import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { CartProvider } from '@/components/order/CartProvider';
import { RestaurantConfig } from '@/lib/schemas/restaurant';

const mockConfig: RestaurantConfig = {
  name: 'Test Restaurant',
  slug: 'test-restaurant',
  theme: 'modern',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  phone: '555-1234',
  hours: {
    mon: '9am-5pm',
    tue: '9am-5pm',
    wed: '9am-5pm',
    thu: '9am-5pm',
    fri: '9am-5pm',
    sat: '10am-3pm',
    sun: 'closed',
  },
  orderOnlineEnabled: true,
};

describe('RestaurantLayout - Cart Aware', () => {
  it('should access cart context without errors', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Test Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render all layout sections correctly', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Main Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    // Check header
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    
    // Check main content
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    
    // Check footer sections exist (using queryByRole for headings)
    const addressHeading = screen.queryByRole('heading', { name: /address/i });
    const hoursHeading = screen.queryByRole('heading', { name: /hours/i });
    const contactHeading = screen.queryByRole('heading', { name: /contact/i });
    
    // At least verify the layout structure is present
    expect(addressHeading || screen.getByText(/123 Test St/)).toBeTruthy();
    expect(hoursHeading || screen.getByText(/9am-5pm/)).toBeTruthy();
    expect(contactHeading || screen.getByText(/555-1234/)).toBeTruthy();
  });

  it('should render restaurant information correctly', () => {
    render(
      <CartProvider>
        <RestaurantLayout config={mockConfig}>
          <div>Content</div>
        </RestaurantLayout>
      </CartProvider>
    );
    
    // Check that address information is present (may be split across elements)
    expect(screen.getByText(/123 Test St/)).toBeInTheDocument();
    expect(screen.getByText(/Test City/)).toBeInTheDocument();
    expect(screen.getByText(/555-1234/)).toBeInTheDocument();
  });
});

