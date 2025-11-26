# Restaurant Site Scaffolding

This document describes the 3-step flow for creating a new restaurant site from the platform core.

## Overview

The scaffolding process allows you to:
1. Ingest a menu from raw text using AI
2. Scaffold a new restaurant site with the ingested data
3. Run the new site as a standalone Next.js application

## Step 1: Ingest Menu

Use the menu ingestion script to convert raw menu text into structured JSON:

```bash
npm run ingest-menu <inputFile> <restaurantSlug>
```

**Example:**
```bash
npm run ingest-menu ingestion/input/menu.txt so-delicious
```

This will:
- Read the raw menu text from `ingestion/input/menu.txt`
- Call the LLM to generate structured menu JSON
- Validate the output against the menu schema
- Write `data/restaurants/so-delicious/menu.json`

**Requirements:**
- The restaurant must already have a `config.json` file in `data/restaurants/<slug>/`
- The input file should contain unstructured menu text (see `docs/ai/prompts.md` for format details)

## Step 2: Scaffold Site

Use the scaffold script to create a new restaurant site:

```bash
npm run scaffold-site <restaurantSlug> <outputPath>
```

**Example:**
```bash
npm run scaffold-site so-delicious ../so-delicious-site
```

This will:
- Copy the `templates/site` directory to the output path
- Copy `data/restaurants/<slug>/config.json` to the new site's `data/config.json`
- Copy `data/restaurants/<slug>/menu.json` to the new site's `data/menu.json`
- Replace placeholders in `package.json` with restaurant-specific values

**Output Structure:**
```
<outputPath>/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
├── data/
│   ├── config.json    # Copied from core
│   └── menu.json      # Copied from core
├── package.json       # Updated with restaurant name
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Step 3: Run New Site

Navigate to the scaffolded site and run it:

```bash
cd <outputPath>
npm install
npm run dev
```

The site will be available at `http://localhost:3000` and will display the restaurant's menu and information.

## Complete Workflow Example

```bash
# 1. Ingest menu from raw text
npm run ingest-menu ingestion/input/sushi-menu.txt so-delicious

# 2. Scaffold the site
npm run scaffold-site so-delicious ../so-delicious-site

# 3. Run the new site
cd ../so-delicious-site
npm install
npm run dev
```

## Customization

After scaffolding, you can customize the site:
- Modify components in `components/` directory
- Update styling in `app/globals.css` or add Tailwind classes
- Add additional pages in `app/` directory
- Extend the layout in `app/layout.tsx`

The scaffolded site is a fully independent Next.js application that can be deployed separately.

## Notes

- The scaffolded site reads data from local `data/` files (not from the core platform)
- Each scaffolded site is independent and can be customized without affecting the core
- The template uses simplified components compared to the core platform
- Data files are copied at scaffold time, so updates to core data require re-scaffolding

