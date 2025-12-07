## Phase 3 Execution Order — Upgrading `restaurant-platform-core` Preview with Owner.com Principles

This is the recommended step‑by‑step execution order for implementing Phase 3 **inside the existing Next.js prototype**, using TypeScript/React and automated tests. All ordering remains **mock/demo‑only**; we are not building real payments or live order routing.

Each step should be implemented in a tight red/green/refactor loop:
- Add or extend tests first.
- Implement or update code.
- Run tests and keep them green before moving on.

---

### 0. Orientation & Safety Constraints

1. **Review current preview architecture**
   - Read `app/preview/[slug]/page.tsx` to understand how `config` and `menu` are loaded and rendered.
   - Review `RestaurantLayout`, `HeroSection`, `MenuSectionList`, `HoursAndLocation`, `RestaurantThemeProvider`.
   - Skim Phase 2 plan and key components: `useCart`, `CartProvider`, `CartDrawer`, `OrderButton`, `CheckoutForm`, `OrderConfirmationModal`, `ChatAssistantWrapper`.
   - **Tests**: None (discovery step only).

2. **Confirm prototype‑only constraints**
   - Document (in comments and/or internal docs) that:
     - No payment gateway, POS, or real order routing will be added in Phase 3.
     - All orders remain in‑memory/demo (console logs, confirmation modals, analytics events only).
   - **Tests**: Optionally assert that no new network calls are made to real payment/POS endpoints in any new code.

---

### 1. Theme System & Owner‑Style Theme Variants

3. **Extend `Theme` type and theme utilities**
   - File: `lib/themes.ts` (or equivalent theme definition).
   - Add/verify fields for:
     - `colors`: `background`, `surface`, `primary`, `accent`, `text`, `textMuted`, `border`.
     - `typography`: at least `heading` and `body` styles.
     - Optional shape/spacing tokens if helpful (e.g. `radii.card`, `radii.button`).
   - Keep API compatible with `RestaurantThemeProvider` and `useTheme`.
   - **Tests**:
     - Unit tests for `getTheme(themeKey)` returning a complete `Theme` object for known keys.
     - Snapshot tests for a sample theme to guard against accidental token removal.

4. **Define Owner‑inspired theme variants**
   - In the same theme module, add 3–4 concrete themes, e.g.:
     - `warm-pizza`, `modern-sushi`, `breakfast-diner`, `fast-casual`.
   - For each theme, pick colors/typography based on `owner-com-research.md` and the Phase 3 master plan.
   - Ensure `RestaurantConfig.theme` can reference these keys.
   - **Tests**:
     - For each theme key, assert `getTheme(key)` resolves and has all required color/typography tokens.

5. **Wire themes through Restaurant components**
   - Audit `HeroSection`, `RestaurantLayout`, `MenuItemCard`, `CallToActionBar`, and any other visual components used in preview.
   - Replace ad‑hoc Tailwind classes with theme‑driven classes where appropriate (without breaking layout):
     - Use `theme.colors.*` and `theme.typography.*` for text and button styles.
   - **Tests**:
     - Component tests (e.g. with React Testing Library) that render components under different `themeKey` values and assert appropriate class names are present.

---

### 2. Hero & Navigation Retrofits

6. **Enhance `HeroSection` with tagline & CTA support**
   - File: `components/restaurant/HeroSection.tsx`.
   - Add optional props or derive from `RestaurantConfig`:
     - Tagline/benefit line from `config.cuisine` and `config.city` (e.g. “Authentic [cuisine] in [city]”).
   - Add a dedicated area for a primary CTA (button) to host "Order Online" (for now it can call a callback passed via props or scroll to menu).
   - Keep layout responsive and image‑forward, using theme tokens.
   - **Tests**:
     - Component tests that verify tagline text renders when `cuisine` and `city` are present.
     - Test that CTA button renders with correct label and theme classes when enabled.

7. **Update `RestaurantLayout` header to emphasize ordering CTA**
   - File: `components/layout/RestaurantLayout.tsx`.
   - In the sticky header:
     - Display logo + restaurant name (using `config.logo` and `config.name`) on the left.
     - Retune `OrderButton` label to "Order Online" while still showing the cart badge.
     - Ensure the header uses theme colors so the CTA is visually prominent.
   - Consider a mobile‑friendly sticky bar at the bottom (reuse `OrderButton`) when viewport is small.
   - **Tests**:
     - Component tests that assert the header renders logo/name when provided.
     - Test that `OrderButton` label is "Order Online" and that `itemCount` is surfaced correctly.

---

### 3. Menu Presentation & Category Structure

8. **Refine `MenuItemCard` for image‑forward layout**
   - File: `components/menu/MenuItemCard.tsx`.
   - Ensure each card:
     - Reserves a consistent image area when images exist (e.g. fixed aspect ratio container with `object-cover`).
     - Displays name, short description, price, and Add to Cart button with clear visual hierarchy.
     - Uses theme `primary` for the Add to Cart button.
   - Keep the underlying `Menu` schema unchanged; only adjust presentation.
   - **Tests**:
     - Component tests verifying that given a sample menu item, the card renders expected text and button.
     - Test that image container renders when an image URL is present.

9. **Treat categories as SEO/AI‑friendly sections**
   - Files: `components/menu/MenuSectionList.tsx`, `components/menu/MenuCategory.tsx`.
   - Ensure `MenuCategory` headings are rendered as `h2` elements.
   - Optionally add support for short, static intro copy per category (can be mocked for now).
   - **Tests**:
     - Component tests asserting `h2` tags exist for each category.
     - Snapshot tests to confirm section structure (heading followed by items).

---

### 4. Story, Social Proof, and Capture Modules

10. **Add an `AboutSection` component**
    - File: `components/restaurant/AboutSection.tsx` (new).
    - Use `RestaurantConfig` plus some mock text to render:
      - Heading (e.g. “Our Story”).
      - 1–3 paragraphs of descriptive copy (can be hard‑coded lorem tuned to cuisine for now).
    - Make it theme‑aware (`useTheme`) and suitable for placement below the menu.
    - **Tests**:
      - Component tests verifying heading and paragraphs render.

11. **Add a `ReviewHighlights` component**
    - File: `components/restaurant/ReviewHighlights.tsx` (new).
    - Render static/demo content:
      - Aggregate rating (e.g. "4.8 / 5") and review count.
      - 1–3 short review quotes.
    - Later this can be wired to real data; for now it’s purely presentational.
    - **Tests**:
      - Component tests verifying rating and quotes appear.

12. **Integrate story & social proof into preview layout**
    - Update `app/preview/[slug]/page.tsx` or `RestaurantLayout` children usage to insert:
      - `AboutSection` and `ReviewHighlights` below `MenuSectionList` but above the footer.
    - Ensure they can be toggled via simple flags in the loaded restaurant config (optional for now).
    - **Tests**:
      - Integration test that renders the preview page and asserts that both sections appear for a sample restaurant.

13. **Add simple loyalty/email capture components**
    - Files: `components/restaurant/VipSignupBanner.tsx`, `VipSignupSection.tsx` (new).
    - Banner pattern near hero; section pattern near footer.
    - Forms should:
      - Capture email and/or phone.
      - On submit, call a mock handler that logs to console and uses `ToastProvider` to show success.
    - **Tests**:
      - Component tests that simulate form submission and assert the toast is invoked (can mock toast context).

14. **Wire capture components into layout**
    - Place `VipSignupBanner` near the hero and `VipSignupSection` above the footer in the preview flow.
    - Ensure they are theme‑aware and don’t break small screens.
    - **Tests**:
      - Integration tests verifying these components render in the preview page.

---

### 5. Optional Multi‑Location Demo View

15. **Add brand‑level preview route (optional)**
    - Route: `app/preview/brand/[slug]/page.tsx` (new).
    - Render a brand overview page that:
      - Shows brand name, hero imagery, and a short description.
      - Lists a handful of hard‑coded “locations” with address, hours summary, and an “Order from this location” button linking to existing `/preview/[slug]` pages.
    - **Tests**:
      - Route/component tests verifying the brand page renders and links are present.

---

### 6. SEO & AI Search Structure in the Prototype

16. **Implement SEO metadata helpers**
    - File: `lib/seo/restaurantMetadata.ts` (new).
    - Implement `buildRestaurantMetadata(config: RestaurantConfig, pageType: 'home' | 'menu' | 'catering' | 'index')` using the title/description templates from the master plan.
    - **Tests**:
      - Unit tests for `buildRestaurantMetadata` given sample configs.

17. **Wire metadata into preview route**
    - In `app/preview/[slug]/page.tsx` (or a layout wrapper for preview), add `generateMetadata` that calls `buildRestaurantMetadata`.
    - Ensure the home preview page gets correct title/description; menu/index extensions can be added later.
    - **Tests**:
      - Next.js metadata tests (or unit tests on `generateMetadata`) verifying expected title/description.

18. **Add a simple `SeoContentBlock`**
    - File: `components/restaurant/SeoContentBlock.tsx` (new).
    - Renders 1–2 paragraphs of descriptive copy about the restaurant and cuisine (can be mocked per demo restaurant).
    - Insert below `HeroSection` on the preview page.
    - **Tests**:
      - Component tests verifying text renders and is accessible.

19. **Add minimal JSON‑LD support**
    - File: `lib/seo/schema.ts` (new).
    - Implement a helper to build a basic `@type: Restaurant` JSON‑LD object from `RestaurantConfig` (name, address, phone, hours, cuisine, URL, etc.).
    - Add a `JsonLd` React component to render `<script type="application/ld+json">` in preview pages when enabled.
    - **Tests**:
      - Unit tests verifying the JSON‑LD object structure.
      - Component test that `JsonLd` renders a script tag with valid JSON.

---

### 7. Analytics & Event Instrumentation (Demo‑Level)

20. **Create front‑end analytics helper**
    - File: `lib/analytics/events.ts` (new).
    - Implement simple functions like:
      - `trackViewRestaurant(config)`, `trackViewMenuCategory(categoryName)`, `trackAddToCart(item)`, `trackStartCheckout()`, `trackCompleteOrder(order)`, `trackJoinVip()`, etc.
    - For now, these can log structured objects to `console.log`.
    - **Tests**:
      - Unit tests mocking `console.log` and asserting calls for each event function.

21. **Hook events into existing components**
    - Add event calls in:
      - `app/preview/[slug]/page.tsx` (page view → `trackViewRestaurant`).
      - `MenuItemCard` (add to cart → `trackAddToCart`).
      - `CartDrawer` (start checkout, complete order).
      - Loyalty capture components (`VipSignup*` → `trackJoinVip` / `trackSubmitEmailCapture`).
    - **Tests**:
      - Component tests using spies/mocks on analytics helpers to ensure calls fire on user interactions.

---

### 8. Final Polish & Demo Validation

22. **Polish copy and defaults for demo restaurants**
    - Update demo data in `data/` so at least a couple of restaurants:
      - Use different Owner‑style themes.
      - Have good hero images, menu images, and descriptive copy.
    - **Tests**:
      - Manual QA of `/preview/[slug]` for key demo restaurants (no server hits beyond Next dev server); automated tests already cover structure.

23. **Run full test suite and fix regressions**
    - Run lint, type‑check, and tests.
    - Ensure no regressions from Phase 2 (cart + AI chatbot flows still work as before).
    - **Tests**:
      - `npm run lint`
      - `npm run test` (using the safe JSON‑output Jest/Vitest wrapper per repo guidelines).

This execution order keeps `restaurant-platform-core` clearly in **prototype/demo territory**, while upgrading the preview experience to reflect Owner.com’s best practices in design, UX, SEO/AI structure, and analytics.
