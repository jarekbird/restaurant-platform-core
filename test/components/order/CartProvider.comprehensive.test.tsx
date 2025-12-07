import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/components/order/CartProvider';

describe('CartProvider - Comprehensive Tests', () => {
  it('should provide cart context to children', () => {
    const TestComponent = () => {
      const cart = useCartContext();
      
      return (
        <div>
          <div data-testid="item-count">{cart.itemCount}</div>
          <div data-testid="total">{cart.total}</div>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = console.error;
    console.error = () => {};

    const TestComponent = () => {
      useCartContext();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCartContext must be used within CartProvider');

    console.error = consoleError;
  });

  it('should provide all cart methods', () => {
    const TestComponent = () => {
      const cart = useCartContext();
      
      return (
        <div>
          <button
            onClick={() => cart.addItem({ id: 'item-1', name: 'Item', price: 10 })}
            data-testid="add"
          >
            Add
          </button>
          <button
            onClick={() => cart.removeItem('item-1')}
            data-testid="remove"
          >
            Remove
          </button>
          <button
            onClick={() => cart.updateQuantity('item-1', 2)}
            data-testid="update"
          >
            Update
          </button>
          <button
            onClick={() => cart.clearCart()}
            data-testid="clear"
          >
            Clear
          </button>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('add')).toBeInTheDocument();
    expect(screen.getByTestId('remove')).toBeInTheDocument();
    expect(screen.getByTestId('update')).toBeInTheDocument();
    expect(screen.getByTestId('clear')).toBeInTheDocument();
  });
});














