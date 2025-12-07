'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { RestaurantThemeProvider, useTheme } from '@/components/theme/ThemeProvider';
import { useCartContext } from '@/components/order/CartProvider';
import { OrderButton } from '@/components/order/OrderButton';
import { CartDrawer } from '@/components/order/CartDrawer';
import { cn } from '@/lib/utils';

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
      <RestaurantLayoutContent
        config={config}
        itemCount={itemCount}
        items={items}
        isCartOpen={isCartOpen}
        onCartToggle={handleCartToggle}
        onCartClose={handleCartClose}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrder}
        formatHours={formatHours}
      >
        {children}
      </RestaurantLayoutContent>
    </RestaurantThemeProvider>
  );
}

interface RestaurantLayoutContentProps {
  config: RestaurantConfig;
  itemCount: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  isCartOpen: boolean;
  onCartToggle: () => void;
  onCartClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPlaceOrder: (order: {
    items: typeof items;
    total: number;
    customer: { name: string; phone: string; notes?: string };
  }) => void;
  formatHours: (hours: RestaurantConfig['hours']) => string;
  children: ReactNode;
}

function RestaurantLayoutContent({
  config,
  itemCount,
  items,
  isCartOpen,
  onCartToggle,
  onCartClose,
  onRemoveItem,
  onUpdateQuantity,
  onPlaceOrder,
  formatHours,
  children,
}: RestaurantLayoutContentProps) {
  const theme = useTheme();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header with logo/name and cart button */}
        <header className={cn('sticky top-0 z-50 min-h-[72px] flex items-center border-b', theme.colors.background, theme.colors.border)}>
          <div className="relative flex w-full items-center justify-between px-4 py-4">
            {/* Logo and restaurant name on the left */}
            <div className="flex items-center gap-3">
              {config.logo ? (
                <a href="#top" className="flex items-center gap-3">
                  <Image
                    src={config.logo}
                    alt={config.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <span className={cn('text-lg font-semibold', theme.colors.text, theme.typography.heading)}>
                    {config.name}
                  </span>
                </a>
              ) : (
                <a href="#top" className={cn('text-lg font-semibold', theme.colors.text, theme.typography.heading)}>
                  {config.name}
                </a>
              )}
            </div>
            {/* Order Button on the far right - positioned at absolute right edge */}
            <div className="absolute right-0 flex items-center pr-4">
              <OrderButton
                onClick={onCartToggle}
                label="Order Online"
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
        <footer className={cn('border-t', theme.colors.background, theme.colors.border)}>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Address */}
              <div>
                <h3 className={cn('mb-2 text-sm font-semibold', theme.colors.text)}>Address</h3>
                <p className={cn('text-sm', theme.colors.textMuted)}>
                  {config.address}
                  <br />
                  {config.city}, {config.state} {config.zip}
                </p>
              </div>

              {/* Hours */}
              <div>
                <h3 className={cn('mb-2 text-sm font-semibold', theme.colors.text)}>Hours</h3>
                <p className={cn('text-sm', theme.colors.textMuted)}>
                  {formatHours(config.hours)}
                </p>
              </div>

              {/* Phone */}
              <div>
                <h3 className={cn('mb-2 text-sm font-semibold', theme.colors.text)}>Contact</h3>
                <p className={cn('text-sm', theme.colors.textMuted)}>
                  {config.phone}
                </p>
                {config.email && (
                  <p className={cn('text-sm', theme.colors.textMuted)}>
                    {config.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* Mobile sticky bottom bar */}
      <div className={cn('sticky bottom-0 z-40 border-t md:hidden', theme.colors.background, theme.colors.border)}>
        <div className="px-4 py-3">
          <OrderButton
            onClick={onCartToggle}
            label="Order Online"
            itemCount={itemCount}
          />
        </div>
      </div>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCartClose}
        items={items}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
        onPlaceOrder={onPlaceOrder}
      />
    </>
  );
}

