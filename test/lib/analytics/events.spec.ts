/**
 * Analytics Events Tests
 * 
 * Verifies that analytics event functions log correctly to console.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  trackViewRestaurant,
  trackViewMenuCategory,
  trackAddToCart,
  trackStartCheckout,
  trackCompleteOrder,
  trackJoinVip,
} from '@/lib/analytics/events';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { MenuItem } from '@/lib/schemas/menu';

describe('Analytics Events', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should track restaurant page view', () => {
    const config: RestaurantConfig = {
      id: 'test-restaurant',
      name: 'Test Restaurant',
      slug: 'test-restaurant',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
      phone: '555-1234',
      hours: { mon: '09:00-17:00' },
      cuisine: 'Italian',
      theme: 'warm-pizza',
      orderOnlineEnabled: false,
    };

    trackViewRestaurant(config);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('view_restaurant_page');
    expect(event.data.restaurantId).toBe('test-restaurant');
    expect(event.data.restaurantName).toBe('Test Restaurant');
  });

  it('should track menu category view', () => {
    trackViewMenuCategory('Appetizers');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('view_menu_category');
    expect(event.data.categoryName).toBe('Appetizers');
  });

  it('should track add to cart', () => {
    const item: MenuItem = {
      id: 'item-1',
      name: 'Pizza',
      price: 12.99,
    };

    trackAddToCart(item);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('add_to_cart');
    expect(event.data.itemId).toBe('item-1');
    expect(event.data.itemName).toBe('Pizza');
    expect(event.data.price).toBe(12.99);
  });

  it('should track checkout start', () => {
    trackStartCheckout();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('start_checkout');
  });

  it('should track order completion', () => {
    const order = {
      items: [{ id: 'item-1', name: 'Pizza', price: 12.99, quantity: 1 }],
      total: 12.99,
      customer: { name: 'John Doe', phone: '555-1234' },
    };

    trackCompleteOrder(order);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('complete_order');
    expect(event.data.itemCount).toBe(1);
    expect(event.data.total).toBe(12.99);
  });

  it('should track VIP signup', () => {
    trackJoinVip({ email: 'test@example.com', phone: '555-1234' });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.event).toBe('join_vip');
    expect(event.data.hasEmail).toBe(true);
    expect(event.data.hasPhone).toBe(true);
  });

  it('should include timestamp in all events', () => {
    trackStartCheckout();

    const call = consoleSpy.mock.calls[0][1] as string;
    const event = JSON.parse(call);
    expect(event.timestamp).toBeDefined();
    expect(typeof event.timestamp).toBe('string');
    // Verify it's a valid ISO date string
    expect(() => new Date(event.timestamp)).not.toThrow();
  });
});

