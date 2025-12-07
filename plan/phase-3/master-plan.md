## Phase 3 Master Plan — Aligning With Owner.com Website Strategies

### 1. Objectives

- **Primary goal**: Rework the preview and demo experience in `restaurant-platform-core` so our restaurant sites and landing pages systematically follow the same conversion and SEO/AI patterns Owner.com uses, not just their visual style.
- **Secondary goals**:
  - **Increase direct orders and reservations** by emphasizing clear CTAs and de-emphasizing 3rd-party marketplaces.
  - **Improve organic SEO and AI search visibility** for key intents like “best [cuisine] in [city]”, “[restaurant] menu”, “[restaurant] order online”, “[restaurant] hours”, and “[restaurant] location”.
  - **Create an Owner-compatible design system** so we can rapidly generate “Owner-style” themes from structured tokens.

---

### 2. Design System & Theme Architecture (Owner-Compatible)

Use the research from `owner-com-research.md` as the backbone of our design system.

#### 2.1. Create an Owner-Informed Theme Schema

- **Action**: Define a `RestaurantTheme` schema that captures:
  - **Color tokens**:
    - `background`: warm neutral base
    - `surface`: slightly elevated card background
    - `primary`: strong saturated accent (buttons, key CTAs)
    - `accent`: softer secondary accent
    - `text`: main + subtle text colors
    - `border`: divider and card borders
  - **Typography tokens**:
    - `headingFont`, `bodyFont`
    - `fontSizes` scale (xs–3xl) tuned to Owner-style sizes
    - `fontWeights` (regular, medium, semibold, bold) mapped to headings, buttons, badges
  - **Spacing tokens**:
    - Vertical rhythm (e.g. `xs`, `sm`, `md`, `lg`, `xl`) that matches Owner-like tight-yet-open layouts
    - Section-level spacing vs. component-level spacing
  - **Shape tokens** (from research examples):
    - `radii.card: "md"`
    - `radii.button: "xl"` (large pill-like buttons)
    - `radii.badge: "sm"`
  - **Shadow tokens**:
    - `card.shadow.default`, `card.shadow.hover`
  - **Layout tokens**:
    - `hero.layout` (image-left/text-right, image-right/text-left, full-bleed image)
    - `navigation.layout` (top bar with logo left + CTA right, sticky variants)
    - `menuCard.layout` (image ratio, text alignment, price placement, “Add to cart” placement)

- **Implementation notes**:
  - Integrate this schema into our existing theme provider so all restaurant pages can be skinned by theme objects (including Owner-inspired ones).
  - Ensure the schema is expressive enough to capture at least **3–4 Owner-style families** (e.g. brunch/café, modern sushi, dark steakhouse, warm bistro).

#### 2.2. Identify Owner.com Style Families

Use the example sites listed in `owner-com-research.md` (Metro Pizza, Cyclo Noodles, Doo-Dah Diner, Aburaya, HillCrust Pizza, Township Line Pizza, Talkin’ Tacos, Mattenga’s Pizzeria, Saffron, Sushi Addicts, Sushi Me Roll’n, Goi Cuon, Gyro Concept) to infer design families:

- **Family A — Warm Casual Pizza / Bistro**
  - Warm neutral background, bold red/orange primary, large imagery, family-focused imagery.
- **Family B — Modern Asian / Sushi**
  - Dark or very clean backgrounds, high-contrast typography, strong accent colors (teal, neon, or red), crisp grid layouts.
- **Family C — Breakfast / Diner / Comfort**
  - Light backgrounds, friendly typography, softer accent colors, strong emphasis on community and story.
- **Family D — Fast-Casual / Street Food**
  - High-energy color palettes, bold CTAs, tighter spacing, emphasis on speed and convenience.

- **Action**: For each family, define:
  - A canonical `RestaurantTheme` JSON (colors, type scale, radii, spacing).
  - Base layout presets: hero variant, navigation variant, menu card variant, testimonial placement.

#### 2.3. Extraction & Automation (Future-Facing)

- **Action**: Implement a Playwright/Puppeteer-based extractor (as planned in `owner-com-research.md`):
  - Fetch an Owner.com-powered restaurant site.
  - Target consistent classes/DOM patterns to pull computed styles (colors, fonts, radii).
  - Map raw CSS values into our `RestaurantTheme` schema via an LLM mapping prompt.
  - Store as `owner-[family]-[descriptor].json` themes (e.g. `owner-modern-sushi.json`, `owner-dark-steakhouse.json`).

---

### 3. UX & Layout Changes to Our Restaurant Pages

We want our restaurant pages (and any white-label restaurant microsites) to follow the same UX logic as Owner.com sites.

#### 3.1. Hero Section

- **Patterns to mirror**:
  - Large, appetizing food photography as the hero background or side image.
  - Clear, benefit-driven headline (e.g. “Order Metro Pizza Online” / “Authentic [cuisine] in [city]”).
  - One primary CTA (e.g. **Order Online**, **View Menu**, **Book a Table**) and a secondary CTA if needed.
  - Location and hours surfaced immediately (no scrolling required for essential info).

- **Action items**:
  - Create hero components that support:
    - Layout presets: image-left/text-right, image-right/text-left, full-bleed.
    - Dynamic injection of restaurant name, cuisine, and city for SEO/AI.
    - Configurable primary and secondary CTAs tied to our order/reservation flows.

#### 3.2. Navigation & Sticky Header

- **Patterns to mirror**:
  - Simple top navigation with logo, main sections (Menu, About, Locations, Catering), and a visually prominent “Order Online” CTA.
  - On mobile: sticky bottom or top CTA for ordering and calling the restaurant.

- **Action items**:
  - Implement a **sticky ordering CTA** on mobile and desktop (configurable but enabled by default).
  - Support a minimal nav when used as a standalone restaurant microsite vs. embedded in our broader `restaurant-platform-core` product.

#### 3.3. Menu Presentation & Ordering

- **Patterns to mirror**:
  - Image-forward menu items: dish photo, short description, price, and quick “Add to cart”.
  - Logical grouping of menu categories (Starters, Mains, Desserts, Drinks, etc.).
  - Upsells and modifiers (extras, combos, sides) surfaced in a clean, concise modal or drawer.

- **Action items**:
  - Standardize **menu card components** with:
    - Optional image area with consistent aspect ratios (e.g. 4:3, 1:1).
    - Clear hierarchy: title, description, price, action button.
  - Add **category landing sections** (with short intro copy for SEO and AI context).
  - Instrument events (view menu, add-to-cart, start checkout) for analytics and optimization.

#### 3.4. Social Proof & Story Sections

- **Patterns to mirror**:
  - Prominent testimonials, reviews, and ratings.
  - Short “About” story explaining the restaurant’s history, cuisine, and unique value.

- **Action items**:
  - Create drop-in **testimonial/review modules** that can pull:
    - Aggregate rating, review snippets.
    - Logos of press/awards where applicable.
  - Standardize an **About section** pattern:
    - Heading + 1–3 paragraphs + 1–3 images.
    - SEO/AI friendly copy describing cuisine, neighborhood, and differentiators.

#### 3.5. Direct Ordering Emphasis & Repeat-Order Flows

From reviewing additional Owner.com examples (Cyclo Noodles, Saffron, Talkin’ Tacos, Sushi Addicts), a consistent pattern is aggressive emphasis on **first-party ordering** and frictionless **repeat orders**.

- **Patterns to mirror**:
  - “Order Online” is the primary CTA across hero, nav, sticky bars, and mobile.
  - Third-party marketplace links (DoorDash, Uber Eats, etc.) are:
    - De-emphasized visually (secondary buttons or simple text links), or
    - Confined to a “More ways to order” section below primary CTAs.
  - Clear re-order paths (e.g. “Reorder your favorites” when authenticated, or deep links back into our ordering flow from email/SMS).

- **Action items**:
  - Make **direct ordering** the default & most visually prominent path:
    - Primary CTA: “Order Online” (links to our first-party flow).
    - Secondary CTA: “View Menu” or “Call Now”.
  - Add configuration for:
    - Whether to show third-party marketplace links at all.
    - Where to place them (e.g. footer or a dedicated “More ways to order” block).
  - Design a **repeat-order entry point**:
    - If we have auth + order history: a “Reorder” CTA in hero/nav for logged-in users.
    - If not yet: support inbound “Reorder” links from email/SMS campaigns pointing to a pre-populated cart.

#### 3.6. Loyalty, Email/SMS Capture, and Offers

Owner.com leans heavily into **owned audience building** (email/SMS lists, loyalty). These modules are often subtle but always present somewhere in the experience.

- **Patterns to mirror**:
  - Offer-based capture: “Get 10% off your first online order” or “Join the VIP club for exclusive offers”.
  - Simple, high-converting forms (email and/or phone) placed:
    - Near hero or above the footer.
    - On dedicated “Rewards / VIP Club” sections.

- **Action items**:
  - Create reusable **capture modules**:
    - Hero-integrated bar (e.g. small strip below hero CTA).
    - Inline section (headline + 1–2 bullet benefits + form).
  - Ensure capture modules are:
    - Theme-aware (colors, typography).
    - Hooked into our marketing/CRM infrastructure (webhooks or API to ESP/SMS provider).
  - Track events like `join_vip_program`, `submit_email_capture`, `submit_sms_capture` for measurement.

#### 3.7. Multi-Location & Franchise Patterns

Several case-study restaurants operate multiple locations, and Owner.com’s UX supports easy discovery of the right location while still centering online ordering.

- **Patterns to mirror**:
  - Location switcher/selector that highlights:
    - Nearest or featured location.
    - Each location’s address, hours, and ordering CTA.
  - Clear distinction between:
    - Brand/overview page.
    - Individual location pages with their own ordering flows.

- **Action items**:
  - Support a **brand-level landing page**:
    - Hero describing the overall brand.
    - List of locations, each with “Order from this location” and “View details”.
  - Provide **location-specific pages**:
    - Unique URLs and SEO metadata per location.
    - Location-specific schema, menus, hours, and CTAs.
  - Ensure cross-linking:
    - Brand page → location pages.
    - Location pages → brand page + sibling locations.

---

### 4. SEO & AI Search Optimization Strategy

This is where we intentionally go beyond visuals and make our restaurant sites extremely legible to Google and AI engines (ChatGPT, Perplexity, etc.).

#### 4.1. URL & Information Architecture

- **Action items**:
  - Adopt semantic, location-aware URL patterns for restaurant experiences:
    - `/restaurants/{city}/{neighborhood}/{cuisine}/{restaurant-slug}`
    - `/restaurants/{city}/{restaurant-slug}/menu`
    - `/restaurants/{city}/{restaurant-slug}/catering`
  - Create **city and neighborhood index pages**:
    - `/restaurants/{city}` (e.g. “Best Restaurants in [City]”)
    - `/restaurants/{city}/{cuisine}` (e.g. “Best Sushi in [City]”)
  - Ensure internal linking from:
    - City pages → restaurant pages.
    - Restaurant pages → menu, catering, reservations pages (where applicable).

#### 4.2. Metadata (Titles, Descriptions, Open Graph)

- **Patterns to follow** (aligned with how Owner.com structures case-study metadata):
  - Page titles that combine restaurant name, cuisine, and city.
  - Descriptions that describe who they serve, what they serve, and where.

- **Action items**:
  - Implement a **templated SEO system** for dynamic metadata:
    - Restaurant home:
      - Title: `[{Restaurant Name}] | [Cuisine] in [City, State] | Order Online`
      - Description: Short, benefit-driven summary including cuisine, neighborhood, and primary action.
    - Menu page:
      - Title: `[Restaurant Name] Menu | Order [Cuisine] Online in [City]`
      - Description: Mention online ordering, pickup/delivery, and special dishes.
    - Catering page:
      - Title: `[Restaurant Name] Catering | [Cuisine] Catering in [City]`
  - Add full **Open Graph and Twitter card metadata** for better previews:
    - `og:title`, `og:description`, `og:image` (hero dish image), `og:type=website`, `og:locale`, etc.

#### 4.3. On-Page SEO Structure (H1/H2, Content Blocks)

- **Patterns to emulate** from Owner.com-style sites:
  - Clear `H1` as the primary page title, usually combining restaurant name and key intent (e.g. “Metro Pizza – Order Online in Las Vegas”).
  - Logical `H2` sections: Menu, About, Locations, Catering, Reviews, FAQs.

- **Action items**:
  - Standardize heading structure for all restaurant pages:
    - Home:
      - `H1`: `[Restaurant Name] – [Cuisine] in [City, State]`
      - `H2` sections: `Order Online`, `Menu Highlights`, `About`, `Reviews`, `Location & Hours`, `FAQs`.
    - Menu page:
      - `H1`: `[Restaurant Name] Menu – [Cuisine] in [City]`
      - `H2` for each menu category.
  - Require **at least 1–2 paragraphs of natural language content** for:
    - Restaurant intro (who they are, what they serve, what makes them special).
    - City/cuisine context (e.g. “If you’re looking for [cuisine] in [city], [Restaurant] offers…”).
  - Make it easy in our CMS/data model to populate these content fields per restaurant.

#### 4.4. Structured Data (Schema.org) for SEO & AI

To be AI-friendly, we must expose machine-readable facts about each restaurant.

- **Action items**:
  - Implement JSON-LD schema for each restaurant page:
    - `@type: Restaurant` (or subtype of `LocalBusiness`) with:
      - `name`
      - `image` (hero/search-optimized image)
      - `address` (street, city, region, postal code, country)
      - `geo` (lat/long)
      - `servesCuisine` (one or more cuisines)
      - `telephone`
      - `url`
      - `openingHoursSpecification`
      - `priceRange`
    - `aggregateRating` (where ratings data is available).
    - `menu` (link to menu page URL).
  - For content sections:
    - Add optional `FAQPage` schema on pages with FAQs (e.g. delivery, pickup, parking, dietary restrictions).
    - Add `BreadcrumbList` schema for restaurant pages nested under city and cuisine.
  - Ensure **city and cuisine index pages** have:
    - `LocalBusiness` or `FoodEstablishment` lists represented using `ItemList` with references to individual restaurants.

#### 4.5. Content for AI Search (Answer Common Questions)

AI systems look for explicit answers to common user intents.

- **Action items**:
  - For each restaurant, define structured Q&A content that can be rendered as an FAQ block and schema:
    - “Does [Restaurant] offer delivery or pickup?”
    - “What are [Restaurant]’s hours?”
    - “Where is [Restaurant] located?”
    - “Does [Restaurant] offer vegetarian / vegan / gluten-free options?”
    - “Does [Restaurant] take reservations or walk-ins?”
  - Encourage longer-form, conversational copy in:
    - About section (1–3 paragraphs).
    - City/cuisine description on city and cuisine pages.
  - Include **location and cuisine keywords naturally** in the copy without keyword stuffing.

#### 4.6. Technical SEO (Speed, Mobile, Accessibility)

- **Action items**:
  - Ensure **Core Web Vitals** are strong:
    - Optimize hero and menu images (Next.js `Image`, responsive sizes, WebP).
    - Use lazy loading for below-the-fold images and menu sections.
    - Avoid blocking JS/CSS for primary content.
  - Mobile-first:
    - Verify that all hero CTAs, sticky CTAs, and menu interactions are mobile-optimized and thumb-friendly.
  - Accessibility:
    - Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
    - Alt text for all food imagery.
    - Sufficient color contrast for text and CTAs.

#### 4.7. Local SEO Integrations (Maps, Profiles, and NAP Consistency)

Across Owner.com-powered presences, the **local business identity** is extremely clear, which benefits both Google and AI assistants.

- **Action items**:
  - Embed **map and directions modules** on each location page:
    - Google Maps embed or map component.
    - “Get Directions” deep link to native maps apps.
  - Surface **consistent NAP (Name, Address, Phone)**:
    - Exact same formatting across site, schema, and Google Business Profile.
    - Include NAP in footer or a dedicated “Location & Hours” block.
  - Link out to key profiles using `sameAs` in schema:
    - Google Business Profile, Instagram, Facebook, TikTok, Yelp, or others as relevant.
  - For multi-location brands:
    - Make sure each location page references the correct GBP and contact info.
    - Avoid mixing addresses/phones between locations in copy or metadata.

---

### 5. Live Owner Restaurant Patterns (From Actual Restaurant Sites)

Looking at real restaurant sites that use Owner.com (e.g. Cyclo Noodles, Saffron, Talkin’ Tacos, Sushi Addicts) adds a few more concrete patterns beyond the case studies.

#### 5.1. Promotions, Offers, and Campaign Landing

- **Patterns observed**:
  - Persistent emphasis on **current offers**: first-order discounts, sweepstakes, seasonal promos, or limited-time items.
  - Dedicated promo or campaign pages (e.g. sweepstakes, special events) that act as focused landing pages.

- **Action items**:
  - Support **offer surfaces** within restaurant templates:
    - Small “offer strip” near hero (e.g. “Get 10% off your first online order – join our VIP list”).
    - Promo card sections mid-page for seasonal items or campaigns.
  - Allow restaurants to define **campaign landing pages** within our system:
    - Clean URLs (e.g. `/restaurants/{city}/{restaurant-slug}/promos/{campaign-slug}`).
    - Focused content and CTAs tied back into our ordering flow.

#### 5.2. Community & Fundraising Hooks

- **Patterns observed**:
  - Restaurants highlight community involvement: fundraisers, charity nights, partnerships with local organizations.
  - These are often framed as **events with a clear call to action** (visit/order on a specific date to contribute).

- **Action items**:
  - Add an optional **Community / Fundraising** module:
    - Title, description, date/time, beneficiary, and CTA (e.g. “Order Online During the Event”).
  - Ensure community content:
    - Is linkable with its own URL.
    - Is indexable with basic metadata (title/description) for SEO and AI context around community engagement.

#### 5.3. Social Media & User-Generated Content

- **Patterns observed**:
  - Prominent links to Instagram/TikTok/Facebook and encouragement to tag the restaurant.
  - In some cases, embedded social feeds or carousels of user-generated content.

- **Action items**:
  - Provide **theme-aware social link components**:
    - Icon row in header/footer or near “About” section.
  - Optional **UGC/gallery block**:
    - Curated images pulled from social or uploaded manually.
    - Captions that naturally reinforce cuisine, location, and brand voice for SEO/AI.

#### 5.4. Optional Content & Blogging Surface

- **Patterns observed**:
  - Some restaurants maintain a “News” or “Blog” style surface for events, menu announcements, or features.

- **Action items**:
  - Define a **lightweight content surface** per restaurant:
    - Support simple posts (title, body, hero image, tags like “events”, “menu-updates”).
    - Route under a predictable path: `/restaurants/{city}/{restaurant-slug}/news/{slug}`.
  - SEO & AI:
    - Encourage content that answers real queries (e.g. “New vegan options in [city]”, “Holiday catering at [restaurant]”).

#### 5.5. Analytics & Search Console/GBP Alignment

- **Patterns inferred**:
  - Owner-powered restaurants are typically wired into Google Analytics and Google Business Profile for measuring direct-order wins and local search performance.

- **Action items**:
  - Make it easy to connect:
    - Google Analytics / GA4 (ID fields at restaurant or brand level).
    - Google Search Console verification via meta tag or DNS (document process in product UX).
  - For local SEO/AI:
    - Encourage restaurants to keep GBP categories, hours, and menu links in sync with the URLs and hours we expose on-site.

These live-site patterns are mostly about **promos, community, social, and measurement**, and they layer cleanly on top of the core design/SEO foundations already outlined in earlier sections.

---

### 6. Data & Analytics for Continuous Optimization

- **Action items**:
  - Track key events:
    - `view_restaurant_page`, `view_menu_category`, `add_to_cart`, `start_checkout`, `complete_order`, `click_call`, `click_directions`.
  - Correlate:
    - Theme family and layout variant → conversion rate, average order value.
    - SEO entry pages → conversion and bounce rates.
  - Use this data to:
    - Iterate on Owner-style themes.
    - Inform default layouts for new restaurants based on cuisine and city.

---

### 7. Implementation Roadmap (Phase 3)

1. **Design System & Theme Schema**
   - Finalize `RestaurantTheme` spec aligned with Owner patterns.
   - Implement theme provider and 3–4 Owner-style preset themes.
2. **Restaurant Page UX Alignment**
   - Build hero, nav, menu cards, testimonials, and about sections using the new schema.
   - Deploy to a small set of pilot restaurants across different cuisines (pizza, sushi, diner, fast-casual).
3. **SEO & AI Enhancements**
   - Implement dynamic metadata templates, heading structures, and structured data.
   - Launch city and cuisine index pages with strong content and internal linking.
4. **Optimization & Automation**
   - Add analytics instrumentation.
   - Iterate on copy and design based on engagement and conversion.
   - Later: build the automated Owner-style theme extractor using Playwright + LLM mapping.

#### 7.1. Retrofit Plan — Upgrading the Current Prototype

While the steps above describe the target system, we also need a concrete path to **upgrade the existing restaurant-site prototype** to match these principles.

1. **Inventory Current Surfaces**
   - List the current pages and key views in the prototype (for example):
     - Restaurant home / landing page.
     - Menu page (or menu section on the home page).
     - Location / contact page.
     - Any city / cuisine index pages that already exist.
   - For each, note:
     - Current URL pattern.
     - Current hero layout and CTAs.
     - Presence/absence of reviews, about content, FAQs, loyalty/offer modules.

2. **Retrofit Layouts & CTAs**
   - For the **restaurant home page**:
     - Update the hero to follow section **3.1** (image-forward hero, clear H1, primary “Order Online” CTA, secondary CTA).
     - Add or update navigation to include `Menu`, `About`, `Location & Hours`, and prominent “Order Online” as per **3.2**.
     - Introduce testimonial/review and about sections following **3.4**.
   - For the **menu experience**:
     - Ensure menu is rendered as **HTML/text**, not PDFs or images only, and follows the card patterns in **3.3**.
     - Group items into clear categories with `H2`/section headings and concise descriptions.
   - For **multi-location prototypes**:
     - Add a brand-level page and location selector as in **3.7**.

3. **Apply Theme & Design System Incrementally**
   - Wrap existing pages in the new `RestaurantTheme` provider from section **2.1**.
   - Map current colors, fonts, spacing, and radii to the new tokens:
     - Replace hard-coded colors with `background`, `surface`, `primary`, `accent`, `text`, `border`.
     - Replace ad-hoc border-radius values with `radii.card`, `radii.button`, `radii.badge`.
   - Gradually refactor components (hero, nav, menu cards, testimonials) to consume theme tokens instead of inline styles.

4. **SEO, AI, and Structured Data Retrofit**
   - For each existing page type:
     - Implement the metadata templates from **4.2** (titles, descriptions, OG/Twitter).
     - Enforce the heading patterns from **4.3** (H1 + logical H2s).
     - Add JSON-LD snippets from **4.4** to restaurant home and location pages.
     - Add FAQ content + schema where the UI already exposes Q&A-style information (**4.5**).
   - Update URLs (or add redirects if needed) to follow the patterns in **4.1** for restaurants, cities, cuisines, and promos.

5. **Local & Analytics Wiring**
   - Add NAP + map/directions modules to the existing location/contact view per **4.7**.
   - Wire up analytics events defined in section **6** (`view_restaurant_page`, `add_to_cart`, `click_call`, etc.) at key interaction points in the current UI.
   - Add configuration surfaces (in code or admin UI) for:
     - Google Analytics / GA4 IDs.
     - Google Search Console verification.
     - Links to GBP and major social profiles for `sameAs`.

6. **Feature Modules: Loyalty, Offers, Community (Optional but Recommended)**
   - If the prototype already has any notion of promotions or loyalty:
     - Refactor these into the offer/loyalty modules from **3.6** and **5.1**.
   - If it has content about community or events:
     - Re-express them using the community/fundraising module from **5.2** and the lightweight content surface from **5.4**.

This retrofit plan ensures we **evolve** the current prototype into an Owner.com-aligned experience step by step, instead of throwing it away and rebuilding from scratch.

This plan gives us a concrete path to make our restaurant sites look, feel, and perform like Owner.com’s while adding a strong SEO and AI-search foundation tailored to our platform.


