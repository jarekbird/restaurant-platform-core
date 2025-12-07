import { loadRestaurant } from '@/lib/loaders/restaurant';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { SeoContentBlock } from '@/components/restaurant/SeoContentBlock';
import { VipSignupBanner } from '@/components/restaurant/VipSignupBanner';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { AboutSection } from '@/components/restaurant/AboutSection';
import { ReviewHighlights } from '@/components/restaurant/ReviewHighlights';
import { VipSignupSection } from '@/components/restaurant/VipSignupSection';
import { HoursAndLocation } from '@/components/restaurant/HoursAndLocation';
import { CartProvider } from '@/components/order/CartProvider';
import { ChatAssistantWrapper } from '@/components/chat/ChatAssistantWrapper';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { buildRestaurantMetadata } from '@/lib/seo/restaurantMetadata';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

/**
 * PROTOTYPE-ONLY: This is a demo/preview application.
 * 
 * Phase 3 Constraints:
 * - No payment gateway integration (Stripe, PayPal, etc.)
 * - No POS integration
 * - No live order routing or backend persistence
 * - All orders are mock/demo-only (console logs, confirmation modals, analytics events)
 * - Cart state is client-side only (localStorage)
 * 
 * This application serves as a prototype/preview tool, not a production ordering platform.
 */

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for preview page
 */
export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const restaurant = loadRestaurant(slug);
    return buildRestaurantMetadata(restaurant.config, 'home');
  } catch {
    return {
      title: 'Restaurant Not Found',
      description: 'The requested restaurant could not be found.',
    };
  }
}

/**
 * Preview page for restaurant
 * Loads restaurant data and renders preview layout
 * 
 * NOTE: All ordering flows in this preview are mock/demo-only.
 * No real payment processing or order persistence occurs.
 */
export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  let restaurant;
  try {
    restaurant = loadRestaurant(slug);
  } catch {
    notFound();
  }

  const { config, menu } = restaurant;

        return (
          <ToastProvider>
            <CartProvider>
              <RestaurantLayout config={config}>
                <HeroSection config={config} />
                <SeoContentBlock config={config} />
                <VipSignupBanner />
                <MenuSectionList menu={menu} />
                <AboutSection config={config} />
                <ReviewHighlights />
                <VipSignupSection />
                <HoursAndLocation config={config} />
              </RestaurantLayout>
              {config.orderOnlineEnabled && <ChatAssistantWrapper menu={menu} />}
            </CartProvider>
          </ToastProvider>
        );
}

