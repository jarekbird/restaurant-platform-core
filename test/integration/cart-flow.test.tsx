import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCartContext } from '@/components/order/CartProvider';

/**
 * Integration test for full cart flow
 * Tests: add items → adjust quantities → remove items → clear cart
 */
describe('Full Cart Flow Integration', () => {

  it('should add items to cart and update count', async () => {
    const TestComponent = () => {
      const { addItem, itemCount } = useCartContext();
      
      return (
        <div>
          <button
            onClick={() => addItem({ id: 'item-1', name: 'Item 1', price: 10 })}
            data-testid="add-item-1"
          >
            Add Item 1
          </button>
          <button
            onClick={() => addItem({ id: 'item-2', name: 'Item 2', price: 20 })}
            data-testid="add-item-2"
          >
            Add Item 2
          </button>
          <div data-testid="item-count">{itemCount}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton1 = screen.getByTestId('add-item-1');
    const addButton2 = screen.getByTestId('add-item-2');
    const itemCount = screen.getByTestId('item-count');

    expect(itemCount).toHaveTextContent('0');

    fireEvent.click(addButton1);
    await waitFor(() => {
      expect(itemCount).toHaveTextContent('1');
    });

    fireEvent.click(addButton2);
    await waitFor(() => {
      expect(itemCount).toHaveTextContent('2');
    });
  });

  it('should adjust quantities and update total', async () => {
    const TestComponent = () => {
      const { addItem, updateQuantity, total } = useCartContext();
      
      return (
        <div>
          <button
            onClick={() => addItem({ id: 'item-1', name: 'Item 1', price: 10 })}
            data-testid="add-item"
          >
            Add
          </button>
          <button
            onClick={() => updateQuantity('item-1', 3)}
            data-testid="update-quantity"
          >
            Update to 3
          </button>
          <div data-testid="total">{total.toFixed(2)}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-item');
    const updateButton = screen.getByTestId('update-quantity');
    const totalElement = screen.getByTestId('total');

    fireEvent.click(addButton);
    await waitFor(() => {
      expect(totalElement).toHaveTextContent('10.00');
    });

    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(totalElement).toHaveTextContent('30.00');
    });
  });

  it('should remove items and update count', async () => {
    const TestComponent = () => {
      const { addItem, removeItem, itemCount } = useCartContext();
      
      return (
        <div>
          <button
            onClick={() => {
              addItem({ id: 'item-1', name: 'Item 1', price: 10 });
              addItem({ id: 'item-2', name: 'Item 2', price: 20 });
            }}
            data-testid="add-items"
          >
            Add Items
          </button>
          <button
            onClick={() => removeItem('item-1')}
            data-testid="remove-item"
          >
            Remove Item 1
          </button>
          <div data-testid="item-count">{itemCount}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-items');
    const removeButton = screen.getByTestId('remove-item');
    const itemCount = screen.getByTestId('item-count');

    fireEvent.click(addButton);
    await waitFor(() => {
      expect(itemCount).toHaveTextContent('2');
    });

    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(itemCount).toHaveTextContent('1');
    });
  });

  it('should clear cart after checkout', async () => {
    const TestComponent = () => {
      const { addItem, clearCart, items } = useCartContext();
      
      return (
        <div>
          <button
            onClick={() => {
              addItem({ id: 'item-1', name: 'Item 1', price: 10 });
              addItem({ id: 'item-2', name: 'Item 2', price: 20 });
            }}
            data-testid="add-items"
          >
            Add Items
          </button>
          <button
            onClick={() => clearCart()}
            data-testid="clear-cart"
          >
            Clear Cart
          </button>
          <div data-testid="items-count">{items.length}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-items');
    const clearButton = screen.getByTestId('clear-cart');
    const itemsCount = screen.getByTestId('items-count');

    fireEvent.click(addButton);
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('2');
    });

    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('0');
    });
  });
});

