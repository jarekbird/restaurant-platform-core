'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckoutForm } from './CheckoutForm';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import { useOptionalToast } from '@/lib/hooks/useOptionalToast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  className?: string;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onPlaceOrder?: (order: {
    items: CartItem[];
    total: number;
    customer: {
      name: string;
      phone: string;
      notes?: string;
    };
  }) => void;
}

/**
 * CartDrawer component
 * Basic cart drawer with open/close state and list of items
 */
export function CartDrawer({
  isOpen,
  onClose,
  items,
  className,
  onRemoveItem,
  onUpdateQuantity,
  onPlaceOrder,
}: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<{
    items: CartItem[];
    total: number;
    customerName: string;
  } | null>(null);
  const toast = useOptionalToast();
  
  const handleCheckout = (formData: { name: string; phone: string; notes?: string }) => {
    const order = {
      items,
      total,
      customer: formData,
    };
    
    // Log order for demo purposes
    console.log('Order placed:', order);
    
    // Call onPlaceOrder if provided
    if (onPlaceOrder) {
      onPlaceOrder(order);
    }
    
    // Show success toast
    toast.success('Order placed successfully!');
    
    // Show confirmation modal
    setOrderData({
      items,
      total,
      customerName: formData.name,
    });
    setShowConfirmation(true);
    
    // Close drawer and reset checkout view
    setShowCheckout(false);
  };
  
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setOrderData(null);
    onClose();
  };
  
  if (!isOpen) {
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={cn(
          // Mobile: full width bottom sheet
          'fixed bottom-0 left-0 right-0 z-50 h-[85vh] max-h-[85vh] w-full rounded-t-lg bg-white shadow-xl dark:bg-gray-900',
          // Desktop: right sidebar
          'md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:max-h-full md:max-w-md md:rounded-t-none',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <h2 className="text-xl font-semibold">Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Items List or Checkout Form */}
          <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
            {showCheckout ? (
              <CheckoutForm
                onSubmit={handleCheckout}
              />
            ) : items.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Your cart is empty
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      {/* Quantity Controls */}
                      {onUpdateQuantity && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-10 w-10 min-w-[2.5rem] touch-manipulation rounded border border-gray-300 bg-white text-gray-700 active:bg-gray-100 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 dark:hover:bg-gray-700"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-10 w-10 min-w-[2.5rem] touch-manipulation rounded border border-gray-300 bg-white text-gray-700 active:bg-gray-100 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 dark:hover:bg-gray-700"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      )}
                      {/* Remove Button */}
                      {onRemoveItem && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="h-10 w-10 min-w-[2.5rem] touch-manipulation text-red-500 active:bg-red-50 hover:bg-red-50 dark:text-red-400 dark:active:bg-red-900/20 dark:hover:bg-red-900/20"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          🗑️
                        </button>
                      )}
                      <p className="ml-2 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with Total and Checkout Button */}
          {items.length > 0 && !showCheckout && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full touch-manipulation rounded-md bg-black px-4 py-3 text-base font-semibold text-white transition-colors active:bg-gray-700 hover:bg-gray-800 dark:bg-white dark:text-black dark:active:bg-gray-300 dark:hover:bg-gray-200"
              >
                Checkout
              </button>
            </div>
          )}
          {showCheckout && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Back to Cart
              </button>
            </div>
          )}
        </div>
      </div>
      {orderData && (
        <OrderConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          orderSummary={orderData}
        />
      )}
    </>
  );
}

