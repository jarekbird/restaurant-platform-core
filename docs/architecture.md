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

## Cart System Architecture

The cart system provides shopping cart functionality for online ordering. It consists of:

### Core Components

1. **`useCart` Hook** (`components/order/useCart.ts`):
   - Manages cart state using React hooks
   - Provides operations: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
   - Calculates `total` and `itemCount` automatically
   - Persists cart state to `localStorage` for persistence across page reloads
   - Handles hydration to avoid server/client mismatches

2. **`CartProvider`** (`components/order/CartProvider.tsx`):
   - React Context provider that wraps the `useCart` hook
   - Makes cart state available to all child components via `useCartContext()`
   - Integrates with toast notifications for user feedback
   - Wraps cart operations with toast notifications (add, remove, clear)

3. **Cart UI Components**:
   - **`CartDrawer`**: Slide-out drawer showing cart items, quantities, and checkout
   - **`OrderButton`**: Button in header showing item count badge
   - **`CheckoutForm`**: Form for customer information (name, phone, notes)
   - **`OrderConfirmationModal`**: Modal shown after successful order placement

### State Management

- Cart state is managed at the provider level using React Context
- State is persisted to `localStorage` with key `restaurant-cart`
- Cart operations are wrapped to provide toast notifications
- Cart state is shared across all components within `CartProvider`

### Integration Points

- **Preview Route**: `CartProvider` wraps the preview page layout
- **RestaurantLayout**: Manages cart drawer open/close state and order placement
- **MenuItemCard**: "Add to Cart" button calls `addItem` from context
- **ChatAssistant**: Can add/remove items via AI commands

## AI Chat System Architecture

The AI chat system provides conversational ordering assistance powered by OpenAI's GPT models.

### Core Components

1. **`ChatAssistant`** (`components/chat/ChatAssistant.tsx`):
   - Main chat UI component with collapsible panel
   - Manages chat message history
   - Handles user input and sends to `/api/chat` endpoint
   - Parses AI responses to extract cart actions
   - Executes cart actions (add, remove, update quantity, checkout)
   - Shows conversation starter buttons for common actions

2. **`ChatMessage`** (`components/chat/ChatMessage.tsx`):
   - Displays individual chat messages (user/assistant)
   - Shows timestamps and message content

3. **`ChatInput`** (`components/chat/ChatInput.tsx`):
   - Input field for user messages
   - Submit button to send messages

### AI Service Layer

1. **`buildSystemPrompt`** (`lib/ai/chatService.ts`):
   - Generates system prompt for LLM based on:
     - Restaurant menu structure
     - Current cart contents
     - Available actions (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, SHOW_CART, CHECKOUT)
   - Provides context about menu items, prices, and cart state

2. **`sendChatMessage`** (`lib/ai/chatService.ts`):
   - Makes API call to OpenAI GPT-4o-mini model
   - Sends system prompt + message history
   - Returns AI response as string
   - Handles errors (API key issues, rate limits, network errors)

3. **`actionParser`** (`lib/ai/actionParser.ts`):
   - Parses AI JSON responses into structured `ChatAction` objects
   - Validates action types and parameters
   - Handles malformed responses gracefully
   - Returns action objects: `{ type, itemId?, quantity?, content? }`

### API Route

**`/api/chat`** (`app/api/chat/route.ts`):
- Next.js API route handler
- Receives POST requests with `{ messages, menu, cart }`
- Calls `sendChatMessage` with context
- Returns `{ message, action }` response
- Handles errors and returns appropriate status codes

### Action Extraction and Integration

1. **Action Types**:
   - `ADD_ITEM`: Add item to cart (requires `itemId`, optional `quantity`)
   - `REMOVE_ITEM`: Remove item from cart (requires `itemId`)
   - `UPDATE_QUANTITY`: Update item quantity (requires `itemId`, `quantity`)
   - `SHOW_CART`: Display current cart contents
   - `CHECKOUT`: Open checkout form

2. **Integration Flow**:
   - User sends message → `/api/chat` → OpenAI API → Response
   - Response parsed by `actionParser` → `ChatAction` object
   - `ChatAssistant` executes action via `useCartContext()`
   - Cart state updates → UI updates (drawer, badge, toasts)
   - Confirmation message added to chat history

### State Management

- Chat messages stored in component state (`useState`)
- Cart state accessed via `useCartContext()` hook
- Menu data passed as prop from server component
- No global chat state (each chat instance is independent)

### API Key Handling

- OpenAI API key stored in `OPENAI_API_KEY` environment variable
- Model selection via `OPENAI_MODEL` (defaults to `gpt-4o-mini`)
- API key validation in `sendChatMessage`
- Error handling for missing/invalid keys

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

