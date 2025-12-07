## Phase 3 Master Plan (Redacted) — Upgrading `restaurant-platform-core` Preview with Owner.com Principles

### 1. Objectives

- **Primary goal**: Retrofit the existing `restaurant-platform-core` preview experience so it systematically follows Owner.com's proven conversion, UX, and SEO/AI patterns.
- **Secondary goals**:
  - **Increase perceived quality and conversion readiness** of the `/preview/[slug]` demo so it feels like a polished, production-ready Owner-style site **while still being a prototype**.
  - **Bake Owner.com-aligned structure** (themes, hero, nav, menu, content, metadata, schema, analytics) directly into the existing React/Next.js components instead of adding a separate planner app.
  - **Respect the current architecture**: keep the existing loaders, `RestaurantConfig` schema, cart flow, and AI chatbot from Phase 2, and layer improvements on top.

**Non-goals / constraints**:

- Do **not** implement real payment processing, POS integration, or live order routing in this application.
- All ordering flows remain **mock/demo-only**: orders can be logged, shown in confirmation modals, and used for analytics events, but are not persisted or sent to real systems.
- The app continues to function as a **prototype/preview tool**, not as the production ordering platform itself.

---

### 2. Current State (What Exists Today)

This plan is grounded in the current codebase structure:

- **Preview route**: `app/preview/[slug]/page.tsx`
  - Loads data via `loadRestaurant(slug)` from `lib/loaders/restaurant`.
  - Receives `{ config, menu }` where:
    - `config` is a `RestaurantConfig` (`lib/schemas/restaurant.ts`).
    - `menu` is a `Menu` schema (`lib/schemas/menu.ts`).
  - Renders:
    - `ToastProvider` → `CartProvider` → `RestaurantLayout`.
    - Inside `RestaurantLayout`: `HeroSection`, `MenuSectionList`, `HoursAndLocation`.
    - `ChatAssistantWrapper` (AI ordering assistant) when `config.orderOnlineEnabled` is true.

- **Layout & theming**:
  - `RestaurantLayout` (`components/layout/RestaurantLayout.tsx`)
    - Wraps children in `RestaurantThemeProvider` (`components/theme/ThemeProvider.tsx`).
    - Provides a sticky header with `OrderButton` and a footer showing address, hours, and contact from `RestaurantConfig`.
    - Manages `CartDrawer` state and wires it to `useCartContext`.
  - `RestaurantThemeProvider` injects a `Theme` object from `lib/themes` based on `config.theme`.
  - Components like `HeroSection` and `CallToActionBar` use `useTheme()` (color + typography tokens).

- **Ordering & cart (Phase 2)**:
  - `useCart` (`components/order/useCart.ts`): cart state, localStorage, add/remove/update/clear.
  - `CartProvider` / `useCartContext` (`components/order/CartProvider.tsx`).
  - `OrderButton`, `CartDrawer`, `CheckoutForm`, `OrderConfirmationModal` in `components/order/`.

- **AI chatbot-assisted ordering (Phase 2)**:
  - `ChatAssistant`, `ChatAssistantWrapper`, `ChatMessage`, `ChatInput` in `components/chat/`.
  - `/api/chat` route (`app/api/chat/route.ts`) and `lib/ai/chatService.ts` + `lib/ai/actionParser.ts`.
  - Chatbot can inspect the `menu` and `cart` and trigger cart actions via `useCartContext`.

**Phase 3 must work within this reality.** We are not adding a separate Python planner; instead, we refine these components and configs to reflect Owner.com patterns.

---

### 3. Design System: Aligning `Theme` with Owner.com

#### 3.1. Extend Existing `Theme` Type (lib/themes)

- **Goal**: Make the existing `Theme` type express Owner-style design tokens (without inventing a parallel system).
- **Actions**:
  - Extend `Theme` in `lib/themes.ts` (or equivalent) to ensure it includes:
    - **Color tokens** used today (`theme.colors.background`, `text`, `textMuted`, `primary`, etc.), aligned to:
      - `background`: page/hero background.
      - `surface`: card backgrounds.
      - `primary`: main CTA/button background.
      - `accent`: secondary emphasis.
      - `text`, `textMuted`: headings vs body/supporting text.
      - `border`: section & card borders.
    - **Typography tokens** (`theme.typography.heading`, etc.):
      - Heading vs body font families.
      - Weight scale for headings, body, buttons.
    - **Spacing & shape**: add optional fields if needed (e.g. `radii.card`, `radii.button`, standardized paddings), but re-use Tailwind spacing where possible.
  - Ensure `HeroSection`, `CallToActionBar`, `MenuItemCard`, and layout components consistently pull from `Theme` instead of hard-coded colors/classes where feasible.

#### 3.2. Owner-Inspired Theme Variants

- **Goal**: Provide a small set of ready-made theme variants that map directly to Owner.com-style families.
- **Actions**:
  - In `lib/themes.ts` (or wherever `getTheme` and the theme record live):
    - Define 3–4 named themes (e.g. `"warm-pizza"`, `"modern-sushi"`, `"breakfast-diner"`, `"fast-casual"`).
    - For each theme, choose colors/typography consistent with the research in `owner-com-research.md` and Phase 3 master plan.
  - Ensure `RestaurantConfig.theme` is used to select among these variants in `RestaurantThemeProvider`.
  - For demo purposes, pick one or two restaurants in `data/` to showcase each family.

---

### 4. UX & Layout Retrofits (Using Existing Components)

#### 4.1. Hero Section & Above-the-Fold (`HeroSection`, `HoursAndLocation`, `RestaurantLayout`)

- **Current**: `HeroSection` renders hero image, restaurant name, and cuisine; `HoursAndLocation` shows details further down.
- **Goal**: Bring Owner.com-style clarity and CTAs into the hero/above-the-fold region using existing components plus small extensions.
- **Actions**:
  - Enhance `HeroSection` to support:
    - Optional **tagline/benefit line** that can be derived from `config.cuisine`, `config.city` (e.g. “Authentic [cuisine] in [city]”).
    - Optional **primary CTA area** that can host `CallToActionBar` or a themed button (“Order Online”).
  - Option A (minimal change):
    - Keep `HeroSection` focused on visuals + text; add a new `HeroCallToAction` component below it (still using `useTheme`).
  - Ensure key details (address, hours, phone) are quickly visible:
    - Either keep `HoursAndLocation` just below the hero, or add a concise summary row under the headline in `HeroSection`.

#### 4.2. Navigation & Sticky Order CTA (`RestaurantLayout`, `OrderButton`)

- **Current**: `RestaurantLayout` already has a sticky top header with an `OrderButton` labeled “Cart”.
- **Goal**: Make this header and button feel like a primary **Order Online** CTA, following Owner.com patterns.
- **Actions**:
  - Update `RestaurantLayout` header to:
    - Display restaurant logo/name on the left using `config.logo` + `config.name`.
    - Rename/retune `OrderButton` to **Order Online** (while still showing item count badge).
    - Use theme-driven colors/shapes so the button stands out as the primary CTA.
  - Consider adding a mobile-friendly sticky bar at the bottom (reusing `OrderButton`) for an always-available order entry point.

#### 4.3. Menu Presentation (`MenuSectionList`, `MenuCategory`, `MenuItemCard`)

- **Current**: Menu categories and items already render via `MenuSectionList`, `MenuCategory`, `MenuItemCard` using the `Menu` schema.
- **Goal**: Make menu sections and cards match Owner.com’s image-forward, conversion-optimized style.
- **Actions**:
  - Refine `MenuItemCard` to:
    - Ensure a consistent image area when item images exist (aspect ratio from theme or Tailwind classes).
    - Present name → description → price → Add to Cart button with clear hierarchy.
    - Align button styling with theme `primary` colors.
  - Ensure `MenuSectionList` / `MenuCategory`:
    - Render category titles as `H2` headings for SEO.
    - Optionally allow short intro copy per category (even if static/demo for now).

#### 4.4. Social Proof & Story (New Small Components)

- **Current**: No dedicated testimonial or about-story components in preview.
- **Goal**: Add small, optional modules that can be dropped into the preview flow to mimic Owner.com’s story + review blocks.
- **Actions**:
  - Create lightweight components under `components/restaurant/` such as:
    - `AboutSection`: uses `config` + extra mock data to display an “Our Story” block.
    - `ReviewHighlights`: static/demo content showing a rating + 1–3 review snippets.
  - Insert these components into the preview layout below the menu, behind simple flags in the loaded config (or just always-on for demo).

#### 4.5. Direct Ordering vs Marketplaces (Demo-Level)

- **Current**: Cart and checkout are internal-only; no marketplace links.
- **Goal**: Showcase that first-party ordering is primary, while still optionally demonstrating how marketplaces could be linked.
- **Actions**:
  - Keep all primary CTAs (header `OrderButton`, hero CTA, menu card buttons) wired to `CartProvider` / `CartDrawer`.
  - Optionally add a small **“More ways to order”** section in the footer or below the hero that lists stub URLs for DoorDash/Uber Eats, styled as secondary links.

#### 4.6. Loyalty, Email/SMS Capture (Demo Modules)

- **Current**: No capture components in preview.
- **Goal**: Visually demonstrate Owner-style capture patterns, with mock handlers.
- **Actions**:
  - Add simple capture components (e.g. `VipSignupBanner`, `VipSignupSection`) under `components/restaurant/`, themed via `useTheme`.
  - Place them near the hero or above the footer in `RestaurantLayout` or as part of child content.
  - Hook form submissions to:
    - `ToastProvider` to show success messages.
    - Console logs (no real back-end integration needed for demo).

#### 4.7. Multi-Location & Brand Views (Optional for This Phase)

- **Current**: `RestaurantConfig` models a single restaurant; no explicit multi-location UX.
- **Goal**: Lay basic groundwork to later showcase multi-location patterns without overhauling the data model.
- **Actions** (optional/phase 3b):
  - Add a separate preview route (e.g. `/preview/brand/[slug]`) that renders a brand overview + a hard-coded list of “locations”.
  - Use existing layout + new simple components to render each location with address, hours summary, and an “Order from this location” button linking back to `/preview/[slug]` for a specific config.

---

### 5. SEO & AI Search Structure (Within the Next.js App)

> Note: Today, `app/preview/[slug]/page.tsx` doesn’t set explicit SEO metadata or JSON-LD; Phase 3 introduces this without changing the data loaders.

#### 5.1. Metadata Helpers

- **Goal**: Generate Owner-style titles/descriptions from `RestaurantConfig` and attach them to preview pages.
- **Actions**:
  - Add a small helper in `lib/seo/restaurantMetadata.ts` (or similar):
    - `buildRestaurantMetadata(config: RestaurantConfig, pageType: 'home' | 'menu' | 'catering' | 'index')`.
    - Implement the templated patterns from the original master plan (name + cuisine + city + “Order Online”, etc.).
  - Use Next.js `generateMetadata` in `app/preview/[slug]/page.tsx` (or a wrapper) to set these values.

#### 5.2. Heading & Content Requirements

- **Goal**: Ensure H1/H2 usage and text content in preview pages follow the Owner.com structure.
- **Actions**:
  - Make `HeroSection`’s main title the **H1** for the page (already true in practice).
  - Ensure `MenuCategory` headings are rendered as `H2`.
  - Add a simple `SeoContentBlock` component that can render 1–2 paragraphs describing the restaurant and cuisine (even if the text is mocked initially), placed below the hero.

#### 5.3. Structured Data (JSON-LD Hooks)

- **Goal**: Show how production-ready sites would expose machine-readable restaurant facts.
- **Actions**:
  - Add a JSON-LD generation helper (e.g. `lib/seo/schema.ts`) that can build a minimal `@type: Restaurant` object from `RestaurantConfig`.
  - Add a small React component (e.g. `JsonLd`) that renders `<script type="application/ld+json">` in the preview page when enabled.
  - Optionally gate this behind a config flag or environment check so it’s easy to toggle.

---

### 6. Analytics & Event Instrumentation (Front-End Only)

- **Goal**: Demonstrate that key interactions in the demo are trackable, even if they currently only log to the console or a simple in-memory logger.
- **Actions**:
  - Define a lightweight event helper in `lib/analytics/events.ts` with functions like:
    - `trackViewRestaurant(config)`, `trackViewMenuCategory(categoryName)`, `trackAddToCart(item)`, `trackStartCheckout()`, etc.
  - Call these helpers from:
    - `app/preview/[slug]/page.tsx` (page view).
    - `MenuItemCard` (add to cart).
    - `CartDrawer` (start checkout, complete order).
    - Any future loyalty or marketplace links.
  - For now, have these helpers log structured events to `console.log`; later they can be wired to a real analytics backend.

---

### 7. Implementation Sequence (Tied to Current Code)

1. **Theme & tokens**
   - Extend `Theme` in `lib/themes` to fully support Owner-style tokens.
   - Audit `HeroSection`, `RestaurantLayout`, `MenuItemCard`, `CallToActionBar` and replace hard-coded styles with theme-driven ones.

2. **Hero + nav + menu retrofits**
   - Enhance `HeroSection` and `RestaurantLayout` header to include tagline, brand identity, and a clearly labeled **Order Online** CTA.
   - Refine `MenuSectionList` / `MenuItemCard` for image-forward cards and consistent H2 headings.

3. **Add story, social proof, and capture modules**
   - Introduce `AboutSection`, `ReviewHighlights`, and capture components in `components/restaurant/`.
   - Insert them into the preview flow using existing layout.

4. **SEO & JSON-LD**
   - Implement `buildRestaurantMetadata` and wire it via `generateMetadata`.
   - Add minimal JSON-LD support via a `JsonLd` component in the preview page.

5. **Analytics hooks**
   - Implement `lib/analytics/events.ts` and add event calls in cart, hero, and menu components.

6. **Optional multi-location demo route**
   - If needed for sales demos, add a simple `/preview/brand/[slug]` route and small components to illustrate multi-location UX.

This version of the plan is intentionally constrained by the current `restaurant-platform-core` implementation: it reuses `RestaurantConfig`, the existing theme and layout components, the Phase 2 cart + chatbot flows, and focuses Phase 3 purely on bringing in Owner.com’s design, UX, SEO, and analytics patterns.
