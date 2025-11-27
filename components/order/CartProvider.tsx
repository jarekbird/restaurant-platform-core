'use client';

import { createContext, useContext, ReactNode } from 'react';
import { CartItem } from './useCart';

/**
 * CartContextValue interface
 * Matches the return type of useCart hook exactly
 */
export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

/**
 * CartContext
 * React context for cart state management
 * Default value is null to detect usage outside provider
 */
const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider component
 * Provides cart functionality to all child components via React Context
 * 
 * @param children - React children that need access to cart context
 * 
 * @example
 * ```tsx
 * <CartProvider>
 *   <YourComponent />
 * </CartProvider>
 * ```
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // Placeholder implementation - will be wired to useCart in next task
  // For now, return null to maintain type safety
  const cartValue: CartContextValue | null = null;

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
}

/**
 * useCartContext hook
 * Provides access to cart context
 * 
 * @returns CartContextValue with cart state and methods
 * @throws Error if used outside CartProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { items, addItem } = useCartContext();
 *   // Use cart functionality
 * }
 * ```
 */
export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  
  return context;
}

