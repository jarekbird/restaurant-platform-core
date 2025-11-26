import { Menu } from '@/lib/schemas/menu';
import { MenuCategory } from './MenuCategory';
import { MenuItemCard } from './MenuItemCard';
import { cn } from '@/lib/utils';

interface MenuSectionListProps {
  menu: Menu;
  className?: string;
}

/**
 * MenuSectionList component
 * Accepts a Menu object and maps over categories rendering MenuCategory and MenuItemCard instances
 */
export function MenuSectionList({ menu, className }: MenuSectionListProps) {
  return (
    <div className={cn('space-y-12', className)}>
      {menu.categories.map((category) => (
        <div key={category.id}>
          <MenuCategory category={category} />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

