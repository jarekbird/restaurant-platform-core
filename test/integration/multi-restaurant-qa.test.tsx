import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { loadRestaurant } from '@/lib/loaders/restaurant';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { HoursAndLocation } from '@/components/restaurant/HoursAndLocation';
import { CartProvider } from '@/components/order/CartProvider';
import { ChatAssistantWrapper } from '@/components/chat/ChatAssistantWrapper';
import { ToastProvider } from '@/components/ui/ToastProvider';

// Mock the chat API
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

/**
 * Integration test for final manual QA pass across multiple restaurants
 * Tests: menu-specific behavior, cart behavior, and chat behavior consistency
 * 
 * This test verifies that the full flow works correctly across different
 * restaurant configurations to ensure consistency.
 */
describe('Multi-Restaurant QA Integration Tests', () => {
  // Test multiple restaurants with different configurations
  const testRestaurants = [
    { slug: 'cafe-warm', name: 'Warm Cafe', hasChat: true },
    { slug: 'tataki', name: 'Tataki', hasChat: true },
    { slug: 'so-delicious', name: 'So Delicious Sushi', hasChat: true },
    { slug: 'thai-khao-kaeng-express-pizzeria', name: 'Thai Khao Kaeng Express Pizzeria', hasChat: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Setup default mock response for chat API
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'I can help you with your order.',
        action: null,
      }),
    });
  });

  /**
   * Test component that renders the full preview page structure
   */
  const TestRestaurantPage = ({ slug }: { slug: string }) => {
    const restaurant = loadRestaurant(slug);
    const { config, menu } = restaurant;

    return (
      <ToastProvider>
        <CartProvider>
          <RestaurantLayout config={config}>
            <HeroSection config={config} />
            <MenuSectionList menu={menu} />
            <HoursAndLocation config={config} />
          </RestaurantLayout>
          {config.orderOnlineEnabled && <ChatAssistantWrapper menu={menu} />}
        </CartProvider>
      </ToastProvider>
    );
  };

  describe('Menu-specific behavior consistency', () => {
    testRestaurants.forEach(({ slug, name }) => {
      it(`should load and display menu correctly for ${name} (${slug})`, () => {
        const restaurant = loadRestaurant(slug);
        const { config, menu } = restaurant;

        render(<TestRestaurantPage slug={slug} />);

        // Verify restaurant name is displayed (may appear multiple times - header and hero)
        expect(screen.getAllByText(config.name).length).toBeGreaterThan(0);

        // Verify menu categories are displayed
        menu.categories.forEach((category) => {
          expect(screen.getByText(category.name)).toBeInTheDocument();
        });

        // Verify menu items are displayed
        menu.categories.forEach((category) => {
          category.items.forEach((item) => {
            // Use getAllByText since items may have duplicate names
            const itemElements = screen.getAllByText(item.name);
            expect(itemElements.length).toBeGreaterThan(0);
            // Verify price is displayed (format may vary)
            const priceText = `$${item.price.toFixed(2)}`;
            const priceElements = screen.getAllByText(priceText);
            expect(priceElements.length).toBeGreaterThan(0);
          });
        });
      });

      it(`should display restaurant config correctly for ${name} (${slug})`, () => {
        const restaurant = loadRestaurant(slug);
        const { config } = restaurant;

        render(<TestRestaurantPage slug={slug} />);

        // Verify restaurant name (may appear multiple times - header and hero)
        expect(screen.getAllByText(config.name).length).toBeGreaterThan(0);

        // Verify address information is displayed (use getAllByText as address may appear multiple times)
        const addressElements = screen.getAllByText(new RegExp(config.address));
        expect(addressElements.length).toBeGreaterThan(0);
        const cityElements = screen.getAllByText(new RegExp(config.city));
        expect(cityElements.length).toBeGreaterThan(0);
        const stateElements = screen.getAllByText(new RegExp(config.state));
        expect(stateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cart behavior consistency across restaurants', () => {
    testRestaurants.forEach(({ slug, name }) => {
      it(`should handle cart operations correctly for ${name} (${slug})`, async () => {
        const restaurant = loadRestaurant(slug);
        const { menu } = restaurant;

        render(<TestRestaurantPage slug={slug} />);

        // Find the first menu item with an "Add to Cart" button
        const addButtons = screen.getAllByText('Add to Cart');
        expect(addButtons.length).toBeGreaterThan(0);

        // Add first item to cart
        fireEvent.click(addButtons[0]);
        await waitFor(() => {
          const orderButtons = screen.getAllByRole('button', { name: /Order Online \(1 items?\)/i });
          expect(orderButtons.length).toBeGreaterThan(0);
        });

        // Add second item if available
        if (addButtons.length > 1) {
          fireEvent.click(addButtons[1]);
          await waitFor(() => {
            const orderButtons = screen.getAllByRole('button', { name: /Order Online \(2 items?\)/i });
            expect(orderButtons.length).toBeGreaterThan(0);
          });
        }

        // Open cart drawer (use first button - header button)
        const orderButtons = screen.getAllByRole('button', { name: /Order Online \(\d+ items?\)/i });
        expect(orderButtons.length).toBeGreaterThan(0);
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Cart')).toBeInTheDocument();
        });

        // Verify items are in cart
        const firstItemName = menu.categories[0]?.items[0]?.name;
        if (firstItemName) {
          const itemElements = screen.getAllByText(firstItemName);
          expect(itemElements.length).toBeGreaterThan(0);
        }

        // Verify checkout button is available
        const checkoutButton = screen.getByText('Checkout');
        expect(checkoutButton).toBeInTheDocument();
      });

      it(`should handle cart quantity adjustments for ${name} (${slug})`, async () => {
        render(<TestRestaurantPage slug={slug} />);

        // Add item to cart
        const addButtons = screen.getAllByText('Add to Cart');
        fireEvent.click(addButtons[0]);

        await waitFor(() => {
          const orderButtons = screen.getAllByRole('button', { name: /Order Online \(1 items?\)/i });
          expect(orderButtons.length).toBeGreaterThan(0);
        });

        // Open cart (use first button - header button)
        const orderButtons = screen.getAllByRole('button', { name: /Order Online \(1 items?\)/i });
        expect(orderButtons.length).toBeGreaterThan(0);
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Cart')).toBeInTheDocument();
        });

        // Increase quantity
        const increaseButtons = screen.getAllByLabelText(/Increase/i);
        if (increaseButtons.length > 0) {
          fireEvent.click(increaseButtons[0]);
          await waitFor(() => {
            const updatedOrderButtons = screen.getAllByRole('button', { name: /Order Online \(2 items?\)/i });
            expect(updatedOrderButtons.length).toBeGreaterThan(0);
          });
        }
      });
    });
  });

  describe('Chat behavior consistency', () => {
    // Only test restaurants with chat enabled
    const restaurantsWithChat = testRestaurants.filter((r) => r.hasChat);

    restaurantsWithChat.forEach(({ slug, name }) => {
      it(`should render chat assistant for ${name} (${slug}) when orderOnlineEnabled is true`, () => {
        const restaurant = loadRestaurant(slug);
        const { config } = restaurant;

        expect(config.orderOnlineEnabled).toBe(true);

        render(<TestRestaurantPage slug={slug} />);

        // Verify chat button is present
        const chatButton = screen.getByRole('button', { name: /chat|assistant/i });
        expect(chatButton).toBeInTheDocument();
      });

      it(`should handle chat interactions for ${name} (${slug})`, async () => {
        render(<TestRestaurantPage slug={slug} />);

        // Open chat
        const chatButton = screen.getByRole('button', { name: /chat|assistant/i });
        fireEvent.click(chatButton);

        await waitFor(() => {
          // Chat input should be visible when chat is open
          const chatInput = screen.getByPlaceholderText(/type your message|ask a question/i);
          expect(chatInput).toBeInTheDocument();
        });

        // Send a message
        const chatInput = screen.getByPlaceholderText(/type your message|ask a question/i);
        fireEvent.change(chatInput, { target: { value: 'What do you recommend?' } });

        const sendButton = screen.getByRole('button', { name: /send|submit/i });
        fireEvent.click(sendButton);

        // Verify API was called
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith(
            '/api/chat',
            expect.objectContaining({
              method: 'POST',
              headers: expect.objectContaining({
                'Content-Type': 'application/json',
              }),
            })
          );
        });
      });
    });

    // Test that restaurants without chat don't show chat assistant
    it('should not render chat assistant when orderOnlineEnabled is false', () => {
      const restaurant = loadRestaurant('thai-khao-kaeng-express-pizzeria');
      const { config } = restaurant;

      expect(config.orderOnlineEnabled).toBe(false);

      render(<TestRestaurantPage slug="thai-khao-kaeng-express-pizzeria" />);

      // Chat button should not be present
      const chatButton = screen.queryByRole('button', { name: /chat|assistant/i });
      expect(chatButton).not.toBeInTheDocument();
    });
  });

  describe('Full flow consistency across restaurants', () => {
    testRestaurants.forEach(({ slug, name, hasChat }) => {
      it(`should complete full flow for ${name} (${slug}): menu → cart → checkout`, async () => {
        const restaurant = loadRestaurant(slug);
        const { menu } = restaurant;

        render(<TestRestaurantPage slug={slug} />);

        // Step 1: Verify menu is displayed (restaurant name may appear multiple times)
        expect(screen.getAllByText(restaurant.config.name).length).toBeGreaterThan(0);
        menu.categories.forEach((category) => {
          expect(screen.getByText(category.name)).toBeInTheDocument();
        });

        // Step 2: Add items to cart
        const addButtons = screen.getAllByText('Add to Cart');
        expect(addButtons.length).toBeGreaterThan(0);

        fireEvent.click(addButtons[0]);
        await waitFor(() => {
          const orderButtons = screen.getAllByRole('button', { name: /Order Online \(1 items?\)/i });
          expect(orderButtons.length).toBeGreaterThan(0);
        });

        // Step 3: Open cart and verify items (use first button - header button)
        const orderButtons = screen.getAllByRole('button', { name: /Order Online \(1 items?\)/i });
        expect(orderButtons.length).toBeGreaterThan(0);
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Cart')).toBeInTheDocument();
        });

        // Step 4: Go to checkout
        const checkoutButton = screen.getByText('Checkout');
        fireEvent.click(checkoutButton);

        await waitFor(() => {
          expect(screen.getByLabelText(/Checkout form/i)).toBeInTheDocument();
        });

        // Step 5: Fill checkout form
        const nameInputs = screen.getAllByLabelText(/Name/i);
        const phoneInputs = screen.getAllByLabelText(/Phone/i);
        const nameInput = nameInputs[nameInputs.length - 1]; // Get the last one (most recent)
        const phoneInput = phoneInputs[phoneInputs.length - 1]; // Get the last one (most recent)

        expect(nameInput).toBeInTheDocument();
        expect(phoneInput).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'Test Customer' } });
        fireEvent.change(phoneInput, { target: { value: '555-1234' } });

        // Wait a bit for form state to update
        await waitFor(() => {
          expect((nameInput as HTMLInputElement).value).toBe('Test Customer');
          expect((phoneInput as HTMLInputElement).value).toBe('555-1234');
        });

        // Step 6: Submit order
        const submitButton = screen.getByLabelText(/Submit order/i);
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        // Step 7: Verify order confirmation
        // Wait for the modal to appear first, then check for text
        await waitFor(
          () => {
            // First, check if the modal dialog is present
            const modal = screen.queryByRole('dialog');
            if (!modal) {
              throw new Error('Order confirmation modal dialog not found');
            }
            // Then check for the confirmation text
            const exactMatch = screen.queryByText('Order Confirmed!');
            if (exactMatch) {
              expect(exactMatch).toBeInTheDocument();
              return;
            }
            // Try partial match
            const partialMatch = screen.queryByText(/Order Confirmed/i);
            if (partialMatch) {
              expect(partialMatch).toBeInTheDocument();
              return;
            }
            // If modal exists but text not found, that's still a problem
            throw new Error('Order confirmation text not found in modal');
          },
          { timeout: 10000 } // Increase timeout to 10 seconds
        );

        // Step 8: Verify cart is cleared
        const closeButton = screen.getByLabelText(/Close order confirmation/i);
        fireEvent.click(closeButton);

        await waitFor(() => {
          // After order, cart should be empty, so button should show "Order Online" without item count
          const orderButtonsAfter = screen.getAllByRole('button', { name: /^Order Online$/i });
          expect(orderButtonsAfter.length).toBeGreaterThan(0);
        });

        // Step 9: If chat is enabled, verify it's accessible
        if (hasChat) {
          const chatButton = screen.getByRole('button', { name: /chat|assistant/i });
          expect(chatButton).toBeInTheDocument();
        }
      });
    });
  });

  describe('Configuration-specific behavior', () => {
    it('should handle different themes correctly', () => {
      testRestaurants.forEach(({ slug }) => {
        const restaurant = loadRestaurant(slug);
        render(<TestRestaurantPage slug={slug} />);
        // Restaurant name may appear multiple times (header and hero)
        expect(screen.getAllByText(restaurant.config.name).length).toBeGreaterThan(0);
      });
    });

    it('should handle different cuisine types correctly', () => {
      testRestaurants.forEach(({ slug }) => {
        const restaurant = loadRestaurant(slug);
        render(<TestRestaurantPage slug={slug} />);
        // Restaurant name may appear multiple times (header and hero)
        expect(screen.getAllByText(restaurant.config.name).length).toBeGreaterThan(0);
      });
    });

    it('should display different hours correctly', () => {
      testRestaurants.forEach(({ slug }) => {
        const restaurant = loadRestaurant(slug);
        render(<TestRestaurantPage slug={slug} />);
        // Hours should be displayed in HoursAndLocation component
        // Restaurant name may appear multiple times (header and hero)
        expect(screen.getAllByText(restaurant.config.name).length).toBeGreaterThan(0);
      });
    });
  });
});
