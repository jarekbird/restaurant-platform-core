import { z } from 'zod';

/**
 * Days of the week
 */
const dayOfWeekSchema = z.enum([
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]);

/**
 * Hours schema
 * Record keyed by day of week with string values like "11:00-21:00"
 */
export const hoursSchema = z.record(
  dayOfWeekSchema,
  z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Hours must be in format "HH:MM-HH:MM"')
);

/**
 * Restaurant configuration schema
 * Represents the complete configuration for a restaurant
 */
export const restaurantConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip code is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  hours: hoursSchema,
  cuisine: z.string().min(1, 'Cuisine is required'),
  theme: z.string().min(1, 'Theme is required'),
  heroImage: z.string().url().optional(),
  logo: z.string().url().optional(),
  orderOnlineEnabled: z.boolean().default(false),
});

/**
 * Type exports inferred from schemas
 */
export type Hours = z.infer<typeof hoursSchema>;
export type RestaurantConfig = z.infer<typeof restaurantConfigSchema>;

