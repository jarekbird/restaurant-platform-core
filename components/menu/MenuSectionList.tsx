'use client';

import { useEffect, useRef } from 'react';
import { Menu } from '@/lib/schemas/menu';
import { MenuItemCard } from './MenuItemCard';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { trackViewMenuCategory } from '@/lib/analytics/events';

interface MenuSectionListProps {
  menu: Menu;
  className?: string;
}

/**
 * MenuSectionList component
 * Accepts a Menu object and maps over categories rendering MenuCategory and MenuItemCard instances
 */
export function MenuSectionList({ menu, className }: MenuSectionListProps) {
  const theme = useTheme();
  const trackedCategories = useRef<Set<string>>(new Set());
  
  // Track category views when they come into view (optional)
  useEffect(() => {
    menu.categories.forEach((category) => {
      if (!trackedCategories.current.has(category.id)) {
        trackViewMenuCategory(category.name);
        trackedCategories.current.add(category.id);
      }
    });
  }, [menu.categories]);
  
  return (
    <div className={cn('container mx-auto px-4 py-12 space-y-12', className)}>
      {menu.categories.map((category) => (
        <section key={category.id} className="mb-8" id={`menu-section-${category.id}`}>
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
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <MenuItemCard key={`${category.id}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

