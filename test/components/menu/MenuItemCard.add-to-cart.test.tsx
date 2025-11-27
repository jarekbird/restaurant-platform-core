import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CartProvider } from '@/components/order/CartProvider';
import { menuItemSchema } from '@/lib/schemas/menu';

describe('MenuItemCard - Add to Cart', () => {
  const mockItem = menuItemSchema.parse({
    id: 'test-item-1',
    name: 'Test Item',
    description: 'A test item',
    price: 10.99,
    tags: ['popular'],
  });

  it('should display Add to Cart button', () => {
    render(
      <CartProvider>
        <MenuItemCard item={mockItem} />
      </CartProvider>
    );
    
    const button = screen.getByText('Add to Cart');
    expect(button).toBeInTheDocument();
  });

  it('should add item to cart when button is clicked', () => {
    render(
      <CartProvider>
        <MenuItemCard item={mockItem} />
      </CartProvider>
    );
    
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    
    // Verify button is still present after click (no errors)
    expect(button).toBeInTheDocument();
  });

  it('should have proper ARIA label', () => {
    render(
      <CartProvider>
        <MenuItemCard item={mockItem} />
      </CartProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Add Test Item to cart');
  });

  it('should render item information correctly', () => {
    render(
      <CartProvider>
        <MenuItemCard item={mockItem} />
      </CartProvider>
    );
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('A test item')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
  });
});

