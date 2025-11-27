'use client';

import { cn } from '@/lib/utils';

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
  // Will be used in next task when UI controls are added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRemoveItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdateQuantity,
}: CartDrawerProps) {
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
          'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl dark:bg-gray-900',
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

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
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
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with Total */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

