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
   - Manages cart state using React hooks (`useState`, `useEffect`, `useCallback`)
   - Provides operations: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
   - Calculates `total` and `itemCount` automatically via computed values
   - Persists cart state to `localStorage` for persistence across page reloads
   - Handles hydration to avoid server/client mismatches (starts with empty cart, hydrates after mount)

2. **`CartProvider`** (`components/order/CartProvider.tsx`):
   - React Context provider that wraps the `useCart` hook
   - Makes cart state available to all child components via `useCartContext()`
   - Integrates with toast notifications for user feedback
   - Wraps cart operations with toast notifications (add, remove, clear)
   - Provides type-safe cart context interface (`CartContextValue`)

3. **Cart UI Components**:
   - **`CartDrawer`**: Slide-out drawer showing cart items, quantities, and checkout
   - **`OrderButton`**: Button in header showing item count badge
   - **`CheckoutForm`**: Form for customer information (name, phone, notes)
   - **`OrderConfirmationModal`**: Modal shown after successful order placement

### Cart Operations

#### Add Item Operation (`addItem`)
- **Input**: `Omit<CartItem, 'quantity'>` (item without quantity)
- **Behavior**: 
  - Checks if item already exists (same ID and modifiers)
  - If exists: increments quantity by 1
  - If new: adds item with quantity 1
  - Uses deep comparison of modifiers via JSON.stringify
- **Persistence**: Automatically saves to `localStorage` after state update
- **Side Effects**: Triggers toast notification via `CartProvider` wrapper

#### Remove Item Operation (`removeItem`)
- **Input**: `itemId: string`
- **Behavior**: Filters out item with matching ID from cart array
- **Persistence**: Automatically saves to `localStorage` after state update
- **Side Effects**: Triggers toast notification via `CartProvider` wrapper

#### Update Quantity Operation (`updateQuantity`)
- **Input**: `itemId: string`, `quantity: number`
- **Behavior**: 
  - If quantity <= 0: calls `removeItem` instead
  - Otherwise: updates quantity for matching item ID
  - Uses `map` to create new array with updated item
- **Persistence**: Automatically saves to `localStorage` after state update
- **Side Effects**: No toast notification (quantity changes are less prominent)

#### Clear Cart Operation (`clearCart`)
- **Input**: None
- **Behavior**: 
  - Sets cart items to empty array
  - Explicitly removes `restaurant-cart` key from `localStorage`
- **Persistence**: Clears `localStorage` entry
- **Side Effects**: Triggers toast notification via `CartProvider` wrapper

### Persistence Mechanism

The cart uses `localStorage` for client-side persistence:

- **Storage Key**: `restaurant-cart` (constant `CART_STORAGE_KEY`)
- **Storage Format**: JSON stringified array of `CartItem` objects
- **Hydration Strategy**:
  1. Component starts with empty cart array (server/client match)
  2. After mount, `useEffect` loads from `localStorage` (client-side only)
  3. If stored items exist, updates state with `setItems`
  4. Sets `isHydrated` flag to prevent premature saves
- **Save Strategy**:
  1. `useEffect` watches `items` and `isHydrated` dependencies
  2. Only saves after hydration is complete
  3. Saves on every cart state change
  4. Wrapped in try-catch for error handling
- **Error Handling**: 
  - Catches `localStorage` errors (quota exceeded, disabled, etc.)
  - Logs errors to console
  - Gracefully degrades (cart still works, just no persistence)

### State Management

- **State Location**: React Context (`CartContext`) provided by `CartProvider`
- **State Shape**: `CartItem[]` array with computed `total` and `itemCount`
- **State Updates**: Immutable updates using spread operators and array methods
- **State Sharing**: All components within `CartProvider` tree access same cart state
- **State Persistence**: `localStorage` with key `restaurant-cart`
- **State Synchronization**: Automatic save on every state change (after hydration)

### Integration Points

- **Preview Route**: `CartProvider` wraps the preview page layout (`app/preview/[slug]/page.tsx`)
- **RestaurantLayout**: Manages cart drawer open/close state and order placement
- **MenuItemCard**: "Add to Cart" button calls `addItem` from `useCartContext()`
- **ChatAssistant**: Can add/remove items via AI commands using `useCartContext()`
- **CartDrawer**: Displays cart items and allows quantity updates via `useCartContext()`

## AI Chat System Architecture

The AI chat system provides conversational ordering assistance powered by OpenAI's GPT models.

### Core Components

1. **`ChatAssistant`** (`components/chat/ChatAssistant.tsx`):
   - Main chat UI component with collapsible panel (desktop: sidebar, mobile: bottom drawer)
   - Manages chat message history in component state (`useState`)
   - Handles user input and sends to `/api/chat` endpoint via `fetch`
   - Receives JSON responses with `response_to_user` and `action` fields
   - Executes cart actions directly via `useCartContext()` (no separate parser needed)
   - Shows conversation starter buttons for common actions
   - Handles loading states and error messages
   - Validates actions before execution (item exists in menu/cart, valid quantities)

2. **`ChatMessage`** (`components/chat/ChatMessage.tsx`):
   - Displays individual chat messages (user/assistant)
   - Shows timestamps and message content
   - Different styling for user vs assistant messages

3. **`ChatInput`** (`components/chat/ChatInput.tsx`):
   - Input field for user messages
   - Submit button to send messages
   - Disabled state during loading

### AI Service Layer

1. **`buildSystemPrompt`** (`lib/ai/chatService.ts`):
   - Generates comprehensive system prompt for LLM
   - **Menu Context**: Formats all menu items with IDs, names, prices, descriptions
   - **Cart Context**: Formats current cart items with quantities and totals
   - **Instructions**: 
     - Defines available action types (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, SHOW_CART, CHECKOUT, ANSWER_QUESTION)
     - Specifies required JSON response format: `{ response_to_user: string, action: { type, itemId?, quantity? } | null }`
     - Instructs LLM to include updated cart totals in responses
     - Provides examples and error handling guidance
   - **Dynamic Updates**: Prompt regenerated on each request with current menu and cart state

2. **`sendChatMessage`** (`lib/ai/chatService.ts`):
   - **Client Initialization**: `getOpenAIClient()` reads `OPENAI_API_KEY` from environment
   - **API Call**: Uses OpenAI SDK to call `chat.completions.create()`
   - **Model Configuration**:
     - Model: `OPENAI_MODEL` env var or defaults to `gpt-4o-mini`
     - Temperature: 0.7 (balanced creativity/consistency)
     - Max tokens: 500 (sufficient for responses)
     - Response format: `json_object` (ensures JSON output)
   - **Message Formatting**:
     - Converts `ChatMessage[]` to OpenAI format
     - Adds system prompt as first message
     - Filters out system messages from history
     - Validates message content
   - **Response Parsing**:
     - Parses JSON response from LLM
     - Validates structure (requires `response_to_user` string)
     - Returns `LLMChatResponse` with `response_to_user` and optional `action`
   - **Error Handling**:
     - Missing API key: Returns fallback response (no error thrown)
     - Invalid messages: Throws validation error
     - API errors: Catches and throws with descriptive messages
     - Parse errors: Falls back to raw content as `response_to_user`
     - Rate limits: Detects and throws specific error message

3. **`actionParser`** (`lib/ai/actionParser.ts`):
   - **Note**: This parser is legacy code. The current implementation uses JSON responses from LLM directly.
   - Parses text responses into structured `ChatAction` objects (fallback for non-JSON responses)
   - Uses regex patterns to extract action types and item IDs
   - Fuzzy matches item names to find menu items
   - Handles malformed responses gracefully
   - Returns action objects: `{ type, itemId?, quantity?, message }`

### API Route

**`/api/chat`** (`app/api/chat/route.ts`):
- **Route**: POST `/api/chat`
- **Request Body**:
  ```typescript
  {
    messages: ChatMessage[],
    menu: Menu,
    cart: CartItem[]
  }
  ```
- **Validation**:
  - Validates `messages` array exists and is array
  - Validates `menu` exists and parses with `menuSchema`
  - Validates `cart` array exists and is array
  - Validates message format (role, content)
  - Validates cart item format (id, name, price, quantity)
- **Processing**:
  1. Parses and validates request body
  2. Calls `sendChatMessage(messages, menu, cart)`
  3. Returns JSON response with `response_to_user` and `action`
- **Response Format**:
  ```typescript
  {
    response_to_user: string,
    action: { type, itemId?, quantity? } | null,
    timestamp: string
  }
  ```
- **Error Handling**:
  - 400: Invalid request body or validation errors
  - 500: AI service configuration errors
  - 503: AI service temporarily unavailable (rate limits)
  - All errors return user-friendly messages in `response_to_user` field

### LLM Integration Approach

The system uses OpenAI's GPT models with a structured JSON response format:

1. **Prompt Engineering**:
   - System prompt includes full menu and cart context
   - Explicit instructions for JSON response format
   - Examples of correct action formats
   - Guidance on calculating cart totals

2. **JSON Response Format**:
   - LLM configured with `response_format: { type: 'json_object' }`
   - Required structure: `{ response_to_user: string, action: { type, itemId?, quantity? } | null }`
   - LLM calculates and includes updated cart totals in `response_to_user`

3. **Error Resilience**:
   - If JSON parsing fails, falls back to raw content
   - If API key missing, returns fallback response (no crash)
   - Network errors handled with user-friendly messages
   - Rate limit errors return 503 status

4. **Context Management**:
   - Full conversation history sent to LLM
   - Menu and cart state included in every request
   - System prompt regenerated with current state

### Action Extraction and Integration

#### Action Types

1. **`ADD_ITEM`**:
   - **Required**: `itemId` (string)
   - **Optional**: `quantity` (number, defaults to 1)
   - **Behavior**: Adds item to cart via `cartContext.addItem()`
   - **Validation**: 
     - Item must exist in menu
     - Quantity must be 1-100
     - If item already in cart, increments quantity

2. **`REMOVE_ITEM`**:
   - **Required**: `itemId` (string)
   - **Behavior**: Removes item from cart via `cartContext.removeItem()`
   - **Validation**: Item must exist in cart

3. **`UPDATE_QUANTITY`**:
   - **Required**: `itemId` (string), `quantity` (number)
   - **Behavior**: Updates item quantity via `cartContext.updateQuantity()`
   - **Validation**: 
     - Item must exist in cart
     - Quantity must be 1-100

4. **`SHOW_CART`**:
   - **Required**: None
   - **Behavior**: Opens cart drawer (via `onCartAction` callback)

5. **`CHECKOUT`**:
   - **Required**: None
   - **Behavior**: Opens checkout form (via `onCartAction` callback)
   - **Validation**: Cart must not be empty

6. **`ANSWER_QUESTION`**:
   - **Required**: None
   - **Behavior**: No cart action, just displays response

#### Integration Flow

1. **User Input**: User types message in `ChatInput`
2. **API Request**: `ChatAssistant` sends POST to `/api/chat` with:
   - Message history (all previous messages)
   - Current menu data
   - Current cart state
3. **LLM Processing**: 
   - API route calls `sendChatMessage()`
   - System prompt built with menu and cart context
   - OpenAI API called with conversation history
   - LLM returns JSON with `response_to_user` and `action`
4. **Action Execution**:
   - `ChatAssistant` receives response with `action` field
   - Validates action (item exists, valid quantity, etc.)
   - Executes action via `useCartContext()`:
     - `ADD_ITEM`: Calls `cartContext.addItem()` (may call multiple times for quantity > 1)
     - `REMOVE_ITEM`: Calls `cartContext.removeItem()`
     - `UPDATE_QUANTITY`: Calls `cartContext.updateQuantity()`
     - `CHECKOUT`: Calls `onCartAction('Opening checkout')`
   - Cart state updates trigger UI updates (drawer, badge, toasts)
5. **Response Display**: 
   - `response_to_user` displayed as assistant message
   - Message added to chat history
   - Loading state cleared

#### Integration Points

- **Cart Context**: `ChatAssistant` uses `useCartContext()` to access cart operations
- **Menu Data**: Menu passed as prop from server component (loaded from filesystem)
- **Cart State**: Cart state passed as prop (from `CartProvider` context)
- **Error Handling**: All errors return user-friendly messages, no crashes
- **Validation**: Actions validated before execution (item exists, valid quantities)

### State Management

- **Chat Messages**: Stored in component state (`useState<ChatMessageType[]>`)
- **Loading State**: Component-level `isLoading` state for UI feedback
- **Cart State**: Accessed via `useCartContext()` hook (from `CartProvider`)
- **Menu Data**: Passed as prop from server component (static, doesn't change)
- **No Global Chat State**: Each `ChatAssistant` instance is independent
- **Message History**: Maintained in component state, sent with each API request

### API Key Handling

#### Environment Variables

- **`OPENAI_API_KEY`**: Required for LLM functionality
  - Read from `process.env.OPENAI_API_KEY` (server-side only)
  - Validated in `getOpenAIClient()` function
  - If missing: Returns `null` client, `sendChatMessage()` returns fallback response
  - Never exposed to client-side code

- **`OPENAI_MODEL`**: Optional, defaults to `gpt-4o-mini`
  - Read from `process.env.OPENAI_MODEL`
  - Used in `chat.completions.create()` call
  - Can be changed to use different OpenAI models

#### Security Practices

1. **Server-Side Only**: API key only accessed in server-side code (`lib/ai/chatService.ts`, `/api/chat` route)
2. **No Client Exposure**: API key never sent to client or exposed in client-side code
3. **Error Handling**: Missing key handled gracefully (fallback response, no crash)
4. **Validation**: API key validated before making API calls
5. **Error Messages**: Generic error messages for configuration issues (no key details leaked)

#### Error Handling

- **Missing API Key**: 
  - `getOpenAIClient()` returns `null`
  - `sendChatMessage()` returns fallback response
  - User sees: "AI assistant is currently unavailable. Please use the menu to add items to your cart."
  
- **Invalid API Key**:
  - OpenAI API returns error
  - Caught and re-thrown as "AI service configuration error"
  - API route returns 500 with user-friendly message

- **Rate Limits**:
  - Detected in error message
  - Re-thrown as "AI service is temporarily unavailable due to high demand"
  - API route returns 503 status

- **Network Errors**:
  - Caught in `ChatAssistant` fetch call
  - User sees: "I'm having trouble connecting right now. Please check your internet connection and try again."

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

