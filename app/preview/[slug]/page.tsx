import { loadRestaurant } from '@/lib/loaders/restaurant';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { HoursAndLocation } from '@/components/restaurant/HoursAndLocation';
import { CallToActionBar } from '@/components/restaurant/CallToActionBar';
import { notFound } from 'next/navigation';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Preview page for restaurant
 * Loads restaurant data and renders preview layout
 */
export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  let restaurant;
  try {
    restaurant = loadRestaurant(slug);
  } catch (error) {
    notFound();
  }

  const { config, menu } = restaurant;

  return (
    <RestaurantLayout config={config}>
      <HeroSection config={config} />
      <MenuSectionList menu={menu} />
      <HoursAndLocation config={config} />
      {config.orderOnlineEnabled && (
        <CallToActionBar
          primaryAction={{
            label: 'Order Now',
            href: '#order',
          }}
        />
      )}
    </RestaurantLayout>
  );
}

