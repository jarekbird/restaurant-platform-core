'use client';

import { ReactNode, useState } from 'react';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { useCartContext } from '@/components/order/CartProvider';
import { OrderButton } from '@/components/order/OrderButton';
import { CartDrawer } from '@/components/order/CartDrawer';

interface RestaurantLayoutProps {
  config: RestaurantConfig;
  children: ReactNode;
}

/**
 * RestaurantLayout component
 * Renders a restaurant-specific layout with header, main content, and footer
 * Accepts restaurantConfig to display restaurant-specific information
 */
export function RestaurantLayout({ config, children }: RestaurantLayoutProps) {
  // Access cart context for cart functionality
  const { itemCount, items, removeItem, updateQuantity, clearCart } = useCartContext();
  
  // Manage cart drawer open/close state
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const handleCartClose = () => {
    setIsCartOpen(false);
  };
  
  // Handlers for cart operations
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };
  
  const handlePlaceOrder = (order: {
    items: typeof items;
    total: number;
    customer: { name: string; phone: string; notes?: string };
  }) => {
    // Log order for demo purposes
    console.log('Order placed:', order);
    
    // Clear cart after order
    clearCart();
  };
  
  const formatHours = (hours: RestaurantConfig['hours']) => {
    const dayNames: Record<string, string> = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    };
    
    return Object.entries(hours)
      .map(([day, time]) => `${dayNames[day]}: ${time}`)
      .join(', ');
  };

  return (
    <RestaurantThemeProvider themeKey={config.theme}>
      <div className="flex min-h-screen flex-col">
      {/* Header with TanStack devtools button and cart button */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="flex w-full items-center justify-between px-4 py-4">
          {/* TanStack devtools button on the left */}
          <div className="flex items-center">
            <button
              id="tanstack-devtools-toggle"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle TanStack Query Devtools"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black dark:text-white"
              >
                <path
                  d="M16 2L2 10V22L16 30L30 22V10L16 2Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <path
                  d="M16 2L2 10L16 18L30 10L16 2Z"
                  fill="currentColor"
                />
                <path
                  d="M2 10V22L16 30V18L2 10Z"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
                <path
                  d="M30 10V22L16 30V18L30 10Z"
                  fill="currentColor"
                  fillOpacity="0.4"
                />
              </svg>
            </button>
          </div>
          {/* Cart Button on the far right */}
          <div className="flex items-center">
            <OrderButton
              onClick={handleCartToggle}
              label="Cart"
              itemCount={itemCount}
            />
          </div>
        </div>
      </header>

      {/* Main area that renders children */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer with address, hours, and phone */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Address */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Address</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.address}
                <br />
                {config.city}, {config.state} {config.zip}
              </p>
            </div>

            {/* Hours */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatHours(config.hours)}
              </p>
            </div>

            {/* Phone */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.phone}
              </p>
              {config.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
    <CartDrawer
      isOpen={isCartOpen}
      onClose={handleCartClose}
      items={items}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantity={handleUpdateQuantity}
      onPlaceOrder={handlePlaceOrder}
    />
    </RestaurantThemeProvider>
  );
}

