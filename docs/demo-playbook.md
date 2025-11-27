# Demo Playbook

This document provides a clear guide for demonstrating the restaurant-platform-core application.

## Starting the Core App

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Open `http://localhost:3000` in your browser
   - The app will be running with hot reload enabled

## Viewing Preview Pages

### Preview So Delicious Restaurant

1. Navigate to: `http://localhost:3000/preview/so-delicious`
2. You should see:
   - Hero section with restaurant name and cuisine
   - Full menu with categories and items
   - Hours and location information
   - "Order Now" call-to-action button
   - Theme: `sushi-dark` (dark theme with black/gray colors)

### Preview Warm Cafe Restaurant

1. Navigate to: `http://localhost:3000/preview/cafe-warm`
2. You should see:
   - Different theme: `cafe-warm` (warm amber colors)
   - Coffee and pastries menu
   - Different restaurant information

## Cart Flow Demo

### Adding Items to Cart

1. Navigate to any preview page (e.g., `http://localhost:3000/preview/so-delicious`)
2. Scroll to the menu section
3. Click "Add to Cart" on any menu item
4. Observe:
   - Toast notification: "Item added to cart"
   - Order button in header shows item count badge
5. Add multiple items to see count increase

### Viewing and Managing Cart

1. Click the "Order Now" button in the header
2. Cart drawer slides in from the right (desktop) or bottom (mobile)
3. In the cart drawer:
   - See all items with quantities and prices
   - Use +/- buttons to adjust quantities
   - Click "Remove" to remove items
   - See total price at bottom
4. Click "Checkout" button to proceed

### Checkout Process

1. Fill in checkout form:
   - Name (required)
   - Phone (required)
   - Notes (optional)
2. Click "Submit Order"
3. Observe:
   - Success toast: "Order placed successfully!"
   - Order confirmation modal appears
   - Cart is cleared
   - Cart drawer closes

### Key Talking Points

- **Cart Persistence**: Cart state persists in localStorage (survives page reload)
- **Mobile Responsive**: Cart drawer adapts to mobile (bottom sheet) and desktop (right sidebar)
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management
- **Toast Notifications**: Visual feedback for all cart operations

## AI Chatbot Ordering Flow Demo

### Starting a Chat Session

1. Navigate to a preview page with `orderOnlineEnabled: true`
2. Look for the chat assistant button (usually bottom-right)
3. Click to open the chat panel

### Conversation Starter Buttons

When chat opens with empty history, you'll see buttons:
- "What can I get?"
- "Order a [menu item]"
- "Add two [menu item]"
- "Checkout"

Click any button to send that message automatically.

### Adding Items via Chat

1. Type or click: "Add miso soup" or "I'd like two California rolls"
2. AI processes the request and:
   - Adds item(s) to cart
   - Shows confirmation message in chat
   - Displays cart summary with total
   - Shows toast notification

### Removing Items via Chat

1. Type: "Remove the miso soup" or "Take out the California roll"
2. AI:
   - Removes item from cart
   - Confirms removal
   - Updates cart summary
   - Shows toast notification

### Checking Cart via Chat

1. Type: "What's in my cart?" or "Show my cart"
2. AI responds with:
   - List of items with quantities
   - Individual prices
   - Total price

### Checkout via Chat

1. Type: "Checkout" or "I'm ready to order"
2. AI:
   - Opens checkout form
   - Confirms in chat message
3. Complete checkout form as normal

### Error Handling Demo

1. Try: "Add something that doesn't exist"
2. AI responds with helpful error message
3. Try: "Remove item not in cart"
4. AI explains item is not in cart

### Key Talking Points

- **Natural Language**: Users can order in conversational language
- **Context Aware**: AI knows menu items and current cart state
- **Action Extraction**: AI responses parsed into structured actions
- **Error Handling**: Graceful handling of invalid requests
- **Integration**: Chat actions update cart in real-time

## Ingesting Menus

### Prepare Input File

1. Create a text file with unstructured menu data:
   ```bash
   echo "APPETIZERS
   Bruschetta - \$8.99
   Wings - \$12.99
   
   MAIN COURSES
   Pizza - \$15.99
   Pasta - \$14.99" > ingestion/input/menu.txt
   ```

### Run Ingestion Script

**Note**: The LLM function is currently a placeholder. To fully test, you would need to implement `callLLMToGenerateMenuJson` in `scripts/llm-menu.ts`.

For now, the script structure is in place and will:
1. Read the input file
2. Call the LLM function (currently throws error)
3. Validate the output
4. Write to `data/restaurants/<slug>/menu.json`

Once implemented, usage would be:
```bash
npm run ingest-menu ingestion/input/menu.txt restaurant-slug
```

## Scaffolding a New Site

### Step 1: Ensure Restaurant Data Exists

The restaurant must have data in `data/restaurants/<slug>/`:
- `config.json` - Restaurant configuration
- `menu.json` - Menu data

### Step 2: Run Scaffold Script

```bash
npm run scaffold-site <restaurantSlug> <outputPath>
```

**Example**:
```bash
npm run scaffold-site so-delicious ../so-delicious-site
```

This will:
- Copy `templates/site` to the output path
- Copy restaurant data files to the new site's `data/` directory
- Update `package.json` with restaurant-specific values

### Step 3: Run the New Site

```bash
cd ../so-delicious-site
npm install
npm run dev
```

The new site will be available at `http://localhost:3000` and will display the restaurant's menu and information.

## Complete Demo Flow

Here's a complete demonstration flow:

### 1. Start Core App
```bash
cd restaurant-platform-core
npm install
npm run dev
```

### 2. View Preview Pages
- Open `http://localhost:3000/preview/so-delicious`
- Open `http://localhost:3000/preview/cafe-warm`
- Compare the different themes and menus

### 3. Scaffold a New Site
```bash
# In a new terminal
npm run scaffold-site so-delicious ../demo-site
cd ../demo-site
npm install
npm run dev
```

### 4. View Scaffolded Site
- Open `http://localhost:3000` (the new site)
- Verify it displays the restaurant data
- Note it's a standalone Next.js app

## Testing

### Run All Tests
```bash
npm test -- --run
```

### Run Specific Test Suite
```bash
npm test -- --run test/components/MenuItemCard.spec.tsx
```

### Run Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Preview Page Not Loading

- Check that restaurant data exists in `data/restaurants/<slug>/`
- Verify both `config.json` and `menu.json` are present
- Check browser console for errors
- Verify the route is correct: `/preview/<slug>`

### Scaffold Script Fails

- Ensure restaurant data exists before scaffolding
- Check that output path is writable
- Verify template directory exists at `templates/site/`

### Tests Failing

- Run `npm install` to ensure dependencies are installed
- Check that all required data files exist
- Verify TypeScript compilation: `npm run build`

### Build Errors

- Check for TypeScript errors: `npm run build`
- Verify all imports are correct
- Check that all required files exist

## Next Steps

After completing the demo:

1. **Implement LLM Integration**: Complete `callLLMToGenerateMenuJson` to enable menu ingestion
2. **Add More Restaurants**: Create additional restaurant data files
3. **Customize Themes**: Add or modify themes in `lib/themes/index.ts`
4. **Enhance Components**: Improve styling and functionality
5. **Add Features**: Implement cart functionality, ordering, etc.

See `docs/ai-tasks.md` for a list of future tasks.

