'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

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
  const theme = useTheme();
  const content = (
    <button
      onClick={primaryAction.onClick}
      className={cn('rounded-full px-8 py-4 text-lg font-semibold transition-colors', theme.colors.primary, theme.typography.heading, className)}
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

