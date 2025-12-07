'use client';

import Image from 'next/image';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface HeroSectionProps {
  config: RestaurantConfig;
  className?: string;
  onOrderClick?: () => void;
}

/**
 * HeroSection component
 * Renders hero image, title, and tagline from restaurant config
 */
export function HeroSection({ config, className, onOrderClick }: HeroSectionProps) {
  const theme = useTheme();
  
  const handleOrderClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      // Scroll to menu section if no callback provided
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <section className={cn('relative w-full', theme.colors.background, className)}>
      {config.heroImage && (
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={config.heroImage}
            alt={`${config.name} hero image`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div
        className={cn(
          'container mx-auto px-4 py-12',
          config.heroImage && 'absolute inset-0 flex items-center justify-center'
        )}
      >
        <div className="text-center">
          <h1 className={cn('text-4xl font-bold md:text-5xl lg:text-6xl', theme.colors.text, theme.typography.heading)}>
            {config.name}
          </h1>
          {config.cuisine && config.city && (
            <p className={cn('mt-4 text-xl md:text-2xl', theme.colors.textMuted, theme.typography.body)}>
              Authentic {config.cuisine} in {config.city}
            </p>
          )}
          {config.cuisine && !config.city && (
            <p className={cn('mt-4 text-xl md:text-2xl', theme.colors.textMuted, theme.typography.body)}>
              {config.cuisine} Cuisine
            </p>
          )}
          {config.orderOnlineEnabled && (
            <div className="mt-6">
              <button
                onClick={handleOrderClick}
                className={cn('rounded-md px-8 py-3 text-lg font-semibold transition-colors', theme.colors.primary, theme.typography.heading)}
                aria-label="Order Online"
              >
                Order Online
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

