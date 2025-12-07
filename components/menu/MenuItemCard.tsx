'use client';

import Image from 'next/image';
import { MenuItem } from '@/lib/schemas/menu';
import { cn } from '@/lib/utils';
import { useCartContext } from '@/components/order/CartProvider';
import { useTheme } from '@/components/theme/ThemeProvider';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

/**
 * MenuItemCard component
 * Renders a single menu item with title, description, price, tags, and modifier placeholder
 */
export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const { addItem } = useCartContext();
  const theme = useTheme();
  
  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      modifiers: [], // Default to no modifiers for now
    });
  };
  
  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden shadow-sm',
        theme.colors.surface,
        theme.colors.border,
        className
      )}
    >
      {/* Image at top with fixed aspect ratio */}
      {item.image && (
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={cn('text-lg font-semibold', theme.colors.text, theme.typography.heading)}>
              {item.name}
            </h3>
            {item.description && (
              <p className={cn('mt-1 text-sm', theme.colors.textMuted, theme.typography.body)}>
                {item.description}
              </p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn('rounded-full px-2 py-1 text-xs', theme.colors.secondary, theme.colors.text)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="mt-3">
                <p className={cn('text-xs', theme.colors.textMuted)}>
                  Customization options available
                </p>
                {/* Placeholder for modifiers - full selection not implemented yet */}
              </div>
            )}
          </div>
          <div className="ml-4 text-right">
            <span className={cn('text-lg font-semibold', theme.colors.text)}>
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            className={cn('w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors', theme.colors.primary)}
            aria-label={`Add ${item.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

