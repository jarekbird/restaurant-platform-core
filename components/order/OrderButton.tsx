'use client';

import { cn } from '@/lib/utils';

interface OrderButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  itemCount?: number;
}

/**
 * OrderButton component
 * Button that toggles the cart or triggers a provided click handler
 */
export function OrderButton({
  onClick,
  label = 'Order Now',
  className,
  itemCount = 0,
}: OrderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
        className
      )}
      aria-label={itemCount > 0 ? `${label} (${itemCount} items)` : label}
    >
      {label}
      {itemCount > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}

