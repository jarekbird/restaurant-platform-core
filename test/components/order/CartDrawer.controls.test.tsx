/**
 * Tests for CartDrawer remove and quantity controls
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '@/components/order/CartDrawer';

describe('CartDrawer - Remove and Quantity Controls', () => {
  const mockItems = [
    { id: '1', name: 'Pizza', price: 15.99, quantity: 2 },
    { id: '2', name: 'Pasta', price: 14.99, quantity: 1 },
  ];

  describe('Quantity Controls', () => {
    it('should render quantity controls when onUpdateQuantity is provided', () => {
      const handleUpdateQuantity = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      );

      // Check for decrease buttons
      const decreaseButtons = screen.getAllByLabelText(/Decrease .+ quantity/i);
      expect(decreaseButtons).toHaveLength(2);
      
      // Check for increase buttons
      const increaseButtons = screen.getAllByLabelText(/Increase .+ quantity/i);
      expect(increaseButtons).toHaveLength(2);
      
      // Check for quantity display
      expect(screen.getByText('2')).toBeInTheDocument(); // Pizza quantity
      expect(screen.getByText('1')).toBeInTheDocument(); // Pasta quantity
    });

    it('should not render quantity controls when onUpdateQuantity is not provided', () => {
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
        />
      );

      const decreaseButtons = screen.queryAllByLabelText(/Decrease .+ quantity/i);
      expect(decreaseButtons).toHaveLength(0);
      
      const increaseButtons = screen.queryAllByLabelText(/Increase .+ quantity/i);
      expect(increaseButtons).toHaveLength(0);
    });

    it('should call onUpdateQuantity with decreased quantity when decrease button is clicked', () => {
      const handleUpdateQuantity = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      );

      const decreaseButtons = screen.getAllByLabelText(/Decrease .+ quantity/i);
      fireEvent.click(decreaseButtons[0]); // Click decrease for first item (Pizza)

      expect(handleUpdateQuantity).toHaveBeenCalledTimes(1);
      expect(handleUpdateQuantity).toHaveBeenCalledWith('1', 1); // Pizza id, quantity 2 -> 1
    });

    it('should call onUpdateQuantity with increased quantity when increase button is clicked', () => {
      const handleUpdateQuantity = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      );

      const increaseButtons = screen.getAllByLabelText(/Increase .+ quantity/i);
      fireEvent.click(increaseButtons[0]); // Click increase for first item (Pizza)

      expect(handleUpdateQuantity).toHaveBeenCalledTimes(1);
      expect(handleUpdateQuantity).toHaveBeenCalledWith('1', 3); // Pizza id, quantity 2 -> 3
    });

    it('should update total when quantity changes', () => {
      const handleUpdateQuantity = vi.fn();
      const { rerender } = render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      );

      // Initial total: (15.99 * 2) + (14.99 * 1) = 46.97
      expect(screen.getByText('$46.97')).toBeInTheDocument();

      // Update quantity for Pizza from 2 to 3
      const updatedItems = [
        { id: '1', name: 'Pizza', price: 15.99, quantity: 3 },
        { id: '2', name: 'Pasta', price: 14.99, quantity: 1 },
      ];

      rerender(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={updatedItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      );

      // New total: (15.99 * 3) + (14.99 * 1) = 62.96
      expect(screen.getByText('$62.96')).toBeInTheDocument();
    });

    it('should display correct quantity for each item', () => {
      const itemsWithDifferentQuantities = [
        { id: '1', name: 'Pizza', price: 15.99, quantity: 5 },
        { id: '2', name: 'Pasta', price: 14.99, quantity: 3 },
      ];

      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={itemsWithDifferentQuantities}
          onUpdateQuantity={() => {}}
        />
      );

      // Check that quantities are displayed correctly
      const quantityDisplays = screen.getAllByText(/^[0-9]+$/);
      expect(quantityDisplays.some(el => el.textContent === '5')).toBe(true);
      expect(quantityDisplays.some(el => el.textContent === '3')).toBe(true);
    });
  });

  describe('Remove Controls', () => {
    it('should render remove button when onRemoveItem is provided', () => {
      const handleRemoveItem = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onRemoveItem={handleRemoveItem}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove .+ from cart/i);
      expect(removeButtons).toHaveLength(2);
    });

    it('should not render remove button when onRemoveItem is not provided', () => {
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
        />
      );

      const removeButtons = screen.queryAllByLabelText(/Remove .+ from cart/i);
      expect(removeButtons).toHaveLength(0);
    });

    it('should call onRemoveItem with correct item id when remove button is clicked', () => {
      const handleRemoveItem = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onRemoveItem={handleRemoveItem}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove .+ from cart/i);
      fireEvent.click(removeButtons[0]); // Click remove for first item (Pizza)

      expect(handleRemoveItem).toHaveBeenCalledTimes(1);
      expect(handleRemoveItem).toHaveBeenCalledWith('1');
    });

    it('should call onRemoveItem with correct item id for different items', () => {
      const handleRemoveItem = vi.fn();
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onRemoveItem={handleRemoveItem}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove .+ from cart/i);
      fireEvent.click(removeButtons[1]); // Click remove for second item (Pasta)

      expect(handleRemoveItem).toHaveBeenCalledTimes(1);
      expect(handleRemoveItem).toHaveBeenCalledWith('2');
    });
  });

  describe('Combined Controls', () => {
    it('should render both quantity and remove controls when both handlers are provided', () => {
      const handleUpdateQuantity = vi.fn();
      const handleRemoveItem = vi.fn();
      
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      );

      const decreaseButtons = screen.getAllByLabelText(/Decrease .+ quantity/i);
      const increaseButtons = screen.getAllByLabelText(/Increase .+ quantity/i);
      const removeButtons = screen.getAllByLabelText(/Remove .+ from cart/i);

      expect(decreaseButtons.length).toBeGreaterThan(0);
      expect(increaseButtons.length).toBeGreaterThan(0);
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('should work correctly when both controls are used together', () => {
      const handleUpdateQuantity = vi.fn();
      const handleRemoveItem = vi.fn();
      
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      );

      // First increase quantity
      const increaseButtons = screen.getAllByLabelText(/Increase .+ quantity/i);
      fireEvent.click(increaseButtons[0]);
      expect(handleUpdateQuantity).toHaveBeenCalledWith('1', 3);

      // Then remove item
      const removeButtons = screen.getAllByLabelText(/Remove .+ from cart/i);
      fireEvent.click(removeButtons[1]);
      expect(handleRemoveItem).toHaveBeenCalledWith('2');

      expect(handleUpdateQuantity).toHaveBeenCalledTimes(1);
      expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Item Rendering with Controls', () => {
    it('should render item details correctly with controls', () => {
      render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={() => {}}
          onRemoveItem={() => {}}
        />
      );

      // Check item names
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Pasta')).toBeInTheDocument();

      // Check item prices
      expect(screen.getByText('$15.99 × 2')).toBeInTheDocument();
      expect(screen.getByText('$14.99 × 1')).toBeInTheDocument();

      // Check item totals
      expect(screen.getByText('$31.98')).toBeInTheDocument(); // Pizza: 15.99 * 2
      expect(screen.getByText('$14.99')).toBeInTheDocument(); // Pasta: 14.99 * 1
    });

    it('should display correct item totals when quantity changes', () => {
      const { rerender } = render(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={mockItems}
          onUpdateQuantity={() => {}}
          onRemoveItem={() => {}}
        />
      );

      // Initial: Pizza 2 * 15.99 = 31.98
      expect(screen.getByText('$31.98')).toBeInTheDocument();

      // Update quantity
      const updatedItems = [
        { id: '1', name: 'Pizza', price: 15.99, quantity: 4 },
        { id: '2', name: 'Pasta', price: 14.99, quantity: 1 },
      ];

      rerender(
        <CartDrawer
          isOpen={true}
          onClose={() => {}}
          items={updatedItems}
          onUpdateQuantity={() => {}}
          onRemoveItem={() => {}}
        />
      );

      // Updated: Pizza 4 * 15.99 = 63.96
      expect(screen.getByText('$63.96')).toBeInTheDocument();
    });
  });
});
