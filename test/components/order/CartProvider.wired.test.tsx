import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/components/order/CartProvider';

describe('CartProvider - Wired to useCart', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
  });
  it('should provide cart functionality through context', () => {
    const TestComponent = () => {
      const cart = useCartContext();
      
      return (
        <div>
          <div data-testid="item-count">{cart.itemCount}</div>
          <div data-testid="total">{cart.total}</div>
          <div data-testid="items-length">{cart.items.length}</div>
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
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should provide addItem method through context', async () => {
    const TestComponent = () => {
      const { addItem, items } = useCartContext();
      
      const handleAdd = () => {
        addItem({
          id: 'test-item',
          name: 'Test Item',
          price: 10.99,
        });
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">
            Add Item
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
    
    const addButton = screen.getByTestId('add-button');
    const itemsCount = screen.getByTestId('items-count');
    
    expect(itemsCount).toHaveTextContent('0');
    
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('1');
    });
  });

  it('should provide removeItem method through context', async () => {
    const TestComponent = () => {
      const { addItem, removeItem, items } = useCartContext();
      
      const handleAdd = () => {
        addItem({
          id: 'test-item',
          name: 'Test Item',
          price: 10.99,
        });
      };
      
      const handleRemove = () => {
        removeItem('test-item');
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">Add</button>
          <button onClick={handleRemove} data-testid="remove-button">Remove</button>
          <div data-testid="items-count">{items.length}</div>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const removeButton = screen.getByTestId('remove-button');
    const itemsCount = screen.getByTestId('items-count');
    
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('1');
    });
    
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('0');
    });
  });

  it('should provide updateQuantity method through context', async () => {
    const TestComponent = () => {
      const { addItem, updateQuantity, items } = useCartContext();
      
      const handleAdd = () => {
        addItem({
          id: 'test-item',
          name: 'Test Item',
          price: 10.99,
        });
      };
      
      const handleUpdate = () => {
        updateQuantity('test-item', 3);
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">Add</button>
          <button onClick={handleUpdate} data-testid="update-button">Update</button>
          <div data-testid="quantity">
            {items.find(i => i.id === 'test-item')?.quantity || 0}
          </div>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const updateButton = screen.getByTestId('update-button');
    const quantity = screen.getByTestId('quantity');
    
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(quantity).toHaveTextContent('1');
    });
    
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(quantity).toHaveTextContent('3');
    });
  });

  it('should provide clearCart method through context', async () => {
    const TestComponent = () => {
      const { addItem, clearCart, items } = useCartContext();
      
      const handleAdd = () => {
        addItem({ id: 'item1', name: 'Item 1', price: 10 });
        addItem({ id: 'item2', name: 'Item 2', price: 20 });
      };
      
      const handleClear = () => {
        clearCart();
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">Add</button>
          <button onClick={handleClear} data-testid="clear-button">Clear</button>
          <div data-testid="items-count">{items.length}</div>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const clearButton = screen.getByTestId('clear-button');
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

  it('should calculate total correctly', async () => {
    const TestComponent = () => {
      const { addItem, total } = useCartContext();
      
      const handleAdd = () => {
        addItem({ id: 'item1', name: 'Item 1', price: 10.50 });
        addItem({ id: 'item2', name: 'Item 2', price: 20.75 });
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">Add</button>
          <div data-testid="total">{total.toFixed(2)}</div>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const totalElement = screen.getByTestId('total');
    
    expect(totalElement).toHaveTextContent('0.00');
    
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(totalElement).toHaveTextContent('31.25');
    });
  });

  it('should calculate itemCount correctly', async () => {
    const TestComponent = () => {
      const { addItem, updateQuantity, itemCount } = useCartContext();
      
      const handleAdd = () => {
        addItem({ id: 'item1', name: 'Item 1', price: 10 });
        addItem({ id: 'item2', name: 'Item 2', price: 20 });
      };
      
      const handleUpdate = () => {
        updateQuantity('item1', 3);
      };
      
      return (
        <div>
          <button onClick={handleAdd} data-testid="add-button">Add</button>
          <button onClick={handleUpdate} data-testid="update-button">Update</button>
          <div data-testid="item-count">{itemCount}</div>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const updateButton = screen.getByTestId('update-button');
    const itemCountElement = screen.getByTestId('item-count');
    
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(itemCountElement).toHaveTextContent('2');
    });
    
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(itemCountElement).toHaveTextContent('4'); // item1: 3, item2: 1
    });
  });

  it('should share cart state across multiple components', async () => {
    const Component1 = () => {
      const { addItem } = useCartContext();
      
      return (
        <button
          onClick={() => addItem({ id: 'shared-item', name: 'Shared', price: 10 })}
          data-testid="add-button"
        >
          Add
        </button>
      );
    };
    
    const Component2 = () => {
      const { items } = useCartContext();
      
      return <div data-testid="items-count">{items.length}</div>;
    };
    
    render(
      <CartProvider>
        <Component1 />
        <Component2 />
      </CartProvider>
    );
    
    const addButton = screen.getByTestId('add-button');
    const itemsCount = screen.getByTestId('items-count');
    
    expect(itemsCount).toHaveTextContent('0');
    
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(itemsCount).toHaveTextContent('1');
    });
  });
});

