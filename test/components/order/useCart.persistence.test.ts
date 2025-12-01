import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/components/order/useCart';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useCart - Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load cart from localStorage on mount', async () => {
    const savedCart = [
      {
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
        quantity: 2,
      },
    ];
    localStorage.setItem('restaurant-cart', JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Cart should be loaded from storage
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      id: 'item-1',
      name: 'Test Item',
      price: 10.99,
      quantity: 2,
    });
  });

  it('should save cart to localStorage when items change', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
      });
    });

    // Wait for effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const stored = localStorage.getItem('restaurant-cart');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toMatchObject({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
        quantity: 1,
      });
    }
  });

  it('should clear localStorage when cart is cleared', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.clearCart();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const stored = localStorage.getItem('restaurant-cart');
    // After clearCart, the effect may save an empty array, or the key may be removed
    // Either is acceptable - the important thing is the cart is empty
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed).toEqual([]);
    } else {
      // Key was removed, which is also fine
      expect(stored).toBeNull();
    }
    // Verify cart is empty
    expect(result.current.items).toEqual([]);
  });

  it('should handle corrupted localStorage data gracefully', async () => {
    localStorage.setItem('restaurant-cart', 'invalid json');

    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should start with empty cart when localStorage is corrupted
    expect(result.current.items).toEqual([]);
  });

  it('should handle localStorage quota exceeded error gracefully', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Mock localStorage.setItem to throw quota exceeded error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    };

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
      });
    });

    // Should not crash, cart should still work
    expect(result.current.items).toHaveLength(1);

    // Restore original setItem
    localStorage.setItem = originalSetItem;
  });

  it('should persist cart state across multiple operations', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Item 1',
        price: 10.99,
      });
      result.current.addItem({
        id: 'item-2',
        name: 'Item 2',
        price: 15.99,
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify localStorage has the items
    const stored = localStorage.getItem('restaurant-cart');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(2);
    }

    // Update quantity
    act(() => {
      result.current.updateQuantity('item-1', 3);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify updated state is persisted
    const storedAfterUpdate = localStorage.getItem('restaurant-cart');
    if (storedAfterUpdate) {
      const parsed = JSON.parse(storedAfterUpdate) as Array<{ id: string; quantity: number }>;
      const item1 = parsed.find((item) => item.id === 'item-1');
      expect(item1?.quantity).toBe(3);
    }
  });
});

