import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { Metadata } from 'next';

export type PageType = 'home' | 'menu' | 'catering' | 'index';

/**
 * Build SEO metadata for restaurant pages
 * Generates title and description based on restaurant config and page type
 */
export function buildRestaurantMetadata(
  config: RestaurantConfig,
  pageType: PageType = 'home'
): Metadata {
  const { name, cuisine, city } = config;

  // Build title based on page type
  let title: string;
  switch (pageType) {
    case 'home':
      title = `${name}${cuisine ? ` - ${cuisine}` : ''}${city ? ` in ${city}` : ''} | Order Online`;
      break;
    case 'menu':
      title = `Menu - ${name}${city ? ` in ${city}` : ''} | Order Online`;
      break;
    case 'catering':
      title = `Catering - ${name}${city ? ` in ${city}` : ''} | Order Online`;
      break;
    case 'index':
      title = `${name}${city ? ` in ${city}` : ''} | Restaurant`;
      break;
    default:
      title = `${name} | Order Online`;
  }

  // Build description
  let description: string;
  if (cuisine && city) {
    description = `${name} offers authentic ${cuisine.toLowerCase()} in ${city}. Order online for delivery or pickup.`;
  } else if (cuisine) {
    description = `${name} offers authentic ${cuisine.toLowerCase()}. Order online for delivery or pickup.`;
  } else if (city) {
    description = `${name} in ${city}. Order online for delivery or pickup.`;
  } else {
    description = `${name}. Order online for delivery or pickup.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

