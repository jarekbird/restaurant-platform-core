import { cn } from '@/lib/utils';

interface CallToActionBarProps {
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

/**
 * CallToActionBar component
 * Renders a primary action button (e.g., "Order Now")
 */
export function CallToActionBar({
  primaryAction,
  className,
}: CallToActionBarProps) {
  const content = (
    <button
      onClick={primaryAction.onClick}
      className="rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
    >
      {primaryAction.label}
    </button>
  );

  return (
    <section
      className={cn(
        'container mx-auto px-4 py-8 text-center',
        className
      )}
    >
      {primaryAction.href ? (
        <a href={primaryAction.href}>{content}</a>
      ) : (
        content
      )}
    </section>
  );
}

