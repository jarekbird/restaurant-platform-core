import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CartProvider } from '@/components/order/CartProvider';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { MenuItem } from '@/lib/schemas/menu';
import { ToastProvider } from '@/components/ui/ToastProvider';

/**
 * Integration test for full cart flow
 * Tests: add items via UI → adjust quantities → remove items → complete checkout → order confirmation → cart clearing
 */
describe('Full Cart Flow Integration', () => {
  const mockRestaurantConfig: RestaurantConfig = {
    id: 'test-restaurant',
    name: 'Test Restaurant',
    slug: 'test-restaurant',
    address: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zip: '12345',
    phone: '555-1234',
    email: 'test@example.com',
    hours: {
      mon: '09:00-17:00',
      tue: '09:00-17:00',
      wed: '09:00-17:00',
      thu: '09:00-17:00',
      fri: '09:00-17:00',
      sat: '10:00-16:00',
      sun: '10:00-16:00',
    },
    cuisine: 'Test',
    theme: 'default',
    orderOnlineEnabled: true,
  };

  const mockMenuItem1: MenuItem = {
    id: 'item-1',
    name: 'Test Item 1',
    description: 'A test item',
    price: 10.99,
  };

  const mockMenuItem2: MenuItem = {
    id: 'item-2',
    name: 'Test Item 2',
    description: 'Another test item',
    price: 15.50,
  };

  const mockMenuItem3: MenuItem = {
    id: 'item-3',
    name: 'Test Item 3',
    description: 'Yet another test item',
    price: 8.75,
  };

  /**
   * Test component that renders the full UI flow
   */
  const TestApp = () => {
    return (
      <ToastProvider>
        <CartProvider>
          <RestaurantLayout config={mockRestaurantConfig}>
            <div>
              <MenuItemCard item={mockMenuItem1} />
              <MenuItemCard item={mockMenuItem2} />
              <MenuItemCard item={mockMenuItem3} />
            </div>
          </RestaurantLayout>
        </CartProvider>
      </ToastProvider>
    );
  };

  beforeEach(() => {
    // Clear any localStorage state between tests
    localStorage.clear();
  });

  it('should simulate full cart flow: add items via UI, adjust quantities, remove items, and complete checkout', async () => {
    render(<TestApp />);

    // Step 1: Add items to cart via UI (clicking "Add to Cart" buttons)
    const addButtons = screen.getAllByText('Add to Cart');
    expect(addButtons.length).toBeGreaterThanOrEqual(3);

    // Add first item
    fireEvent.click(addButtons[0]);
    await waitFor(() => {
      const orderButton = screen.getByRole('button', { name: /Cart \(1 items\)/i });
      expect(orderButton).toBeInTheDocument();
    });

    // Add second item
    fireEvent.click(addButtons[1]);
    await waitFor(() => {
      const orderButton = screen.getByRole('button', { name: /Cart \(2 items\)/i });
      expect(orderButton).toBeInTheDocument();
    });

    // Add third item
    fireEvent.click(addButtons[2]);
    await waitFor(() => {
      const orderButton = screen.getByRole('button', { name: /Cart \(3 items\)/i });
      expect(orderButton).toBeInTheDocument();
    });

    // Step 2: Open cart drawer by clicking the order button
    const orderButton = screen.getByRole('button', { name: /Cart \(3 items\)/i });
    fireEvent.click(orderButton);

    // Wait for cart drawer to open
    await waitFor(() => {
      expect(screen.getByText('Cart')).toBeInTheDocument();
      // Check items in cart drawer (use getAllByText since items appear in both menu and cart)
      const item1Elements = screen.getAllByText('Test Item 1');
      const item2Elements = screen.getAllByText('Test Item 2');
      const item3Elements = screen.getAllByText('Test Item 3');
      expect(item1Elements.length).toBeGreaterThan(0);
      expect(item2Elements.length).toBeGreaterThan(0);
      expect(item3Elements.length).toBeGreaterThan(0);
    });

    // Step 3: Adjust quantities via UI (clicking +/- buttons)
    // Find quantity increase buttons (they have aria-label with "Increase")
    const increaseButtons = screen.getAllByLabelText(/Increase/i);
    expect(increaseButtons.length).toBeGreaterThanOrEqual(3);

    // Increase quantity of first item
    fireEvent.click(increaseButtons[0]);
    await waitFor(() => {
      // Check that the quantity display shows 2 for the first item
      const quantityDisplays = screen.getAllByText(/× \d+/);
      expect(quantityDisplays.some(el => el.textContent?.includes('× 2'))).toBe(true);
    });

    // Step 4: Remove an item via UI (clicking remove button)
    // Find remove buttons (they have aria-label with "Remove")
    const removeButtons = screen.getAllByLabelText(/Remove/i);
    expect(removeButtons.length).toBeGreaterThanOrEqual(3);

    // Remove the third item
    fireEvent.click(removeButtons[2]);
    await waitFor(() => {
      // Verify item count decreased (cart drawer should still be open)
      // After removing Item 3, we have Item 1 (qty 2) + Item 2 (qty 1) = 3 items total
      const orderButtonAfterRemove = screen.queryByRole('button', { name: /Cart \(3 items\)/i });
      expect(orderButtonAfterRemove).toBeInTheDocument();
      // Cart drawer should still be open
      expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    // Step 5: Complete checkout
    // Click the "Checkout" button
    const checkoutButton = screen.getByText('Checkout');
    fireEvent.click(checkoutButton);

    // Wait for checkout form to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/Checkout form/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    });

    // Fill out the checkout form
    const nameInput = screen.getByLabelText(/Name/i);
    const phoneInput = screen.getByLabelText(/Phone/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });

    // Submit the form
    const submitButton = screen.getByLabelText(/Submit order/i);
    fireEvent.click(submitButton);

    // Step 6: Assert that order confirmation modal appears
    // Wait for the modal to appear - it should show "Order Confirmed!" text
    await waitFor(
      () => {
        const confirmedText = screen.getByText('Order Confirmed!');
        expect(confirmedText).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify order summary in confirmation modal
    await waitFor(() => {
      // Should show items that are still in cart (Item 1 with quantity 2, Item 2 with quantity 1)
      // Use getAllByText since items may appear in multiple places
      const item1Elements = screen.getAllByText(/Test Item 1/);
      const item2Elements = screen.getAllByText(/Test Item 2/);
      expect(item1Elements.length).toBeGreaterThan(0);
      expect(item2Elements.length).toBeGreaterThan(0);
      // Should show total (Item 1: 10.99 * 2 = 21.98, Item 2: 15.50 * 1 = 15.50, Total: 37.48)
      const totalElement = screen.getByText(/\$37\.48/);
      expect(totalElement).toBeInTheDocument();
    });

    // Step 7: Close the confirmation modal
    const closeButton = screen.getByLabelText(/Close order confirmation/i);
    fireEvent.click(closeButton);

    // Step 8: Assert that cart is cleared after confirmation
    await waitFor(() => {
      // Cart drawer should be closed or show empty cart
      // The order button should show 0 items (no badge)
      const orderButtonAfter = screen.getByRole('button', { name: /^Cart$/i });
      expect(orderButtonAfter).toBeInTheDocument();
    });
  });

  it('should handle cart clearing behavior correctly after order confirmation', async () => {
    render(<TestApp />);

    // Add items to cart
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);

    await waitFor(() => {
      const orderButton = screen.getByRole('button', { name: /Cart \(2 items\)/i });
      expect(orderButton).toBeInTheDocument();
    });

    // Open cart
    const orderButton = screen.getByRole('button', { name: /Cart \(2 items\)/i });
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    // Go to checkout
    const checkoutButton = screen.getByText('Checkout');
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Checkout form/i)).toBeInTheDocument();
    });

    // Fill and submit form
    const nameInput = screen.getByLabelText(/Name/i);
    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(phoneInput, { target: { value: '555-5678' } });

    const submitButton = screen.getByLabelText(/Submit order/i);
    fireEvent.click(submitButton);

    // Wait for confirmation modal
    await waitFor(() => {
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByLabelText(/Close order confirmation/i);
    fireEvent.click(closeButton);

    // Verify cart is cleared - try to open cart again
    await waitFor(() => {
      const orderButtonAfter = screen.getByRole('button', { name: /^Cart$/i });
      expect(orderButtonAfter).toBeInTheDocument();
    });

    // Open cart again to verify it's empty
    const orderButtonAfter = screen.getByRole('button', { name: /^Cart$/i });
    fireEvent.click(orderButtonAfter);

    await waitFor(() => {
      // Should show empty cart message
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });
});

