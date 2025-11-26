# Phase 1 Execution-Ordered Task List

> This file translates `master-plan.md` into granular, execution-ordered tasks intended for AI agents. 
> Tasks are ordered so that dependencies are satisfied as you move down the list.

## Conventions
- Each task has an **ID** in brackets (e.g., `[T-001]`).
- "Depends on" references must be completed before starting a task.
- Tests should be added/updated as part of each task where specified.

---

## Stage A — Tooling & Baseline App Health (Prep for all later phases)

1. **[T-001] Install remaining core dependencies**  
   - Depends on: none (requires working Next.js app).  
   - Actions:
     - Add `zod`, `@tanstack/react-query-devtools`, and a test runner (`vitest` + `@testing-library/react` + `@testing-library/jest-dom`) to `package.json` and install.  
     - Add an npm script `"test": "vitest"` and `"test:watch": "vitest --watch"`.  

2. **[T-002] Configure testing environment (Vitest + React Testing Library)**  
   - Depends on: [T-001].  
   - Actions:
     - Create `vitest.config.ts` with Next.js/React-compatible setup (JSX + TypeScript + alias `@/*`).  
     - Create `test/setup-tests.ts` to import `@testing-library/jest-dom`.  
     - Ensure tests under `test/` or `__tests__/` are picked up by Vitest.  

3. **[T-003] Add a minimal sanity test for the app root**  
   - Depends on: [T-002].  
   - Actions:
     - Add a test file `test/app-root.spec.tsx` that renders the default `app/page.tsx` and asserts a known text is present.  
     - Run `npm test` and ensure it passes.

4. **[T-004] Ensure ESLint works in CI-style usage**  
   - Depends on: none.  
   - Actions:
     - Run `npm run lint` locally and fix any outstanding lint errors.  
     - Ensure lint can run without interactive prompts.

---

## Stage B — Phase 0: Bootstrap the Core App

5. **[T-010] Align dependencies with Phase 0 plan**  
   - Depends on: [T-001].  
   - Actions:
     - Confirm that `@tanstack/react-query`, `@tanstack/react-query-devtools`, and `zod` are installed at compatible versions.  
     - Optionally add `@tanstack/react-table` as a future dependency but do not use it yet.

6. **[T-011] Implement TanStack Query provider with devtools**  
   - Depends on: [T-010].  
   - Actions:
     - Update `app/providers.tsx` to match the `master-plan.md` design:
       - `"use client"` at top.
       - Use `QueryClient`, `QueryClientProvider`, `ReactQueryDevtools`, and `useState` to create a single client instance.  
     - Export `Providers({ children })` that wraps children in `QueryClientProvider` and renders `ReactQueryDevtools` with `initialIsOpen={false}`.
     - Update `app/layout.tsx` to wrap the body contents with `<Providers>`.  
   - Tests:
     - Add a test `test/providers.spec.tsx` that renders a dummy child inside `Providers` and asserts it renders without error.

7. **[T-012] Create base AppShell layout component**  
   - Depends on: [T-011], [T-004].  
   - Actions:
     - Create `components/layout/AppShell.tsx` (server or client component depending on needs) that renders:
       - A header region (placeholder logo/title + nav area).  
       - A main container area for children.  
       - A footer region with placeholder text.  
     - Use Tailwind utility classes for a basic but clean layout.  
   - Tests:
     - Add `test/components/AppShell.spec.tsx` to assert header, main, and footer render.

8. **[T-013] Wire `(preview)` layout using AppShell**  
   - Depends on: [T-012].  
   - Actions:
     - Create `app/(preview)/layout.tsx` that wraps its `children` with `AppShell`.  
     - Ensure it composes with `RootLayout` (so providers and fonts still apply).  
   - Tests:
     - Add a small integration test that renders a dummy page using the preview layout and asserts the AppShell elements appear.

---

## Stage C — Phase 1: Domain Modeling (Menu & Restaurant Config)

9. **[T-020] Create `lib/schemas` directory structure**  
   - Depends on: [T-001].  
   - Actions:
     - Create `lib/` and `lib/schemas/` if they do not already exist.  

10. **[T-021] Implement `menu.ts` Zod schemas**  
    - Depends on: [T-020].  
    - Actions:
      - Create `lib/schemas/menu.ts` implementing:
        - `modifierOptionSchema` with fields `id?`, `name`, `priceDelta` (default 0).  
        - `modifierGroupSchema` with fields `id?`, `name`, `min?`, `max?`, `options[]`.  
        - `menuItemSchema` with fields `id`, `name`, `description?`, `price`, `image?`, `tags?[]`, `modifiers?[]`.  
        - `menuCategorySchema` with fields `id`, `name`, `description?`, `items[]`.  
        - `menuSchema` with fields `id`, `name`, `currency` (default "USD"), `categories[]`.  
      - Export the `Menu` type via `z.infer<typeof menuSchema>`.  
    - Tests:
      - Add `test/schemas/menu-schema.spec.ts` to verify:
        - A valid sample object passes `.parse`.  
        - Invalid objects (e.g., missing `id` on menu item) throw validation errors.

11. **[T-022] Implement `restaurant.ts` Zod schemas**  
    - Depends on: [T-020].  
    - Actions:
      - Create `lib/schemas/restaurant.ts` implementing:
        - `hoursSchema` as a record keyed by `"mon" | ... | "sun"` with string values like `"11:00-21:00"`.  
        - `restaurantConfigSchema` with fields from the master plan (`id`, `name`, `slug`, address fields, `phone`, `email?`, `hours`, `cuisine`, `theme`, `heroImage?`, `logo?`, `orderOnlineEnabled` default `false`).  
      - Export `RestaurantConfig` via `z.infer<typeof restaurantConfigSchema>`.  
    - Tests:
      - Add `test/schemas/restaurant-schema.spec.ts` validating a good object and a few bad ones (e.g., invalid day key, missing `slug`).

12. **[T-023] Add index barrel for schemas (optional but helpful)**  
    - Depends on: [T-021], [T-022].  
    - Actions:
      - Create `lib/schemas/index.ts` exporting `menuSchema`, `restaurantConfigSchema`, and types.  

13. **[T-024] Create data directory structure for restaurants**  
    - Depends on: [T-021], [T-022].  
    - Actions:
      - Create `data/restaurants/so-delicious/` directory.  
      - Add empty placeholder files `config.json` and `menu.json` (to be filled later).  

14. **[T-025] Populate `config.json` for `so-delicious`**  
    - Depends on: [T-024].  
    - Actions:
      - Fill `data/restaurants/so-delicious/config.json` with realistic example data matching `restaurantConfigSchema`.  
      - Include `theme` set to an existing or planned theme key (e.g., `"sushi-dark"`).  
    - Tests:
      - Add a test `test/data/so-delicious-config.spec.ts` that:
        - Reads the JSON file.  
        - Parses it via `restaurantConfigSchema.parse` and expects no error.

15. **[T-026] Populate `menu.json` for `so-delicious`**  
    - Depends on: [T-024], [T-021].  
    - Actions:
      - Fill `data/restaurants/so-delicious/menu.json` with a small but realistic menu that exercises modifiers, categories, etc.  
    - Tests:
      - Add `test/data/so-delicious-menu.spec.ts` that parses via `menuSchema.parse` and expects no error.

---

## Stage D — Phase 2: Core UI Components (Template Library)

16. **[T-030] Create `components/layout/RestaurantLayout.tsx`**  
    - Depends on: [T-022], [T-012].  
    - Actions:
      - Implement `RestaurantLayout` that accepts `config: RestaurantConfig` and `children`.  
      - Render:
        - Header with logo or restaurant name + navigation stub.  
        - Footer with address, hours, and phone.  
        - Main area that renders `children`.  
    - Tests:
      - Add `test/components/RestaurantLayout.spec.tsx` that passes a mock `RestaurantConfig` and asserts header/footer pieces render.

17. **[T-031] Implement menu category component**  
    - Depends on: [T-021].  
    - Actions:
      - Create `components/menu/MenuCategory.tsx` that takes a single category and renders its name, description, and iterates items.  
      - Keep styling generic and themeable (accept `className` prop).  

18. **[T-032] Implement menu item card component**  
    - Depends on: [T-021].  
    - Actions:
      - Create `components/menu/MenuItemCard.tsx` that renders a single menu item, including:
        - Title, description, price.  
        - Tags if present.  
        - A placeholder control for modifiers (do not implement full selection yet).  

19. **[T-033] Implement menu section list**  
    - Depends on: [T-031], [T-032], [T-021].  
    - Actions:
      - Create `components/menu/MenuSectionList.tsx` that accepts a `Menu` object and maps over `categories` rendering `MenuCategory` and `MenuItemCard` instances.  
    - Tests:
      - Add `test/components/MenuSectionList.spec.tsx` using a small in-test menu object to ensure categories and items render.

20. **[T-034] Implement home page blocks (Hero, FeaturedItems, HoursAndLocation, CallToActionBar)**  
    - Depends on: [T-022].  
    - Actions:
      - Create `components/restaurant/HeroSection.tsx` that takes `RestaurantConfig` and renders hero image, title, and tagline.  
      - Create `components/restaurant/FeaturedItems.tsx` that takes a subset of `Menu` or list of items.  
      - Create `components/restaurant/HoursAndLocation.tsx` that formats hours and address from `RestaurantConfig`.  
      - Create `components/restaurant/CallToActionBar.tsx` with a primary action (e.g., "Order Now").  
    - Tests:
      - Add one test per component asserting basic render and key text fields.

21. **[T-035] Implement non-functional ordering UI prototype**  
    - Depends on: [T-032], [T-033].  
    - Actions:
      - Create `components/order/CartDrawer.tsx` with basic open/close state and a list of items (provided via props).  
      - Create `components/order/OrderButton.tsx` that toggles the cart or triggers a provided click handler.  
      - Create `components/order/CheckoutForm.tsx` with basic form fields (name, phone, notes) and `onSubmit` callback; no backend.  
      - For now, manage cart state inside a parent demo component using `useState`.  
    - Tests:
      - Add tests checking that clicking `OrderButton` toggles the cart when wired up, and that `CheckoutForm` calls `onSubmit` with form data.

---

## Stage E — Phase 3: Routing & Preview Pages

22. **[T-040] Implement filesystem-based restaurant loader**  
    - Depends on: [T-021], [T-022], [T-025], [T-026].  
    - Actions:
      - Create `lib/loaders/restaurant.ts` implementing `loadRestaurant(slug: string)` exactly as in `master-plan.md` (using `fs`, `path`, and the Zod schemas).  
      - Ensure it works in a Node environment (server-side only).  
    - Tests:
      - Add `test/loaders/restaurant-loader.spec.ts` that:
        - Calls `loadRestaurant("so-delicious")`.  
        - Asserts the returned `config` and `menu` match expected key properties.

23. **[T-041] Create `app/preview/[slug]/page.tsx` route**  
    - Depends on: [T-030], [T-033], [T-034], [T-040].  
    - Actions:
      - Implement the route as specified:
        - Call `loadRestaurant(params.slug)`.  
        - Render `RestaurantLayout` with `config`.  
        - Inside, render `HeroSection`, `MenuSectionList`, and optionally other blocks.  
    - Tests:
      - Add an integration test using Next.js testing utilities or a mocked module to ensure that given a fake `loadRestaurant` result, the page renders expected content.

24. **[T-042] Ensure `/preview/so-delicious` runs locally**  
    - Depends on: [T-041].  
    - Actions:
      - Run `npm run dev` and manually verify that `/preview/so-delicious` loads without runtime errors.  
      - (For automation) add a minimal Playwright or Cypress e2e test later as needed.

---

## Stage F — Phase 4: Theme System

25. **[T-050] Define theme tokens**  
    - Depends on: [T-022].  
    - Actions:
      - Create `lib/themes/index.ts` and define `Theme` type and `themes` record (`"sushi-dark"`, `"cafe-warm"`, etc.) as in the master plan.  

26. **[T-051] Implement `RestaurantThemeProvider` and `useTheme` hook**  
    - Depends on: [T-050].  
    - Actions:
      - Create `components/theme/ThemeProvider.tsx` as a client component.  
      - Implement `RestaurantThemeProvider({ themeKey, children })` that selects a theme from `themes` and provides it via context.  
      - Implement `useTheme()` that reads from context and throws if used outside the provider.  
    - Tests:
      - Add `test/theme/ThemeProvider.spec.tsx` to verify the correct theme is exposed and fallback behavior when an unknown theme is passed.

27. **[T-052] Wrap `RestaurantLayout` with `RestaurantThemeProvider`**  
    - Depends on: [T-030], [T-051].  
    - Actions:
      - Update `RestaurantLayout` so that it wraps its content in `RestaurantThemeProvider` using `config.theme`.  

28. **[T-053] Apply theme classes in components**  
    - Depends on: [T-051], [T-052].  
    - Actions:
      - In layout and restaurant components (Hero, FeaturedItems, etc.), call `useTheme()` and apply Tailwind classes from the theme object to root containers, headings, and key elements.  
      - Ensure class composition works well with optional `className` props.  
    - Tests:
      - Extend existing component tests to assert relevant theme class names appear when a theme is provided.

---

## Stage G — Phase 5: AI Menu Ingestion Tooling (Skeleton)

29. **[T-060] Create ingestion directories**  
    - Depends on: [T-021].  
    - Actions:
      - Create `ingestion/input/` and `ingestion/output/` directories (can be empty in git with `.gitkeep`).

30. **[T-061] Implement `scripts/ingest-menu.ts` skeleton**  
    - Depends on: [T-060], [T-021].  
    - Actions:
      - Create `scripts/ingest-menu.ts` as described:
        - Parse CLI args: `inputFile`, `restaurantSlug`.  
        - Read raw text from input file.  
        - Call a placeholder `callLLMToGenerateMenuJson(raw)` (to be implemented later).  
        - Validate with `menuSchema`.  
        - Write `menu.json` to `data/restaurants/<slug>/menu.json`, creating directories as needed.  
      - Export `callLLMToGenerateMenuJson` from a separate module (e.g., `scripts/llm-menu.ts`) as a stub so it can be implemented by future agents.  
    - Tests:
      - Add `test/scripts/ingest-menu.spec.ts` that mocks `callLLMToGenerateMenuJson` to return known JSON, runs the script logic, and verifies the output file is written and valid.

31. **[T-062] Document LLM prompt template entry point**  
    - Depends on: [T-061].  
    - Actions:
      - Create `docs/ai/prompts.md` with a section "Menu Extraction Prompt", specifying input format, output JSON shape, and rules (no hallucinations, preserve order, etc.).  
      - Reference the `callLLMToGenerateMenuJson` function as the implementation target.

---

## Stage H — Phase 6: Restaurant Scaffolding & Per-Restaurant Repos

32. **[T-070] Create `templates/site` minimal Next app structure**  
    - Depends on: [T-041], [T-050].  
    - Actions:
      - Add `templates/site/app`, `templates/site/components`, `templates/site/lib`, and `templates/site/data`.  
      - Include a minimal Next.js app (can be adapted from the core app) that reads local `data/menu.json` and `data/config.json`.  
      - Use a simplified layout and components referencing the core design patterns.  

33. **[T-071] Add placeholder data files in template site**  
    - Depends on: [T-070].  
    - Actions:
      - Add `templates/site/data/menu.json` and `templates/site/data/config.json` with simple placeholder content and TODO comments.  

34. **[T-072] Implement `scripts/scaffold-site.ts` CLI**  
    - Depends on: [T-070], [T-071], [T-040].  
    - Actions:
      - Implement CLI with inputs: `restaurantSlug`, `outputPath`.  
      - Copy `templates/site` to `outputPath`.  
      - Copy `data/restaurants/<slug>/menu.json` and `config.json` into the new site's `data` directory.  
      - Replace placeholders in the new site's `package.json`, `next.config`, etc., with restaurant-specific values (name, slug).  
    - Tests:
      - Add `test/scripts/scaffold-site.spec.ts` that runs the CLI in a temp directory and asserts:
        - Files are copied.  
        - Data files exist and contain expected content.  

35. **[T-073] Document scaffolding usage**  
    - Depends on: [T-072].  
    - Actions:
      - Create `docs/scaffolding.md` describing the 3-step flow: ingest menu, scaffold site, run new site.  

---

## Stage I — Phase 7: Demo Restaurant Implementations

36. **[T-080] Finalize `so-delicious` demo data & theme**  
    - Depends on: [T-025], [T-026], [T-050].  
    - Actions:
      - Refine `config.json` and `menu.json` for `so-delicious` to look production-quality.  
      - Ensure `theme` in `config.json` maps to a defined theme (e.g., `"sushi-dark"`).  

37. **[T-081] Polish `so-delicious` preview page**  
    - Depends on: [T-041], [T-053], [T-080].  
    - Actions:
      - Adjust layout components, hero imagery, and sections so `/preview/so-delicious` looks like a complete restaurant site.  

38. **[T-082] Implement second restaurant demo data**  
    - Depends on: [T-021], [T-022], [T-050].  
    - Actions:
      - Create `data/restaurants/<second-slug>/config.json` and `menu.json` with a different cuisine and theme.  
      - Add or tweak theme tokens (e.g., `"cafe-warm"`).  

39. **[T-083] Wire preview route for second restaurant**  
    - Depends on: [T-082], [T-041].  
    - Actions:
      - Verify `/preview/<second-slug>` works with the second restaurant data and theme.  

40. **[T-084] Implement `useCart` hook and realistic cart behavior**  
    - Depends on: [T-035], [T-033].  
    - Actions:
      - Create `components/order/useCart.ts` managing cart items (add, remove, update quantity, clear).  
      - Integrate `useCart` into preview pages so that selecting items updates the cart.  
      - Add a mock "Place order" action that logs or toasts a success message.  
    - Tests:
      - Add `test/order/useCart.spec.ts` to cover cart operations.

---

## Stage J — Phase 8: Internal Docs for AI Agents & Yourself

41. **[T-090] Write `docs/architecture.md`**  
    - Depends on: major architecture pieces up to [T-084].  
    - Actions:
      - Document the purpose of `restaurant-platform-core`, the data flow from `config.json`/`menu.json` → preview → scaffolded site, the theme system, and ingestion pipeline.

42. **[T-091] Write `docs/ai-tasks.md`**  
    - Depends on: [T-061], [T-072], [T-053].  
    - Actions:
      - List concrete future AI-suitable tasks (implementing `callLLMToGenerateMenuJson`, adding a third theme, improving `MenuItemCard` styling, adding multi-language support, etc.).

43. **[T-092] Write `docs/demo-playbook.md`**  
    - Depends on: [T-081], [T-083], [T-072].  
    - Actions:
      - Document clearly how to: start the core app, open `/preview/so-delicious`, ingest menus, scaffold a new site, and run/deploy the generated site.  

