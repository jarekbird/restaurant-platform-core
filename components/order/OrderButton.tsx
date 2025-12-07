'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface OrderButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  itemCount?: number;
}

/**
 * Shopping cart icon SVG
 */
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

/**
 * OrderButton component
 * Button that toggles the cart or triggers a provided click handler
 * Shows a cart icon when label is "Cart", otherwise shows the label text
 */
export function OrderButton({
  onClick,
  label = 'Order Now',
  className,
  itemCount = 0,
}: OrderButtonProps) {
  const theme = useTheme();
  const isCartButton = label.toLowerCase() === 'cart';
  const ariaLabel = itemCount > 0 ? `${label} (${itemCount} items)` : label;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-full px-8 py-4 text-lg font-semibold transition-colors',
        theme.colors.primary,
        theme.typography.heading,
        // Adjust padding for icon-only button
        isCartButton && 'px-4',
        className
      )}
      aria-label={ariaLabel}
    >
      {isCartButton ? (
        <CartIcon className="h-6 w-6" />
      ) : (
        label
      )}
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

