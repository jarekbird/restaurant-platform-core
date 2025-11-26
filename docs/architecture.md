# Architecture Documentation

This document describes the architecture of the restaurant-platform-core application.

## Purpose

The restaurant-platform-core is a platform for creating and managing restaurant websites. It provides:

- Core components and schemas for restaurant data
- Theme system for visual customization
- Preview system for viewing restaurant sites
- Scaffolding tools for generating standalone restaurant sites
- AI-powered menu ingestion tools

## Data Flow

### Core Data Structure

The platform uses a filesystem-based data model:

```
data/restaurants/<slug>/
├── config.json    # Restaurant configuration (RestaurantConfig schema)
└── menu.json      # Menu data (Menu schema)
```

### Data Flow: Config/Menu → Preview → Scaffolded Site

1. **Data Storage**: Restaurant data is stored as JSON files in `data/restaurants/<slug>/`
   - `config.json` contains restaurant metadata (name, address, hours, theme, etc.)
   - `menu.json` contains menu structure (categories, items, modifiers, etc.)

2. **Data Loading**: The `loadRestaurant(slug)` function in `lib/loaders/restaurant.ts`:
   - Reads JSON files from the filesystem
   - Validates data against Zod schemas
   - Returns typed `RestaurantConfig` and `Menu` objects

3. **Preview Rendering**: The `/preview/[slug]` route:
   - Calls `loadRestaurant(slug)` to load data
   - Renders `RestaurantLayout` with theme provider
   - Displays `HeroSection`, `MenuSectionList`, `HoursAndLocation`, and `CallToActionBar`

4. **Site Scaffolding**: The `scaffold-site.ts` script:
   - Copies `templates/site` to output directory
   - Copies restaurant data files to the new site's `data/` directory
   - Replaces placeholders in configuration files
   - Creates a standalone Next.js application

## Theme System

The theme system allows restaurants to have different visual styles:

### Theme Definition

Themes are defined in `lib/themes/index.ts`:
- Each theme has a key (e.g., `"sushi-dark"`, `"cafe-warm"`, `"pizza-bright"`)
- Themes contain color and typography tokens as Tailwind CSS classes
- Themes can be extended or new ones added

### Theme Application

1. **Theme Provider**: `RestaurantThemeProvider` wraps the restaurant layout
   - Accepts `themeKey` from restaurant config
   - Provides theme via React context
   - Falls back to default theme if key is invalid

2. **Theme Hook**: `useTheme()` hook allows components to access theme
   - Must be used within `RestaurantThemeProvider`
   - Returns theme object with colors and typography

3. **Component Integration**: Components apply theme classes:
   - Call `useTheme()` to get current theme
   - Apply theme classes using `cn()` utility for class composition
   - Theme classes compose with custom `className` props

## Ingestion Pipeline

The AI menu ingestion pipeline converts unstructured text into structured menu data:

1. **Input**: Raw menu text in `ingestion/input/` directory

2. **LLM Processing**: `callLLMToGenerateMenuJson(rawText)` function:
   - Currently a placeholder (to be implemented)
   - Should call an LLM with prompt from `docs/ai/prompts.md`
   - Returns structured menu JSON

3. **Validation**: Generated JSON is validated against `menuSchema`

4. **Output**: Validated menu is written to `data/restaurants/<slug>/menu.json`

## Component Architecture

### Layout Components

- **AppShell**: Basic application shell (header, main, footer)
- **RestaurantLayout**: Restaurant-specific layout with theme provider
  - Renders header with logo/name and navigation
  - Renders footer with address, hours, and contact info
  - Wraps content in `RestaurantThemeProvider`

### Menu Components

- **MenuCategory**: Renders a single menu category
- **MenuItemCard**: Renders a single menu item as a card
- **MenuSectionList**: Renders full menu with categories and items

### Restaurant Components

- **HeroSection**: Hero image, title, and tagline
- **FeaturedItems**: Displays featured menu items
- **HoursAndLocation**: Displays hours and address information
- **CallToActionBar**: Primary action button (e.g., "Order Now")

### Order Components

- **CartDrawer**: Shopping cart drawer with open/close state
- **OrderButton**: Button to toggle cart or trigger action
- **CheckoutForm**: Form for order submission (name, phone, notes)
- **useCart**: Hook for managing cart state

## Schema System

All data structures are defined using Zod schemas:

- **Menu Schema** (`lib/schemas/menu.ts`):
  - `modifierOptionSchema`: Individual modifier option
  - `modifierGroupSchema`: Group of modifier options
  - `menuItemSchema`: Single menu item
  - `menuCategorySchema`: Category containing items
  - `menuSchema`: Complete menu structure

- **Restaurant Schema** (`lib/schemas/restaurant.ts`):
  - `hoursSchema`: Operating hours by day
  - `restaurantConfigSchema`: Complete restaurant configuration

Schemas provide:
- Type safety via TypeScript inference
- Runtime validation
- Clear error messages for invalid data

## Testing Strategy

The platform uses Vitest for testing:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Schema Tests**: Validate schema definitions and data
- **Loader Tests**: Test data loading and validation

All tests run non-interactively using `--run` flag to prevent hanging.

## File Structure

```
restaurant-platform-core/
├── app/                    # Next.js app directory
│   ├── (preview)/         # Preview route group
│   └── preview/[slug]/    # Dynamic preview route
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── menu/             # Menu components
│   ├── restaurant/       # Restaurant-specific components
│   ├── order/            # Order/cart components
│   └── theme/            # Theme system components
├── data/                  # Restaurant data files
│   └── restaurants/      # Per-restaurant data
├── docs/                  # Documentation
│   ├── ai/               # AI-related docs
│   └── *.md              # Architecture and usage docs
├── ingestion/            # Menu ingestion files
│   ├── input/            # Input text files
│   └── output/           # Output files
├── lib/                   # Core libraries
│   ├── loaders/          # Data loaders
│   ├── schemas/          # Zod schemas
│   ├── themes/           # Theme definitions
│   └── utils.ts          # Utility functions
├── scripts/              # CLI scripts
│   ├── ingest-menu.ts    # Menu ingestion script
│   ├── scaffold-site.ts  # Site scaffolding script
│   └── llm-menu.ts       # LLM menu generation (stub)
├── templates/            # Site templates
│   └── site/             # Minimal Next.js template
└── test/                 # Test files
```

## Key Design Decisions

1. **Filesystem-based Data**: Data is stored as JSON files for simplicity and version control
2. **Schema Validation**: All data is validated with Zod for type safety and error prevention
3. **Theme System**: Themes are defined as Tailwind class strings for flexibility
4. **Component Composition**: Components accept `className` props for styling flexibility
5. **Client/Server Separation**: Client components use `'use client'` directive
6. **Test-Driven Development**: Comprehensive test coverage for all features

## Future Extensibility

The architecture supports:
- Adding new themes by extending `themes` record
- Adding new restaurant data by creating new directories
- Implementing LLM integration in `callLLMToGenerateMenuJson`
- Extending schemas for new features
- Adding new components following existing patterns

