'use client';

import { MenuItem } from '@/lib/schemas/menu';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

/**
 * MenuItemCard component
 * Renders a single menu item with title, description, price, tags, and modifier placeholder
 */
export function MenuItemCard({ item, className }: MenuItemCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {item.modifiers && item.modifiers.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customization options available
              </p>
              {/* Placeholder for modifiers - full selection not implemented yet */}
            </div>
          )}
        </div>
        <div className="ml-4 text-right">
          <span className="text-lg font-semibold">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>
      {item.image && (
        <div className="mt-4">
          {/* Image placeholder - will be implemented with Next.js Image later */}
          <div className="h-32 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      )}
    </div>
  );
}

