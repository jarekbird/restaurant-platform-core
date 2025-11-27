'use client';

import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: Array<{
    groupName: string;
    selectedOptions: string[];
  }>;
}

interface UseCartReturn {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'restaurant-cart';

/**
 * Load cart from localStorage
 * Only runs on client side to avoid hydration mismatches
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  
  return [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

/**
 * useCart hook
 * Manages cart state with add, remove, update quantity, and clear operations
 * Persists cart state to localStorage
 * 
 * NOTE: Always starts with empty cart to avoid hydration mismatches.
 * Cart is hydrated from localStorage after mount (client-side only).
 * This is a necessary pattern for syncing with localStorage in Next.js.
 */
export function useCart(): UseCartReturn {
  // Always start with empty array to ensure server/client match
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Hydrate cart from localStorage after mount (client-side only)
  // This ensures server and client initial render match (both start with empty cart)
  // This is a necessary pattern for syncing with localStorage - the lint rule
  // is too strict for this valid use case
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = loadCartFromStorage();
      if (storedItems.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(storedItems);
      }
      setIsHydrated(true);
    }
  }, []); // Intentionally empty deps - only run once on mount
  
  // Save to localStorage whenever items change (but only after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      saveCartToStorage(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      // Check if item already exists (same ID and modifiers)
      const existingIndex = prevItems.findIndex(
        (existing) =>
          existing.id === item.id &&
          JSON.stringify(existing.modifiers) === JSON.stringify(item.modifiers)
      );

      if (existingIndex >= 0) {
        // Increment quantity of existing item
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}

