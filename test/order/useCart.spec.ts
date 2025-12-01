/**
 * Tests for useCart hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Pizza');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.total).toBe(15.99);
    expect(result.current.itemCount).toBe(1);
  });

  it('should increment quantity when adding same item', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await waitFor(() => {
      expect(result.current.items).toEqual([]);
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(31.98);
    expect(result.current.itemCount).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.removeItem('item-1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.updateQuantity('item-1', 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.total).toBe(47.97);
    expect(result.current.itemCount).toBe(3);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.updateQuantity('item-1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear all items from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.addItem({
        id: 'item-2',
        name: 'Pasta',
        price: 14.99,
      });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should calculate total correctly for multiple items', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
      });
    });

    act(() => {
      result.current.addItem({
        id: 'item-2',
        name: 'Pasta',
        price: 14.99,
      });
    });

    act(() => {
      result.current.updateQuantity('item-1', 2);
    });

    expect(result.current.total).toBe(46.97); // (15.99 * 2) + 14.99
    expect(result.current.itemCount).toBe(3);
  });

  it('should handle items with modifiers separately', async () => {
    const { result } = renderHook(() => useCart());

    // Wait for hydration to complete
    await waitFor(() => {
      expect(result.current.items).toEqual([]);
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
        modifiers: [
          {
            groupName: 'Size',
            selectedOptions: ['Large'],
          },
        ],
      });
    });

    act(() => {
      result.current.addItem({
        id: 'item-1',
        name: 'Pizza',
        price: 15.99,
        modifiers: [
          {
            groupName: 'Size',
            selectedOptions: ['Small'],
          },
        ],
      });
    });

    // Should be two separate items due to different modifiers
    expect(result.current.items).toHaveLength(2);
  });
});

