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
  
  /**
   * Handle order placement (MOCK/DEMO-ONLY)
   * 
   * PROTOTYPE CONSTRAINT: This is a demo-only implementation.
   * - No payment gateway integration (Stripe, PayPal, etc.)
   * - No POS integration
   * - No backend persistence or live order routing
   * - Orders are logged to console only
   * 
   * In a production system, this would:
   * - Process payment via payment gateway
   * - Send order to POS system
   * - Persist order to database
   * - Send confirmation email/SMS
   */
  const handlePlaceOrder = (order: {
    items: typeof items;
    total: number;
    customer: { name: string; phone: string; notes?: string };
  }) => {
    // Log order for demo purposes (MOCK-ONLY - no real processing)
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
      {/* Header with cart button */}
      <header className="sticky top-0 z-50 min-h-[72px] flex items-center border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="relative flex w-full items-center justify-between px-4 py-4">
          {/* Cart Button on the far right - positioned at absolute right edge */}
          <div className="absolute right-0 flex items-center pr-4">
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

