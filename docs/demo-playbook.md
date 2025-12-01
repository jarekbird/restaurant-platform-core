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

This section provides detailed step-by-step instructions for demonstrating the complete cart flow, from adding items to checkout.

### Step 1: Adding Items to Cart

**Detailed Steps:**

1. **Navigate to Preview Page**
   - Open browser and go to `http://localhost:3000/preview/so-delicious`
   - Wait for page to fully load (you should see the hero section, menu, and hours/location)

2. **Locate Menu Section**
   - Scroll down to find the menu section
   - Menu items are organized by categories (e.g., Appetizers, Main Courses, Desserts)
   - Each menu item card displays: name, description, price, and "Add to Cart" button

3. **Add First Item**
   - Click the "Add to Cart" button on any menu item (e.g., "Miso Soup")
   - **Expected Behavior:**
     - A toast notification appears in the top-right corner (or bottom on mobile) with message: "Item added to cart"
     - The "Order Now" button in the header updates to show a badge with the number "1"
     - The button text may change to show item count (e.g., "Order (1)")

4. **Add Multiple Items**
   - Click "Add to Cart" on 2-3 more different items
   - **Expected Behavior:**
     - Each addition shows a toast notification
     - The badge count increases (e.g., "Order (3)")
     - All items are added to the cart

5. **Add Same Item Multiple Times**
   - Click "Add to Cart" on an item already in the cart
   - **Expected Behavior:**
     - Toast notification appears
     - Badge count increases
     - Quantity for that item will be shown as 2+ in the cart drawer

**Talking Point:** "Notice how the cart state updates in real-time. The badge count provides immediate visual feedback, and toast notifications confirm each action."

### Step 2: Viewing and Managing Cart

**Detailed Steps:**

1. **Open Cart Drawer**
   - Click the "Order Now" button in the header (the one with the badge count)
   - **Expected Behavior:**
     - On Desktop: Cart drawer slides in from the right side of the screen
     - On Mobile: Cart drawer slides up from the bottom as a bottom sheet
     - A dark backdrop (overlay) appears behind the drawer
     - The drawer shows "Cart" as the header with a close button (✕)

2. **Review Cart Contents**
   - **Expected Display:**
     - List of all items in the cart
     - For each item, you should see:
       - Item name (e.g., "Miso Soup")
       - Price per item (e.g., "$4.50")
       - Quantity (e.g., "× 2")
       - Subtotal for that item (e.g., "$9.00")
     - At the bottom: Total price for all items

3. **Adjust Item Quantities**
   - **Increase Quantity:**
     - Click the "+" button next to any item
     - **Expected:** Quantity increases, subtotal updates, total updates
   - **Decrease Quantity:**
     - Click the "−" button next to any item
     - **Expected:** Quantity decreases (minimum is 1), subtotal updates, total updates
   - **Decrease to Zero:**
     - Click "−" when quantity is 1
     - **Expected:** Item is removed from cart (or quantity stays at 1, depending on implementation)

4. **Remove Items**
   - Click the trash/delete icon (🗑️) next to any item
   - **Expected Behavior:**
     - Item is immediately removed from the cart
     - Cart total updates
     - Toast notification: "Item removed from cart"
     - If cart becomes empty, drawer shows "Your cart is empty" message

5. **Close Cart Without Checking Out**
   - Click the "✕" button in the header OR click the backdrop (dark overlay)
   - **Expected:** Cart drawer closes, but items remain in cart (cart persists)

**Talking Point:** "The cart drawer provides a clean, focused interface for managing items. Notice how all calculations update in real-time, and the interface adapts beautifully between mobile and desktop."

### Step 3: Checkout Process

**Detailed Steps:**

1. **Initiate Checkout**
   - With items in the cart, click the "Checkout" button at the bottom of the cart drawer
   - **Expected Behavior:**
     - Cart items list is replaced with a checkout form
     - A "Back to Cart" button appears at the bottom
     - Form fields are visible: Name, Phone, Notes (optional)

2. **Fill Out Checkout Form**
   - **Name Field (Required):**
     - Enter customer name (e.g., "John Doe")
     - Field is marked as required (browser validation)
   - **Phone Field (Required):**
     - Enter phone number (e.g., "555-123-4567")
     - Field accepts various phone formats
   - **Notes Field (Optional):**
     - Enter any special instructions (e.g., "No onions, please")
     - This field can be left empty

3. **Submit Order**
   - Click the "Submit Order" button
   - **Expected Behavior:**
     - Form validation runs (if fields are empty, browser shows validation messages)
     - Success toast notification: "Order placed successfully!"
     - Order confirmation modal appears with:
       - Customer name
       - List of ordered items with quantities
       - Total price
       - Order confirmation message
     - Cart is automatically cleared
     - Cart drawer closes
     - Badge count on "Order Now" button resets to 0

4. **Close Confirmation Modal**
   - Click the close button or "OK" button on the confirmation modal
   - **Expected:** Modal closes, user returns to the main page

**Talking Point:** "The checkout process is streamlined and user-friendly. Notice how the form validation ensures data quality, and the confirmation modal provides clear feedback that the order was placed successfully."

### Step 4: Verify Cart Persistence

**Detailed Steps:**

1. **Add Items and Reload**
   - Add 2-3 items to cart
   - Refresh the browser page (F5 or Cmd/Ctrl+R)
   - **Expected:** Cart items persist - badge count and cart contents remain the same

2. **Close Browser Tab and Reopen**
   - Close the browser tab completely
   - Reopen and navigate back to the preview page
   - **Expected:** Cart items are still there (localStorage persistence)

**Talking Point:** "Cart state persists across page reloads and browser sessions using localStorage. This ensures users don't lose their selections if they accidentally refresh or navigate away."

### Key Talking Points for Cart Flow

- **Cart Persistence**: Cart state persists in localStorage (survives page reload and browser close/reopen)
- **Mobile Responsive**: Cart drawer adapts to mobile (bottom sheet) and desktop (right sidebar) for optimal UX
- **Accessibility**: Full keyboard navigation support, ARIA labels for screen readers, proper focus management
- **Toast Notifications**: Visual feedback for all cart operations (add, remove, checkout)
- **Real-time Updates**: All calculations (subtotals, totals) update instantly without page refresh
- **User-Friendly Interface**: Clear visual hierarchy, intuitive controls, and helpful error messages

### Answers to Likely Questions

**Q: What happens if I add the same item multiple times?**
A: The quantity increases for that item. In the cart drawer, you'll see the item listed once with a quantity of 2, 3, etc., and you can adjust it using the +/- buttons.

**Q: Can I remove items from the cart?**
A: Yes, you can remove items in two ways: 1) Use the trash icon (🗑️) to remove an item completely, or 2) Use the "−" button to decrease quantity until it reaches 1 (or 0, depending on implementation).

**Q: What happens if I close the cart drawer without checking out?**
A: Your items remain in the cart. You can reopen the cart drawer at any time, and all items will still be there. The cart persists even if you reload the page.

**Q: Is there a minimum order amount?**
A: Currently, there is no minimum order amount enforced in the demo. This can be configured per restaurant in the restaurant configuration.

**Q: Can I edit my order after submitting?**
A: Once an order is submitted, it cannot be edited through the UI. The order is logged to the console (in demo mode) and the cart is cleared. In a production system, you would need to contact the restaurant directly.

**Q: What information is required for checkout?**
A: Name and phone number are required fields. Notes are optional but useful for special instructions or dietary restrictions.

**Q: How does the cart work on mobile vs desktop?**
A: On desktop, the cart appears as a right-side drawer. On mobile, it appears as a bottom sheet that slides up from the bottom, which is more thumb-friendly and follows mobile UI best practices.

## AI Chatbot Ordering Flow Demo

This section provides detailed step-by-step instructions for demonstrating the AI-powered chatbot ordering flow, from starting a chat session to completing checkout via chat.

### Step 1: Starting a Chat Session

**Detailed Steps:**

1. **Navigate to Preview Page with Chat Enabled**
   - Open browser and go to `http://localhost:3000/preview/so-delicious`
   - Ensure the restaurant has `orderOnlineEnabled: true` in its configuration
   - Wait for page to fully load

2. **Locate Chat Assistant Button**
   - Look for a floating chat button, typically positioned:
     - Bottom-right corner of the screen (desktop)
     - Bottom-right corner (mobile, may be fixed position)
   - The button may show an icon (chat bubble, message icon, or similar)
   - Button may have text like "Chat" or "Order Assistant"

3. **Open Chat Panel**
   - Click the chat assistant button
   - **Expected Behavior:**
     - Chat panel opens (side panel on desktop, bottom drawer on mobile)
     - Chat interface appears with:
       - Chat header (e.g., "Order Assistant" or restaurant name)
       - Message history area (initially empty or with welcome message)
       - Input field at the bottom
       - Send button or enter key to send messages
     - If this is the first time opening, you may see conversation starter buttons

**Talking Point:** "The chat interface provides a natural, conversational way to order. It's accessible from anywhere on the page and works seamlessly on both mobile and desktop."

### Step 2: Using Conversation Starter Buttons

**Detailed Steps:**

1. **Identify Starter Buttons**
   - When chat opens with empty history, you'll see quick-action buttons such as:
     - "What can I get?" - Asks about menu options
     - "Order a [menu item]" - Example: "Order a California Roll"
     - "Add two [menu item]" - Example: "Add two Miso Soups"
     - "Checkout" - Proceeds to checkout (if cart has items)

2. **Click a Starter Button**
   - Click any of the conversation starter buttons
   - **Expected Behavior:**
     - The button text is automatically sent as a message
     - Message appears in the chat history as a user message
     - AI processes the request and responds
     - Response appears in the chat as an assistant message

3. **Observe AI Response**
   - The AI will respond appropriately to the starter button clicked
   - For "What can I get?", AI may list menu categories or popular items
   - For ordering buttons, AI will add items to cart and confirm

**Talking Point:** "These starter buttons help users get started quickly, especially if they're not sure what to say. They demonstrate common use cases and make the interface more approachable."

### Step 3: Adding Items via Chat

**Detailed Steps:**

1. **Type a Natural Language Request**
   - In the chat input field, type a request such as:
     - "Add miso soup"
     - "I'd like two California rolls"
     - "Can I get a spicy tuna roll?"
     - "Add one edamame to my order"
   - Press Enter or click the Send button

2. **Observe AI Processing**
   - **Expected Behavior:**
     - Your message appears in chat history as a user message
     - AI may show a "typing" indicator or loading state
     - AI processes the request (this may take 1-3 seconds)

3. **Review AI Response**
   - **Expected AI Response:**
     - Confirmation message in chat (e.g., "Added Miso Soup to your cart")
     - Cart summary displayed in chat showing:
       - List of items with quantities
       - Individual item prices
       - Total price
     - Toast notification appears: "Item added to cart"
     - Cart badge count in header updates

4. **Add Multiple Items in Sequence**
   - Continue the conversation by typing more requests:
     - "Add a salmon roll"
     - "I'll also take two gyoza"
   - **Expected:** Each request is processed independently, cart updates after each addition

5. **Try Different Phrasings**
   - Test natural language variations:
     - "I want a..." instead of "Add..."
     - "Can I have..." instead of "I'd like..."
     - "Put in..." instead of "Add to cart..."
   - **Expected:** AI understands various phrasings and adds items correctly

**Talking Point:** "The AI understands natural language, so users don't need to learn specific commands. They can order the way they would talk to a server in a restaurant."

### Step 4: Removing Items via Chat

**Detailed Steps:**

1. **Remove a Specific Item**
   - Type a removal request such as:
     - "Remove the miso soup"
     - "Take out the California roll"
     - "I don't want the edamame anymore"
     - "Remove one salmon roll" (if quantity > 1)
   - Press Enter or click Send

2. **Observe Removal Process**
   - **Expected Behavior:**
     - AI confirms removal in chat (e.g., "Removed Miso Soup from your cart")
     - Cart summary updates in chat showing remaining items
     - Toast notification: "Item removed from cart"
     - Cart badge count decreases
     - If removing reduces quantity (not complete removal), quantity updates

3. **Remove Item Not in Cart**
   - Try: "Remove something that doesn't exist" or "Take out the pizza"
   - **Expected:** AI responds with helpful error message explaining the item is not in the cart

**Talking Point:** "Users can easily modify their order through conversation, just like they would with a human server. The AI provides clear feedback on all actions."

### Step 5: Checking Cart via Chat

**Detailed Steps:**

1. **Ask About Cart Contents**
   - Type questions such as:
     - "What's in my cart?"
     - "Show my cart"
     - "What did I order?"
     - "Cart summary please"
   - Press Enter or click Send

2. **Review Cart Summary**
   - **Expected AI Response:**
     - List of all items in cart with quantities
     - Individual item prices
     - Subtotal for each item (price × quantity)
     - Total price for entire order
     - Formatted in a readable way (may be in a code block or structured format)

3. **Ask About Specific Items**
   - Try: "How many California rolls do I have?" or "What's the total?"
   - **Expected:** AI provides specific information about the cart

**Talking Point:** "Users can check their cart at any time through conversation, without needing to open the cart drawer. This makes the ordering process more conversational and less transactional."

### Step 6: Adjusting Quantities via Chat

**Detailed Steps:**

1. **Update Item Quantity**
   - Type requests such as:
     - "Change miso soup to 3"
     - "Make it 2 California rolls instead"
     - "Update edamame quantity to 4"
   - Press Enter or click Send

2. **Observe Quantity Update**
   - **Expected Behavior:**
     - AI confirms the quantity change in chat
     - Cart summary updates showing new quantities
     - Toast notification may appear
     - Cart totals recalculate automatically

**Talking Point:** "Quantity adjustments are handled naturally through conversation, making it easy for users to modify their order without navigating complex UI controls."

### Step 7: Checkout via Chat

**Detailed Steps:**

1. **Initiate Checkout Through Chat**
   - Type checkout requests such as:
     - "Checkout"
     - "I'm ready to order"
     - "Let's checkout"
     - "Place my order"
   - Press Enter or click Send

2. **Observe Checkout Process**
   - **Expected Behavior:**
     - AI confirms checkout initiation in chat (e.g., "Opening checkout form...")
     - Checkout form opens (either in cart drawer or as a modal)
     - Chat may show a message like "Please fill out the checkout form to complete your order"

3. **Complete Checkout Form**
   - Fill in the checkout form as normal:
     - Name (required)
     - Phone (required)
     - Notes (optional)
   - Click "Submit Order"

4. **Verify Order Completion**
   - **Expected Behavior:**
     - Success toast: "Order placed successfully!"
     - Order confirmation modal appears
     - Cart is cleared
     - Chat may show a confirmation message
     - Cart badge resets to 0

**Talking Point:** "The entire ordering flow can be completed through conversation, from adding items to checkout. This creates a seamless, natural ordering experience."

### Step 8: Error Handling and Edge Cases

**Detailed Steps:**

1. **Request Non-Existent Item**
   - Type: "Add something that doesn't exist" or "I want a pizza" (if pizza isn't on menu)
   - **Expected Behavior:**
     - AI responds with helpful error message
     - Suggests similar items if available
     - Explains that the item is not on the menu
     - Does not add anything to cart

2. **Remove Item Not in Cart**
   - Type: "Remove pizza" when pizza is not in cart
   - **Expected:** AI explains that the item is not currently in the cart

3. **Ambiguous Requests**
   - Try: "Add a roll" (when multiple roll types exist)
   - **Expected:** AI may ask for clarification or suggest available roll options

4. **Empty Cart Operations**
   - Try: "Checkout" when cart is empty
   - **Expected:** AI explains that the cart is empty and suggests adding items first

**Talking Point:** "The AI handles errors gracefully and provides helpful guidance. It understands context and can clarify ambiguous requests, making the experience user-friendly even when things go wrong."

### Step 9: Combining Chat and Cart Drawer

**Detailed Steps:**

1. **Add Items via Chat, View in Cart Drawer**
   - Add items using chat (e.g., "Add miso soup")
   - Open the cart drawer by clicking "Order Now" button
   - **Expected:** Items added via chat appear in the cart drawer

2. **Add Items via Cart, Check via Chat**
   - Add items using the "Add to Cart" button on menu items
   - Ask chat: "What's in my cart?"
   - **Expected:** Chat shows all items, including those added via UI buttons

3. **Remove via Chat, Verify in Drawer**
   - Remove an item via chat (e.g., "Remove miso soup")
   - Open cart drawer
   - **Expected:** Item is no longer in cart drawer

**Talking Point:** "Chat and the traditional cart UI are fully integrated. Users can switch between conversation and UI controls seamlessly, and all actions are synchronized in real-time."

### Key Talking Points for AI Chatbot Flow

- **Natural Language Processing**: Users can order in conversational language without learning specific commands
- **Context Awareness**: AI knows the full menu and current cart state, allowing for intelligent responses
- **Action Extraction**: AI responses are parsed into structured actions (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CHECKOUT)
- **Error Handling**: Graceful handling of invalid requests with helpful error messages and suggestions
- **Real-time Integration**: Chat actions update the cart immediately, and cart changes are reflected in chat context
- **Conversational UX**: The entire ordering flow can be completed through natural conversation
- **Accessibility**: Chat interface supports keyboard navigation and screen readers

### Answers to Likely Questions

**Q: How does the AI know what items are on the menu?**
A: The AI receives the full menu data as context with each request. This allows it to understand menu items, prices, and categories, and match user requests to actual menu items.

**Q: Can I use the chat and the regular cart buttons at the same time?**
A: Yes! Chat and the cart UI are fully integrated. You can add items via chat and view them in the cart drawer, or add items via buttons and check them via chat. All actions are synchronized.

**Q: What happens if the AI doesn't understand my request?**
A: The AI will respond with a helpful error message and may suggest alternatives. For ambiguous requests (like "add a roll" when multiple rolls exist), it may ask for clarification or list available options.

**Q: Can I checkout entirely through chat?**
A: Yes! You can add items, adjust quantities, and initiate checkout all through chat. The checkout form will open, and you complete it as normal, but the entire flow can be conversational.

**Q: Does the chat remember our conversation?**
A: Yes, the chat maintains conversation history during the session. The AI uses this context to understand references like "remove it" or "add another one." However, chat history does not persist across page reloads (though cart state does).

**Q: What if I want to order something with modifications?**
A: Currently, modifications can be added in the Notes field during checkout. Future enhancements may allow specifying modifications directly in chat (e.g., "Add a California roll, no cucumber").

**Q: How fast is the AI response?**
A: Response time typically ranges from 1-3 seconds, depending on the complexity of the request and API response time. A loading indicator shows while the AI is processing.

**Q: Can the AI handle multiple items in one request?**
A: Yes! You can say things like "Add two miso soups and one California roll" and the AI will add all items in a single request.

**Q: What languages does the chatbot support?**
A: The chatbot primarily supports English, but the underlying AI model may understand other languages. The menu and interface are configured per restaurant and may support multiple languages.

**Q: Is there a way to clear the chat history?**
A: Currently, chat history persists during the session. Closing and reopening the chat panel may reset the history, depending on implementation. Future enhancements may include a "Clear chat" option.

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

