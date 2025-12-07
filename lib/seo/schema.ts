import { RestaurantConfig } from '@/lib/schemas/restaurant';

/**
 * Build Restaurant JSON-LD structured data from RestaurantConfig
 * Returns Schema.org Restaurant object for SEO
 */
export function buildRestaurantJsonLd(config: RestaurantConfig, baseUrl: string = ''): object {
  const url = baseUrl ? `${baseUrl}/preview/${config.slug}` : `https://example.com/preview/${config.slug}`;
  
  const openingHours = Object.entries(config.hours).map(([day, hours]) => {
    const dayMap: Record<string, string> = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    };
    return `${dayMap[day]} ${hours}`;
  });

  const address = {
    '@type': 'PostalAddress',
    streetAddress: config.address,
    addressLocality: config.city,
    addressRegion: config.state,
    postalCode: config.zip,
    addressCountry: 'US',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: config.name,
    address,
    telephone: config.phone,
    url,
    servesCuisine: config.cuisine,
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1],
    })),
    ...(config.email && { email: config.email }),
  };
}

