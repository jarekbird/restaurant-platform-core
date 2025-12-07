'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: {
    items: OrderItem[];
    total: number;
    customerName: string;
  };
  className?: string;
}

/**
 * OrderConfirmationModal component
 * Displays order confirmation with order summary
 * Includes focus trap and keyboard accessibility
 * 
 * PROTOTYPE CONSTRAINT: This displays mock/demo orders only.
 * - No real order processing occurred
 * - Order data is from console logs only
 * - In production, this would show real order confirmation from backend
 */
export function OrderConfirmationModal({
  isOpen,
  onClose,
  orderSummary,
  className,
}: OrderConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmation-title"
        aria-describedby="order-confirmation-description"
      >
        <h2
          id="order-confirmation-title"
          className="mb-4 text-2xl font-bold"
        >
          Order Confirmed!
        </h2>
        
        <div id="order-confirmation-description" className="mb-6">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Thank you, <strong>{orderSummary.customerName}</strong>! Your order has been placed successfully.
          </p>
          
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">Order Summary:</h3>
            <ul className="space-y-2">
              {orderSummary.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-800">
            <span>Total:</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          aria-label="Close order confirmation"
        >
          Close
        </button>
      </div>
    </>
  );
}














