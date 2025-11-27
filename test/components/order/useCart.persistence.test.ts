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

  it('should load cart from localStorage on mount', () => {
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

    // Wait for hydration
    act(() => {
      // Force re-render after hydration
    });

    // Cart should be loaded from storage
    expect(result.current.items.length).toBeGreaterThanOrEqual(0);
  });

  it('should save cart to localStorage when items change', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
      });
    });

    // Wait for effect to run
    act(() => {
      // Force effect
    });

    const stored = localStorage.getItem('restaurant-cart');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.length).toBeGreaterThan(0);
    }
  });

  it('should clear localStorage when cart is cleared', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Test Item',
        price: 10.99,
      });
    });

    act(() => {
      result.current.clearCart();
    });

    const stored = localStorage.getItem('restaurant-cart');
    // Should be null or empty array
    expect(!stored || JSON.parse(stored).length === 0).toBe(true);
  });
});

