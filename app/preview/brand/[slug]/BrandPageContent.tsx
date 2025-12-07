'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { BrandData, BrandLocation } from './page';

/**
 * Brand location card component
 */
function BrandLocationCard({ location }: { location: BrandLocation }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-2 text-xl font-bold">{location.name}</h3>
      <div className="mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>{location.address}</p>
        <p>
          {location.city}, {location.state} {location.zip}
        </p>
        <p>{location.phone}</p>
      </div>
      <div className="mb-4">
        <p className="mb-1 text-sm font-semibold">Hours:</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mon-Sun: {location.hours.mon}
        </p>
      </div>
      <Link
        href={`/preview/${location.slug}`}
        className="inline-block rounded-md bg-black px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        Order from this location
      </Link>
    </div>
  );
}

/**
 * Brand preview page content component
 * Client component for theme access
 */
export function BrandPageContent({ brand }: { brand: BrandData }) {
  const theme = useTheme();

  return (
    <>
      {/* Hero Section */}
      <section className={cn('relative w-full', theme.colors.background)}>
        {brand.heroImage && (
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={brand.heroImage}
              alt={`${brand.name} hero image`}
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
            brand.heroImage && 'absolute inset-0 flex items-center justify-center'
          )}
        >
          <div className="text-center">
            {brand.logo && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
            )}
            <h1 className={cn('text-4xl font-bold md:text-5xl lg:text-6xl', theme.colors.text, theme.typography.heading)}>
              {brand.name}
            </h1>
            <p className={cn('mt-4 text-xl md:text-2xl', theme.colors.textMuted)}>
              {brand.description}
            </p>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className={cn('container mx-auto px-4 py-12', theme.colors.background)}>
        <h2 className={cn('mb-8 text-3xl font-bold', theme.colors.text, theme.typography.heading)}>
          Our Locations
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brand.locations.map((location) => (
            <BrandLocationCard key={location.slug} location={location} />
          ))}
        </div>
      </section>
    </>
  );
}

