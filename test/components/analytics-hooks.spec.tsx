/**
 * Analytics Hooks Tests (Task 7.21)
 * 
 * Verifies that analytics events are correctly fired from component interactions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { CartProvider } from '@/components/order/CartProvider';
import { CartDrawer } from '@/components/order/CartDrawer';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { VipSignupBanner } from '@/components/restaurant/VipSignupBanner';
import { VipSignupSection } from '@/components/restaurant/VipSignupSection';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { MenuItem, Menu } from '@/lib/schemas/menu';
import * as analytics from '@/lib/analytics/events';

// Mock analytics module
vi.mock('@/lib/analytics/events', () => ({
  trackViewRestaurant: vi.fn(),
  trackViewMenuCategory: vi.fn(),
  trackAddToCart: vi.fn(),
  trackStartCheckout: vi.fn(),
  trackCompleteOrder: vi.fn(),
  trackJoinVip: vi.fn(),
}));

describe('Analytics Hooks in Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('MenuItemCard - trackAddToCart', () => {
    const mockItem: MenuItem = {
      id: 'item-1',
      name: 'Test Pizza',
      price: 12.99,
      description: 'A delicious test pizza',
    };

    it('should call trackAddToCart when Add to Cart button is clicked', () => {
      render(
        <CartProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <MenuItemCard item={mockItem} />
          </RestaurantThemeProvider>
        </CartProvider>
      );

      const addButton = screen.getByRole('button', { name: /Add Test Pizza to cart/i });
      fireEvent.click(addButton);

      expect(analytics.trackAddToCart).toHaveBeenCalledTimes(1);
      expect(analytics.trackAddToCart).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('VipSignupBanner - trackJoinVip', () => {
    it('should call trackJoinVip when form is submitted with email and phone', async () => {
      render(
        <ToastProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <VipSignupBanner />
          </RestaurantThemeProvider>
        </ToastProvider>
      );

      const emailInput = screen.getByPlaceholderText('Email address');
      const phoneInput = screen.getByPlaceholderText('Phone number');
      const submitButton = screen.getByText('Sign Up');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '555-123-4567' } }); // Need at least 10 digits
      fireEvent.click(submitButton);

      // Wait for async form submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(analytics.trackJoinVip).toHaveBeenCalledTimes(1);
      expect(analytics.trackJoinVip).toHaveBeenCalledWith({
        email: 'test@example.com',
        phone: '555-123-4567',
      });
    });

    it('should call trackJoinVip when form is submitted with email only', async () => {
      render(
        <ToastProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <VipSignupBanner />
          </RestaurantThemeProvider>
        </ToastProvider>
      );

      const emailInput = screen.getByPlaceholderText('Email address');
      const submitButton = screen.getByText('Sign Up');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      // Leave phone empty
      fireEvent.click(submitButton);

      // Wait for async form submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(analytics.trackJoinVip).toHaveBeenCalledTimes(1);
      // When phone is empty, VipSignupBanner passes undefined
      expect(analytics.trackJoinVip).toHaveBeenCalledWith({
        email: 'test@example.com',
        phone: undefined,
      });
    });
  });

  describe('VipSignupSection - trackJoinVip', () => {
    it('should call trackJoinVip when form is submitted', async () => {
      render(
        <ToastProvider>
          <RestaurantThemeProvider themeKey="warm-pizza">
            <VipSignupSection />
          </RestaurantThemeProvider>
        </ToastProvider>
      );

      const emailInput = screen.getByPlaceholderText('Email address');
      const phoneInput = screen.getByPlaceholderText('Phone number');
      const submitButton = screen.getByText('Sign Up');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '555-123-4567' } }); // Need at least 10 digits
      fireEvent.click(submitButton);

      // Wait for async form submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(analytics.trackJoinVip).toHaveBeenCalledTimes(1);
      expect(analytics.trackJoinVip).toHaveBeenCalledWith({
        email: 'test@example.com',
        phone: '555-123-4567',
      });
    });
  });

  describe('MenuSectionList - trackViewMenuCategory', () => {
    it('should call trackViewMenuCategory for each category on mount', () => {
      const mockMenu: Menu = {
        id: 'test-menu',
        name: 'Test Menu',
        currency: 'USD',
        categories: [
          {
            id: 'appetizers',
            name: 'Appetizers',
            items: [],
          },
          {
            id: 'mains',
            name: 'Main Courses',
            items: [],
          },
        ],
      };

      render(
        <RestaurantThemeProvider themeKey="warm-pizza">
          <MenuSectionList menu={mockMenu} />
        </RestaurantThemeProvider>
      );

      expect(analytics.trackViewMenuCategory).toHaveBeenCalledTimes(2);
      expect(analytics.trackViewMenuCategory).toHaveBeenCalledWith('Appetizers');
      expect(analytics.trackViewMenuCategory).toHaveBeenCalledWith('Main Courses');
    });
  });

  describe('CartDrawer - trackStartCheckout and trackCompleteOrder', () => {
    const mockItems = [
      { id: 'item-1', name: 'Pizza', price: 12.99, quantity: 1 },
      { id: 'item-2', name: 'Salad', price: 8.99, quantity: 2 },
    ];

    it('should call trackStartCheckout when Checkout button is clicked', () => {
      const mockOnClose = vi.fn();
      const mockOnPlaceOrder = vi.fn();

      render(
        <ToastProvider>
          <CartDrawer
            isOpen={true}
            onClose={mockOnClose}
            items={mockItems}
            onPlaceOrder={mockOnPlaceOrder}
          />
        </ToastProvider>
      );

      const checkoutButton = screen.getByRole('button', { name: /Checkout/i });
      fireEvent.click(checkoutButton);

      expect(analytics.trackStartCheckout).toHaveBeenCalledTimes(1);
    });

    it('should call trackCompleteOrder when order is placed', async () => {
      const mockOnClose = vi.fn();
      const mockOnPlaceOrder = vi.fn();

      render(
        <ToastProvider>
          <CartDrawer
            isOpen={true}
            onClose={mockOnClose}
            items={mockItems}
            onPlaceOrder={mockOnPlaceOrder}
          />
        </ToastProvider>
      );

      // Click Checkout to show form
      const checkoutButton = screen.getByRole('button', { name: /Checkout/i });
      fireEvent.click(checkoutButton);

      // Fill out form - CheckoutForm uses labels, not placeholders
      const nameInput = screen.getByLabelText(/name/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '555-123-4567' } });
      fireEvent.click(submitButton);

      // Wait for async order completion
      await waitFor(() => {
        expect(analytics.trackCompleteOrder).toHaveBeenCalledTimes(1);
      });

      const orderCall = (analytics.trackCompleteOrder as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(orderCall.items).toEqual(mockItems);
      expect(orderCall.customer.name).toBe('John Doe');
      expect(orderCall.customer.phone).toBe('555-123-4567');
    });
  });
});

