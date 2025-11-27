import { Menu } from '@/lib/schemas/menu';
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
    <div className={cn('container mx-auto px-4 py-12 space-y-12', className)}>
      {menu.categories.map((category) => (
        <section key={category.id} className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            {category.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
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

