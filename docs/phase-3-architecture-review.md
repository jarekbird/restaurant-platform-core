# Phase 3 Architecture Review

**Task**: TASK-0.1 - Review current preview architecture  
**Date**: 2024  
**Purpose**: Document current architecture to inform Phase 3 implementation

## Overview

The `restaurant-platform-core` application has a working preview system from Phase 2 that needs to be upgraded with Owner.com-aligned principles in Phase 3.

## Preview Route Structure

### Data Loading Flow

**File**: `app/preview/[slug]/page.tsx`

1. **Route Handler**: Async server component that receives `slug` from URL params
2. **Data Loading**: Calls `loadRestaurant(slug)` from `lib/loaders/restaurant.ts`
3. **Error Handling**: Uses try/catch with `notFound()` for 404 cases
4. **Data Structure**: Returns `{ config, menu }` where:
   - `config`: `RestaurantConfig` (validated via Zod schema)
   - `menu`: `Menu` (validated via Zod schema)

### Component Hierarchy

```
ToastProvider
  └── CartProvider
      └── RestaurantLayout (wraps children in RestaurantThemeProvider)
          ├── HeroSection
          ├── MenuSectionList
          └── HoursAndLocation
      └── ChatAssistantWrapper (conditional: only if config.orderOnlineEnabled)
```

**Key Points**:
- `RestaurantThemeProvider` wraps all layout children and provides theme context
- `CartProvider` manages cart state via React Context
- `ChatAssistantWrapper` is conditionally rendered based on `orderOnlineEnabled` flag

## Data Schemas

### RestaurantConfig (`lib/schemas/restaurant.ts`)

**Required Fields**:
- `id`, `name`, `slug`, `address`, `city`, `state`, `zip`, `phone`
- `hours`: Record of day-of-week → time range (e.g., "11:00-21:00")
- `cuisine`: String (required)
- `theme`: String (required) - references theme key

**Optional Fields**:
- `email`: Email string
- `heroImage`: URL string
- `logo`: URL string
- `orderOnlineEnabled`: Boolean (defaults to false)

### Menu (`lib/schemas/menu.ts`)

**Structure**:
- `Menu` → `categories[]` → `items[]` → `modifiers[]` (optional)
- Each item has: `id`, `name`, `description`, `price`, `image`, `tags`
- Modifiers support groups with options and price deltas

## Theme System

### Current Implementation

**File**: `lib/themes/index.ts`

**Theme Interface**:
```typescript
interface Theme {
  name: string;
  colors: {
    primary, secondary, background, surface, text, textMuted, border
  };
  typography: {
    heading, body
  };
}
```

**Current Themes**:
- `sushi-dark`: Dark theme with black/gray colors
- `cafe-warm`: Warm amber tones
- `pizza-bright`: Bright red/white theme

**Theme Provider** (`components/theme/ThemeProvider.tsx`):
- `RestaurantThemeProvider`: Wraps components, selects theme via `getTheme(themeKey)`
- `useTheme()`: Hook to access theme in components
- Fallback: Unknown theme keys default to `sushi-dark`

**Usage Pattern**:
- Components use `useTheme()` to access theme tokens
- Theme tokens are Tailwind CSS class strings (e.g., `'bg-red-600 text-white'`)
- Example: `HeroSection` uses `theme.colors.background`, `theme.colors.text`, `theme.typography.heading`

## Component Architecture

### Layout Components

**RestaurantLayout** (`components/layout/RestaurantLayout.tsx`):
- Wraps children in `RestaurantThemeProvider`
- Provides sticky header with `OrderButton` (currently labeled "Cart")
- Provides footer with address, hours, phone
- Manages `CartDrawer` state
- Handles cart operations (remove, update quantity, place order)
- Order placement: Logs to console (mock/demo-only)

**HeroSection** (`components/restaurant/HeroSection.tsx`):
- Renders hero image (if `config.heroImage` exists)
- Displays restaurant name as H1
- Displays cuisine as subtitle ("[cuisine] Cuisine")
- Uses theme tokens: `theme.colors.background`, `theme.colors.text`, `theme.typography.heading`

### Menu Components

**MenuSectionList** (`components/menu/MenuSectionList.tsx`):
- Renders menu categories
- Each category rendered as section with heading
- Uses `MenuItemCard` for each item

**MenuItemCard** (`components/menu/MenuItemCard.tsx`):
- Renders item name, description, price, tags
- Has placeholder for images (not fully implemented)
- Add to Cart button (calls `addItem` from cart context)
- Currently uses hard-coded colors (needs theme integration)

### Order Components

**CartProvider** (`components/order/CartProvider.tsx`):
- Provides cart state via React Context
- Uses `useCart` hook (manages localStorage persistence)
- Wraps cart operations with toast notifications
- Exposes: `items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total`, `itemCount`

**CartDrawer** (`components/order/CartDrawer.tsx`):
- Slide-out drawer for cart
- Displays cart items with quantity controls
- Checkout form (mock/demo-only)
- Order placement: Logs to console, clears cart

**OrderButton** (`components/order/OrderButton.tsx`):
- Displays cart item count badge
- Currently labeled "Cart" (needs to be "Order Online" in Phase 3)

### Chat Components

**ChatAssistantWrapper** (`components/chat/ChatAssistantWrapper.tsx`):
- Conditionally rendered when `config.orderOnlineEnabled` is true
- Provides AI chatbot for ordering assistance
- Uses `/api/chat` route for chat functionality

## Cart and Ordering Flow

### Cart State Management

1. **State**: Managed via `useCart` hook (localStorage persistence)
2. **Context**: `CartProvider` wraps app, provides `useCartContext()` hook
3. **Operations**:
   - `addItem`: Adds item to cart (with toast notification)
   - `removeItem`: Removes item from cart (with toast notification)
   - `updateQuantity`: Updates item quantity
   - `clearCart`: Clears all items (with toast notification)

### Order Placement Flow

1. User clicks "Place Order" in `CartDrawer`
2. `handlePlaceOrder` is called with order data
3. Order is logged to console: `console.log('Order placed:', order)`
4. Cart is cleared via `clearCart()`
5. **No real payment processing** - completely mock/demo-only

## AI Chatbot Integration

### Conditional Rendering

- `ChatAssistantWrapper` only renders if `config.orderOnlineEnabled === true`
- Positioned outside `RestaurantLayout` but inside `CartProvider`

### Chat API

- Route: `/api/chat/route.ts`
- Service: `lib/ai/chatService.ts` + `lib/ai/actionParser.ts`
- Can inspect `menu` and `cart` and trigger cart actions

## Key Files for Phase 3 Modifications

### Theme System
- `lib/themes/index.ts` - Extend Theme interface, add new Owner.com themes
- `components/theme/ThemeProvider.tsx` - Already compatible, no changes needed

### Components Needing Updates
- `components/restaurant/HeroSection.tsx` - Add tagline, CTA button
- `components/layout/RestaurantLayout.tsx` - Update header (logo, name, Order Online label), theme colors
- `components/menu/MenuItemCard.tsx` - Image-forward layout, theme tokens
- `components/menu/MenuSectionList.tsx` / `MenuCategory.tsx` - SEO-friendly headings

### New Components to Create
- `components/restaurant/AboutSection.tsx` - Our Story section
- `components/restaurant/ReviewHighlights.tsx` - Social proof
- `components/restaurant/VipSignupBanner.tsx` - Email capture banner
- `components/restaurant/VipSignupSection.tsx` - Email capture section
- `components/restaurant/SeoContentBlock.tsx` - SEO content block
- `components/seo/JsonLd.tsx` - JSON-LD structured data

### SEO & Metadata
- `lib/seo/restaurantMetadata.ts` - Metadata generation helper (new)
- `lib/seo/schema.ts` - JSON-LD generation helper (new)
- `app/preview/[slug]/page.tsx` - Add `generateMetadata` function

### Analytics
- `lib/analytics/events.ts` - Event tracking helpers (new)

## Error Handling Patterns

### 404 Handling
- `loadRestaurant()` throws error if restaurant not found
- Preview page catches error and calls `notFound()` (Next.js 404)

### Missing Optional Data
- `heroImage`: HeroSection checks `config.heroImage` before rendering image
- `logo`: Not currently used in header (will be added in Phase 3)
- `email`: Footer conditionally renders email if present

### Theme Fallback
- `getTheme(themeKey)` returns `themes['sushi-dark']` if key not found
- No error thrown for invalid theme keys (graceful fallback)

## Constraints and Limitations

### Prototype-Only Constraints
- **No real payment processing**: All orders are mock/demo-only
- **No POS integration**: Orders only logged to console
- **No live order routing**: No backend persistence
- **Cart persistence**: Only localStorage (client-side only)

### Current Limitations
- Theme interface missing `accent` color token
- No optional shape tokens (radii, etc.)
- MenuItemCard has placeholder image implementation
- Header doesn't display logo/restaurant name
- OrderButton labeled "Cart" instead of "Order Online"
- No SEO metadata generation
- No JSON-LD structured data
- No analytics event tracking
- No social proof components
- No email capture components

## Phase 3 Implementation Strategy

1. **Extend Theme System**: Add `accent` color, optional shape tokens, new Owner.com themes
2. **Wire Themes Through Components**: Replace hard-coded colors with theme tokens
3. **Enhance Hero Section**: Add tagline, primary CTA
4. **Update Header**: Logo/name, "Order Online" label, theme colors
5. **Refine Menu Cards**: Image-forward layout, theme tokens
6. **Add New Components**: About, Reviews, Capture, SEO content
7. **Add SEO Support**: Metadata, JSON-LD, content blocks
8. **Add Analytics**: Event tracking for key interactions

## Dependencies

- **Next.js 16**: Server components, async components, `generateMetadata`
- **React 19**: Context API, hooks
- **Zod**: Schema validation
- **Tailwind CSS**: Styling (theme tokens are Tailwind class strings)
- **Vitest**: Testing framework

## Testing Strategy

- **Unit Tests**: Theme functions, schema validation, helpers
- **Component Tests**: React Testing Library for component rendering
- **Integration Tests**: Preview page rendering, cart flow, theme application
- **Safe Test Execution**: Use Vitest JSON output (no piping)

