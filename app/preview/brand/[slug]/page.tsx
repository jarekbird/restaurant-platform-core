import { notFound } from 'next/navigation';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { BrandPageContent } from './BrandPageContent';

/**
 * PROTOTYPE-ONLY: This is a demo/preview application.
 * 
 * Phase 3 Constraints:
 * - No payment gateway integration
 * - No POS integration
 * - No live order routing
 * - All ordering flows are mock/demo-only
 * 
 * This brand preview route is for showcasing multi-location patterns.
 */

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Hard-coded brand data for demo purposes
 * In production, this would be loaded from a brand data file
 */
export interface BrandLocation {
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
}

export interface BrandData {
  name: string;
  slug: string;
  description: string;
  heroImage?: string;
  logo?: string;
  theme: string;
  locations: BrandLocation[];
}

// Hard-coded brand data for demo
const BRAND_DATA: Record<string, BrandData> = {
  'so-delicious': {
    name: 'So Delicious Sushi',
    slug: 'so-delicious',
    description: 'Authentic Japanese cuisine with fresh ingredients and traditional techniques. Experience the art of sushi at multiple locations across the Bay Area.',
    heroImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    theme: 'modern-sushi',
    locations: [
      {
        slug: 'so-delicious-sushi',
        name: 'So Delicious Sushi - San Francisco',
        address: '123 Sushi Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        phone: '+1-415-555-0123',
        hours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '12:00-22:00',
          sun: '12:00-20:00',
        },
      },
      {
        slug: 'tataki',
        name: 'So Delicious Sushi - Oakland',
        address: '456 Main Street',
        city: 'Oakland',
        state: 'CA',
        zip: '94601',
        phone: '+1-510-555-0124',
        hours: {
          mon: '11:00-21:00',
          tue: '11:00-21:00',
          wed: '11:00-21:00',
          thu: '11:00-21:00',
          fri: '11:00-22:00',
          sat: '12:00-22:00',
          sun: '12:00-20:00',
        },
      },
    ],
  },
};

/**
 * Brand preview page
 * Renders a brand overview with multiple locations
 */
export default async function BrandPreviewPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const brand = BRAND_DATA[slug];

  if (!brand) {
    notFound();
  }

  // Create a minimal config for the layout
  const config = {
    id: brand.slug,
    name: brand.name,
    slug: brand.slug,
    address: brand.locations[0]?.address || '',
    city: brand.locations[0]?.city || '',
    state: brand.locations[0]?.state || '',
    zip: brand.locations[0]?.zip || '',
    phone: brand.locations[0]?.phone || '',
    hours: brand.locations[0]?.hours || {
      mon: '11:00-21:00',
      tue: '11:00-21:00',
      wed: '11:00-21:00',
      thu: '11:00-21:00',
      fri: '11:00-22:00',
      sat: '12:00-22:00',
      sun: '12:00-20:00',
    },
    cuisine: 'Japanese',
    theme: brand.theme as 'modern-sushi' | 'sushi-dark' | 'cafe-warm' | 'pizza-bright' | 'warm-pizza' | 'breakfast-diner' | 'fast-casual',
    orderOnlineEnabled: false,
  };

  return (
    <ToastProvider>
      <RestaurantThemeProvider themeKey={brand.theme}>
        <RestaurantLayout config={config}>
          <BrandPageContent brand={brand} />
        </RestaurantLayout>
      </RestaurantThemeProvider>
    </ToastProvider>
  );
}
