import Image from 'next/image';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  config: RestaurantConfig;
  className?: string;
}

/**
 * HeroSection component
 * Renders hero image, title, and tagline from restaurant config
 */
export function HeroSection({ config, className }: HeroSectionProps) {
  return (
    <section className={cn('relative w-full', className)}>
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
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {config.name}
          </h1>
          {config.cuisine && (
            <p className="mt-4 text-xl text-white/90 md:text-2xl">
              {config.cuisine} Cuisine
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

