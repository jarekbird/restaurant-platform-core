import { MenuCategory as MenuCategoryType } from '@/lib/schemas/menu';
import { cn } from '@/lib/utils';

interface MenuCategoryProps {
  category: MenuCategoryType;
  className?: string;
}

/**
 * MenuCategory component
 * Renders a single menu category with its name, description, and items
 * Styling is generic and themeable via className prop
 */
export function MenuCategory({ category, className }: MenuCategoryProps) {
  return (
    <section className={cn('mb-8', className)}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        {category.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {category.description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {category.items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-800"
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
              </div>
              <div className="ml-4 text-right">
                <span className="text-lg font-semibold">
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

