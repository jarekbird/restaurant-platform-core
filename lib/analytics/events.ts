import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { MenuItem } from '@/lib/schemas/menu';

/**
 * Analytics event structure
 */
interface AnalyticsEvent {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Log analytics event to console
 * In production, this would send to an analytics backend
 */
function logEvent(event: AnalyticsEvent): void {
  console.log('[Analytics]', JSON.stringify(event, null, 2));
}

/**
 * Track restaurant page view
 */
export function trackViewRestaurant(config: RestaurantConfig): void {
  logEvent({
    event: 'view_restaurant_page',
    timestamp: new Date().toISOString(),
    data: {
      restaurantId: config.id,
      restaurantName: config.name,
      cuisine: config.cuisine,
      city: config.city,
    },
  });
}

/**
 * Track menu category view
 */
export function trackViewMenuCategory(categoryName: string): void {
  logEvent({
    event: 'view_menu_category',
    timestamp: new Date().toISOString(),
    data: {
      categoryName,
    },
  });
}

/**
 * Track add to cart event
 */
export function trackAddToCart(item: MenuItem): void {
  logEvent({
    event: 'add_to_cart',
    timestamp: new Date().toISOString(),
    data: {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
    },
  });
}

/**
 * Track checkout start event
 */
export function trackStartCheckout(): void {
  logEvent({
    event: 'start_checkout',
    timestamp: new Date().toISOString(),
    data: {},
  });
}

/**
 * Track order completion event
 */
export function trackCompleteOrder(order: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  total: number;
  customer: { name: string; phone: string; notes?: string };
}): void {
  logEvent({
    event: 'complete_order',
    timestamp: new Date().toISOString(),
    data: {
      itemCount: order.items.length,
      total: order.total,
      hasCustomerName: !!order.customer.name,
      hasCustomerPhone: !!order.customer.phone,
    },
  });
}

/**
 * Track VIP signup / email capture event
 */
export function trackJoinVip(data: { email?: string; phone?: string }): void {
  logEvent({
    event: 'join_vip',
    timestamp: new Date().toISOString(),
    data: {
      hasEmail: !!data.email,
      hasPhone: !!data.phone,
    },
  });
}

