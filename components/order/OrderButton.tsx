'use client';

import { cn } from '@/lib/utils';

interface OrderButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * OrderButton component
 * Button that toggles the cart or triggers a provided click handler
 */
export function OrderButton({
  onClick,
  label = 'Order Now',
  className,
}: OrderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
        className
      )}
    >
      {label}
    </button>
  );
}

