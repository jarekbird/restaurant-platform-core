'use client';

import { MenuItem } from '@/lib/schemas/menu';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface FeaturedItemsProps {
  items: MenuItem[];
  className?: string;
  title?: string;
}

/**
 * FeaturedItems component
 * Renders a subset of menu items as featured items
 */
export function FeaturedItems({
  items,
  className,
  title = 'Featured Items',
}: FeaturedItemsProps) {
  const theme = useTheme();
  
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn('container mx-auto px-4 py-12', theme.colors.background, className)}>
      <h2 className={cn('mb-8 text-3xl font-bold', theme.colors.text, theme.typography.heading)}>{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

