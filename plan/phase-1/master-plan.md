PHASE 0 — Bootstrap the Core App

Goal: A clean Next.js + TanStack + TS app with a sane structure.

Tasks

0.1 Initialize repo

Create repo: restaurant-platform-core

npx create-next-app@latest with:

TypeScript

App Router

Tailwind

Install deps:

npm install @tanstack/react-query @tanstack/react-query-devtools zod
# (optional later) @tanstack/react-table


0.2 Set up TanStack Query provider

Create app/providers.tsx:

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}


Wrap app/layout.tsx with Providers.

0.3 Basic layout & design shell

Define a main AppShell component:

Header

Footer

Container

Create app/(preview)/layout.tsx that uses AppShell.
This will be your internal playground later.

PHASE 1 — Model the Domain (Menu & Restaurant Config)

Goal: You have strong types & schemas for menus and restaurant-level config.

Tasks

1.1 Define menu schema with Zod

Create lib/schemas/menu.ts:

import { z } from "zod";

export const modifierOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  priceDelta: z.number().default(0),
});

export const modifierGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(modifierOptionSchema),
});

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  modifiers: z.array(modifierGroupSchema).optional(),
});

export const menuCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  items: z.array(menuItemSchema),
});

export const menuSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string().default("USD"),
  categories: z.array(menuCategorySchema),
});

export type Menu = z.infer<typeof menuSchema>;


1.2 Define restaurant config schema

lib/schemas/restaurant.ts:

import { z } from "zod";

export const hoursSchema = z.record(
  z.enum(["mon","tue","wed","thu","fri","sat","sun"]),
  z.string() // "11:00-21:00"
);

export const restaurantConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),       // used in URLs
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  hours: hoursSchema,
  cuisine: z.string(),
  theme: z.string(),      // e.g. "sushi-dark"
  heroImage: z.string().optional(),
  logo: z.string().optional(),
  orderOnlineEnabled: z.boolean().default(false),
});

export type RestaurantConfig = z.infer<typeof restaurantConfigSchema>;


1.3 Create sample data

data/restaurants/so-delicious/config.json

data/restaurants/so-delicious/menu.json

Use your schemas to validate at runtime in dev.

PHASE 2 — Build Core UI Components (Template Library)

Goal: Reusable components to render a restaurant site from {config, menu}.

Tasks

2.1 Layout & shell

components/layout/RestaurantLayout.tsx

Accepts restaurantConfig

Renders header with logo/name + nav

Renders footer with address/hours

2.2 Menu components

components/menu/MenuCategory.tsx

components/menu/MenuItemCard.tsx

components/menu/MenuSectionList.tsx (iterates over categories)

Design these to be themeable (accept a className or use theme context later).

2.3 Home page blocks

components/restaurant/HeroSection.tsx

components/restaurant/FeaturedItems.tsx

components/restaurant/HoursAndLocation.tsx

components/restaurant/CallToActionBar.tsx

2.4 Ordering UI (non-functional prototype)

components/order/CartDrawer.tsx

components/order/OrderButton.tsx

components/order/CheckoutForm.tsx

Initially, cart state is local (useState) for demo purposes.

PHASE 3 — Routing & Preview Pages

Goal: You can visit /preview/so-delicious and see a full, working restaurant site using local JSON.

Tasks

3.1 Restaurant loader (file-based for now)

lib/loaders/restaurant.ts:

import fs from "fs";
import path from "path";
import { restaurantConfigSchema } from "../schemas/restaurant";
import { menuSchema } from "../schemas/menu";

export async function loadRestaurant(slug: string) {
  const base = path.join(process.cwd(), "data", "restaurants", slug);
  const configRaw = await fs.promises.readFile(path.join(base, "config.json"), "utf-8");
  const menuRaw = await fs.promises.readFile(path.join(base, "menu.json"), "utf-8");

  const config = restaurantConfigSchema.parse(JSON.parse(configRaw));
  const menu = menuSchema.parse(JSON.parse(menuRaw));

  return { config, menu };
}


3.2 Preview route

app/preview/[slug]/page.tsx:

import { loadRestaurant } from "@/lib/loaders/restaurant";
import { RestaurantLayout } from "@/components/layout/RestaurantLayout";
import { MenuSectionList } from "@/components/menu/MenuSectionList";
import { HeroSection } from "@/components/restaurant/HeroSection";

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const { config, menu } = await loadRestaurant(params.slug);

  return (
    <RestaurantLayout config={config}>
      <HeroSection config={config} />
      <MenuSectionList menu={menu} />
    </RestaurantLayout>
  );
}


Now http://localhost:3000/preview/so-delicious shows a working demo.

PHASE 4 — Theme System

Goal: Quickly swap visual styles for different restaurants without rewriting components.

Tasks

4.1 Define theme tokens

lib/themes/index.ts:

export type Theme = {
  name: string;
  background: string;
  text: string;
  accent: string;
  accentSoft: string;
  border: string;
};

export const themes: Record<string, Theme> = {
  "sushi-dark": {
    name: "Sushi Dark",
    background: "bg-slate-950",
    text: "text-slate-100",
    accent: "text-rose-400",
    accentSoft: "bg-rose-900/40",
    border: "border-slate-800",
  },
  "cafe-warm": { /* ... */ },
};


4.2 Theme context hook

components/theme/ThemeProvider.tsx:

"use client";
import { createContext, useContext } from "react";
import { Theme, themes } from "@/lib/themes";

const ThemeContext = createContext<Theme | null>(null);

export function RestaurantThemeProvider({
  themeKey,
  children,
}: {
  themeKey: string;
  children: React.ReactNode;
}) {
  const theme = themes[themeKey] ?? themes["sushi-dark"];
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within RestaurantThemeProvider");
  return ctx;
}


Wrap RestaurantLayout with this provider using config.theme.

4.3 Apply theme classes

In components, use useTheme and apply classes accordingly.

PHASE 5 — AI Menu Ingestion Tooling

Goal: Given unstructured menu text (from PDF, website copy, etc.), produce menu.json matching your schema.

You won’t wire model calls here explicitly, but you’ll define the script + prompt structure so your agents can implement it easily.

Tasks

5.1 Create ingestion input/output dirs

ingestion/input/

ingestion/output/

5.2 Define CLI script skeleton

scripts/ingest-menu.ts:

import fs from "fs";
import path from "path";
import { menuSchema } from "@/lib/schemas/menu";

async function main() {
  const [,, inputFile, restaurantSlug] = process.argv;
  if (!inputFile || !restaurantSlug) {
    console.error("Usage: ts-node scripts/ingest-menu.ts <inputFile.txt> <restaurantSlug>");
    process.exit(1);
  }

  const raw = await fs.promises.readFile(inputFile, "utf-8");

  // TODO: call AI model to convert `raw` -> menuJson
  const menuJsonText = await callLLMToGenerateMenuJson(raw);

  const parsed = menuSchema.parse(JSON.parse(menuJsonText));
  const outPath = path.join(process.cwd(), "data", "restaurants", restaurantSlug, "menu.json");
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await fs.promises.writeFile(outPath, JSON.stringify(parsed, null, 2), "utf-8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


5.3 Define LLM prompt template (doc for agents)

In docs/ai/prompts.md:

“Menu Extraction Prompt”

Describe:

Input format: raw OCR’d text / copied menu text

Output: ONLY JSON matching menuSchema

Rules: no hallucination, preserve order, etc.

Agents can then implement callLLMToGenerateMenuJson using OpenAI/Anthropic/etc.

PHASE 6 — Restaurant Scaffolding & Per-Restaurant Repos

Goal: From the core platform, generate a ready-to-deploy restaurant-specific repo.

You can start with a “copy + tweak” approach.

Tasks

6.1 Create templates/site directory

templates/site/:

app/ (minimal Next app for restaurants)

components/ (symlink or copy from core)

lib/ (minimal loader using local data/menu.json)

data/menu.json placeholder

data/config.json placeholder

This is a stripped-down Next app intended to be self-contained.

6.2 CLI: scripts/scaffold-site.ts

Inputs:

restaurant slug

path to menu.json + config.json

output path (new repo folder)

Steps:

Copy templates/site → ../<slug>-site

Copy data/restaurants/<slug>/menu.json → <slug>-site/data/menu.json

Copy config.json likewise

Replace placeholders in package.json, next.config.mjs, etc.

Initialize git if desired

6.3 Document usage

In docs/scaffolding.md, show:

# 1. Ingest menu (once you have raw menu text)
ts-node scripts/ingest-menu.ts ingestion/input/so-delicious.txt so-delicious

# 2. Create site repo
ts-node scripts/scaffold-site.ts so-delicious ../so-delicious-sushi-site

# 3. Open new repo & run
cd ../so-delicious-sushi-site
npm install
npm run dev

PHASE 7 — Demo Restaurant Implementations

Goal: Have 1–2 fully styled restaurants ready for live demos.

Tasks

7.1 So Delicious Sushi demo

Populate:

data/restaurants/so-delicious/config.json

data/restaurants/so-delicious/menu.json (manual or via ingestion)

Fine-tune theme, hero image, etc.

Ensure /preview/so-delicious looks gorgeous.

7.2 Second restaurant (different cuisine & theme)

E.g., hanamaru, ohana, etc.

Repeat the process with a different theme & layout options.

This shows versatility.

7.3 Ordering UI polish

Add realistic cart behavior:

useCart() hook in components/order/useCart.ts

Cart in preview pages

Mock submission (console.log or toast “Order placed!”).

This doesn’t need real payment integration yet for pitching.

PHASE 8 — Internal Docs for AI Agents & Yourself

Goal: Make it trivial for future you (or AI agents) to extend this system.

Tasks

8.1 docs/architecture.md

Explain:

Purpose of restaurant-platform-core

Data flow: config.json + menu.json → preview → scaffolded site

Theme system

Ingestion pipeline

8.2 docs/ai-tasks.md

List agent-suitable tasks with clear boundaries, for example:

AI Task: Implement callLLMToGenerateMenuJson() in scripts/ingest-menu.ts

AI Task: Add third theme variant in lib/themes/index.ts

AI Task: Improve styling for MenuItemCard to highlight chef specials

AI Task: Add multi-language support to menu items

AI Task: Integrate Stripe Checkout into scaffolded site (optional future)

8.3 docs/demo-playbook.md

How to:

spin up restaurant-platform-core

open /preview/so-delicious

scaffold a new site

run new site locally or deploy to Vercel

When you’re “ready to pitch”

By the time you’ve completed these phases, you will have:

✅ A real Next.js + TanStack core platform

✅ Strongly typed menu & restaurant schemas

✅ Preview environment at /preview/[slug]

✅ Theme system with at least 2–3 styles

✅ Working homepage/menu/ordering UI templates

✅ AI-friendly menu ingestion script skeleton

✅ CLI to scaffold restaurant-specific repos

✅ At least 1–2 beautiful demo restaurants

At that point, the only things left are:

Point your demos at Vercel/Railway

Grab some screenshots

Start pitching.

If you’d like, I can next:

turn this into a GitHub Project board breakdown, or

generate the initial folder/file tree for restaurant-platform-core exactly as it should look before you (or an agent) start coding.