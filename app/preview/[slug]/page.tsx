import { loadRestaurant } from '@/lib/loaders/restaurant';
import { RestaurantLayout } from '@/components/layout/RestaurantLayout';
import { HeroSection } from '@/components/restaurant/HeroSection';
import { MenuSectionList } from '@/components/menu/MenuSectionList';
import { AboutSection } from '@/components/restaurant/AboutSection';
import { ReviewHighlights } from '@/components/restaurant/ReviewHighlights';
import { HoursAndLocation } from '@/components/restaurant/HoursAndLocation';
import { CartProvider } from '@/components/order/CartProvider';
import { ChatAssistantWrapper } from '@/components/chat/ChatAssistantWrapper';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { notFound } from 'next/navigation';

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
                <MenuSectionList menu={menu} />
                <AboutSection config={config} />
                <ReviewHighlights />
                <HoursAndLocation config={config} />
              </RestaurantLayout>
              {config.orderOnlineEnabled && <ChatAssistantWrapper menu={menu} />}
            </CartProvider>
          </ToastProvider>
        );
}

