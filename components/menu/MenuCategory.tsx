'use client';

import { MenuCategory as MenuCategoryType } from '@/lib/schemas/menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface MenuCategoryProps {
  category: MenuCategoryType;
  className?: string;
}

/**
 * MenuCategory component
 * Renders a single menu category with its name, description, and items
 * Styling is generic and themeable via theme tokens
 */
export function MenuCategory({ category, className }: MenuCategoryProps) {
  const theme = useTheme();
  
  return (
    <section className={cn('mb-8', className)}>
      <div className="mb-4">
        <h2 className={cn('text-2xl font-bold', theme.colors.text, theme.typography.heading)}>
          {category.name}
        </h2>
        {category.description && (
          <p className={cn('mt-2', theme.colors.textMuted, theme.typography.body)}>
            {category.description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {category.items.map((item) => (
          <div
            key={item.id}
            className={cn('border-b pb-4 last:border-b-0', theme.colors.border)}
          >
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
              </div>
              <div className="ml-4 text-right">
                <span className={cn('text-lg font-semibold', theme.colors.text)}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

