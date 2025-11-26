import { z } from 'zod';

/**
 * Modifier option schema
 * Represents a single option within a modifier group (e.g., "Small", "Medium", "Large" for size)
 */
export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  priceDelta: z.number().default(0),
});

/**
 * Modifier group schema
 * Represents a group of modifier options (e.g., "Size", "Toppings")
 */
export const modifierGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  min: z.number().int().min(0).optional(),
  max: z.number().int().min(0).optional(),
  options: z.array(modifierOptionSchema).min(1, 'At least one option is required'),
});

/**
 * Menu item schema
 * Represents a single item on the menu (e.g., "Margherita Pizza")
 */
export const menuItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  modifiers: z.array(modifierGroupSchema).optional(),
});

/**
 * Menu category schema
 * Represents a category of menu items (e.g., "Appetizers", "Main Courses")
 */
export const menuCategorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  items: z.array(menuItemSchema).min(1, 'At least one item is required'),
});

/**
 * Menu schema
 * Represents the complete menu structure
 */
export const menuSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  currency: z.string().default('USD'),
  categories: z.array(menuCategorySchema).min(1, 'At least one category is required'),
});

/**
 * Type exports inferred from schemas
 */
export type ModifierOption = z.infer<typeof modifierOptionSchema>;
export type ModifierGroup = z.infer<typeof modifierGroupSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type Menu = z.infer<typeof menuSchema>;

