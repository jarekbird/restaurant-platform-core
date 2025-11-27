PHASE 2 — Cart + Ordering Flow & Chatbot-Assisted Ordering Demo

Goal: Transform the preview demo into a fully functional ordering simulation that demonstrates the complete customer experience, including AI-powered ordering assistance.

Why This Phase Matters

These two features together give restaurant owners the "holy crap, this is real" moment:

1. Cart + Ordering Flow in Preview Mode — Makes the demo feel like a real ordering system
2. Chatbot-Assisted Ordering Demo — Demonstrates the AI-powered future of restaurant ordering

This combination closes deals by showing restaurant owners:
- "This is a real ordering system already."
- "This could replace 50% of your phone orders."

---

PHASE 2.1 — Add Full Cart to the Preview System

Goal: When a user visits /preview/[slug], they can browse the menu, add items to cart, open the cart drawer, fill out checkout form, and submit a mock order.

Current State

You already have:
- `useCart()` hook in `components/order/useCart.ts`
- `CartDrawer` component in `components/order/CartDrawer.tsx`
- `OrderButton` component in `components/order/OrderButton.tsx`
- `CheckoutForm` component in `components/order/CheckoutForm.tsx`

But these are not wired into the preview routes.

Tasks

2.1.1 Add Shopping Cart Provider at Preview Route Level

Create `components/order/CartProvider.tsx`:

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCart, CartItem } from './useCart';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
```

Wrap `/preview/[slug]/page.tsx` in `<CartProvider>`:

```typescript
import { CartProvider } from '@/components/order/CartProvider';

export default async function PreviewPage({ params }: PreviewPageProps) {
  // ... existing code ...
  
  return (
    <CartProvider>
      <RestaurantLayout config={config}>
        {/* ... existing content ... */}
      </RestaurantLayout>
    </CartProvider>
  );
}
```

2.1.2 Add Cart Drawer and Order Button to Layout

Update `components/layout/RestaurantLayout.tsx` or create a client wrapper component:

- Import `CartDrawer` and `OrderButton`
- Add state for cart drawer open/close
- Include `<OrderButton />` in the header/navigation
- Include `<CartDrawer />` with proper props from `useCartContext()`

The OrderButton should:
- Show cart item count badge
- Open the cart drawer on click
- Be visible and accessible in the preview layout

2.1.3 Wire "Add to Cart" Buttons in MenuItemCard

Update `components/menu/MenuItemCard.tsx`:

- Make it a client component (add `'use client'`)
- Import `useCartContext` from `CartProvider`
- Add an "Add to Cart" button
- Handle modifier groups simply:
  - For now: choose default/no modifiers
  - Future enhancements can add selection UI

```typescript
'use client';

import { useCartContext } from '@/components/order/CartProvider';
import { MenuItem } from '@/lib/schemas/menu';

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCartContext();
  
  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      modifiers: [], // Default to no modifiers for now
    });
  };
  
  return (
    <div>
      {/* ... existing card content ... */}
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
```

2.1.4 Add Remove from Cart Functionality

Update `components/order/CartDrawer.tsx`:

- Import `removeItem` and `updateQuantity` from cart context
- Add remove button (trash icon or "Remove" button) for each cart item
- Add quantity controls (+/- buttons) for each item
- When quantity reaches 0, automatically remove the item
- Show visual feedback when items are removed

```typescript
const handleRemoveItem = (itemId: string) => {
  removeItem(itemId);
  // Show toast notification: "Item removed from cart"
};

const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    handleRemoveItem(itemId);
  } else {
    updateQuantity(itemId, newQuantity);
  }
};
```

2.1.5 Connect Checkout Form to Cart

Update `components/order/CartDrawer.tsx`:

- Import `CheckoutForm` component
- Add state to show/hide checkout form
- When "Checkout" button is clicked, show the form
- Pass `onSubmit` handler to `CheckoutForm`

Create `placeOrder` function that:
- Logs order output to console (for demo purposes)
- Shows success toast/notification
- Empties cart via `clearCart()`
- Closes cart drawer

```typescript
const handleCheckout = (formData: CheckoutFormData) => {
  const order = {
    items: cart.items,
    customer: formData,
    total: cart.total,
    timestamp: new Date().toISOString(),
  };
  
  console.log('Order placed:', order);
  
  // Show success toast (implement toast system or use simple alert for now)
  alert('Order placed successfully!');
  
  cart.clearCart();
  onClose();
};
```

2.1.6 Add Order Confirmation Modal

Create `components/order/OrderConfirmationModal.tsx`:

- Simple modal component showing order confirmation
- Display order summary (items, total, customer name)
- "Close" button to dismiss
- Can replace the simple `alert()` from step 2.1.4

This provides a polished completion experience for the demo.

---

PHASE 2.2 — Add AI-Powered Chatbot-Assisted Ordering

Goal: Show a chatbot powered by real AI that can understand natural language, ask for menu items, confirm selections, add/remove items to/from cart, suggest sides or popular dishes, and complete a mock order.

Why This Matters

Restaurant owners hate phone orders because of:
- Chaos in the kitchen
- Missed calls
- Wrong orders
- Upsell opportunities missed
- Language barriers

A chatbot ordering assistant demonstrates: "This could replace 50% of your phone orders."

This phase implements real AI integration using an LLM API (OpenAI, Anthropic, or similar) to provide:
- Natural language understanding
- Contextual menu item matching
- Intelligent conversation flow
- Add/remove items from cart via chat
- Hooks into the existing cart system

Tasks

2.2.1 Create Chat Panel Component (Collapsed/Expandable Sidebar)

Create `components/chat/ChatAssistant.tsx`:

- Collapsible sidebar or bottom drawer
- Toggle button to open/close
- Chat message history area
- Input field for user messages
- Send button

Design considerations:
- Right-side drawer on desktop
- Bottom drawer on mobile
- Smooth animations for open/close
- Accessible (keyboard navigation, ARIA labels)

2.2.2 Build Chat Message Components

Create `components/chat/ChatMessage.tsx`:

- Display individual messages
- Distinguish between user and assistant messages
- Show timestamps (optional for demo)
- Support typing indicators (optional)

Create `components/chat/ChatInput.tsx`:

- Text input field
- Send button
- Enter key to submit
- Disabled state while processing

2.2.3 Set Up AI/LLM Integration

Create `lib/ai/chatService.ts`:

- Set up API client for LLM provider (OpenAI, Anthropic, etc.)
- Create function to send messages to LLM with context
- Include system prompt that defines the chatbot's role and capabilities
- Handle API errors and rate limiting

System prompt should include:
- Role: Restaurant ordering assistant
- Capabilities: Add/remove items, answer questions, suggest items, checkout
- Menu context: Full menu structure with items, categories, prices, descriptions
- Cart context: Current cart state (items, quantities, total)
- Instructions: Be helpful, confirm actions, suggest popular items

```typescript
export async function sendChatMessage(
  messages: ChatMessage[],
  menu: Menu,
  cart: CartItem[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(menu, cart);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // or preferred model
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
  });
  
  return response.choices[0].message.content;
}
```

2.2.4 Implement Action Extraction from AI Responses

Create `lib/ai/actionParser.ts`:

The AI responses should include structured actions that can be extracted:
- `ADD_ITEM` — Add item to cart
- `REMOVE_ITEM` — Remove item from cart
- `UPDATE_QUANTITY` — Update item quantity
- `SHOW_CART` — Display current cart
- `CHECKOUT` — Initiate checkout
- `SUGGEST_ITEMS` — Suggest menu items
- `ANSWER_QUESTION` — Answer menu-related questions

Use function calling or structured output from the LLM to extract actions:

```typescript
interface ChatAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'SHOW_CART' | 'CHECKOUT' | 'SUGGEST_ITEMS' | 'ANSWER_QUESTION';
  itemId?: string;
  quantity?: number;
  message: string;
}

export function parseChatAction(aiResponse: string, menu: Menu): ChatAction {
  // Parse AI response to extract structured action
  // Can use function calling, JSON mode, or regex parsing
}
```

Alternatively, use LLM function calling to get structured actions directly.

2.2.5 Implement Chat → Cart Integration (Add Items)

When user says "I want a California Roll" or "Add a miso soup":

- AI identifies the menu item from natural language
- Extract action: `ADD_ITEM` with itemId
- Call `addItem()` from cart context
- AI confirms addition to cart in response
- Show cart summary in chat
- Ask if they want anything else

Integration points:
- Import `useCartContext` in chat components
- When AI response contains `ADD_ITEM` action, call `addItem()`
- Update chat UI to show cart updates
- Show toast notification: "Item added to cart"

2.2.6 Implement Chat → Cart Integration (Remove Items)

When user says "Remove the California Roll" or "Take out the soup":

- AI identifies which item to remove from cart
- Extract action: `REMOVE_ITEM` with itemId
- Call `removeItem()` from cart context
- AI confirms removal in response
- Show updated cart summary
- Ask if they want to add something else

Integration points:
- When AI response contains `REMOVE_ITEM` action, call `removeItem()`
- Handle cases where item is not in cart (AI should clarify)
- Show toast notification: "Item removed from cart"
- Update chat UI to reflect cart changes

2.2.7 Implement Chat → Checkout

When user says "Yes, let's checkout" or "Checkout":

- Show cart summary in chat
- Ask for confirmation
- Trigger checkout form modal
- Complete order flow

This can either:
- Open the existing cart drawer with checkout form, OR
- Show checkout form inline in chat, OR
- Show a modal with checkout form

2.2.8 Add Example Conversation Starter Buttons

Display example prompts at the top of the chat panel:

- "What can I get?"
- "Order a miso soup"
- "Add two California Rolls"
- "Checkout"

These help restaurant owners try the chatbot during demos.

2.2.9 Integrate ChatAssistant into Preview Route

Update `app/preview/[slug]/page.tsx`:

- Import `ChatAssistant` component
- Pass menu data to chat component (via props or context)
- Include `<ChatAssistant />` in the layout

The chat should have access to:
- Menu data (for AI context and item matching)
- Cart context (for adding/removing items and showing cart state)
- API keys/environment variables for LLM service

---

PHASE 2.3 — Polish & Integration

Goal: Ensure cart and chatbot interactions feel seamless and the demo is polished.

Tasks

2.3.1 Toast Notification System

Create a simple toast system for:
- "Item added to cart"
- "Order placed successfully"
- Chatbot responses (optional)

Can use a library like `react-hot-toast` or build a simple custom solution.

2.3.2 Cart Persistence (Optional)

For demo purposes, consider:
- Persisting cart to localStorage
- Restoring cart on page refresh
- This makes the demo feel more robust

2.3.3 Error Handling

Add error handling for:
- LLM API failures (network errors, rate limits, API errors)
- Invalid menu item requests in chat (AI should handle gracefully)
- Cart operations failures
- Checkout form validation
- Timeout handling for slow AI responses
- Fallback responses when AI is unavailable

2.3.4 Mobile Responsiveness

Ensure:
- Cart drawer works well on mobile
- Chat assistant is accessible on mobile
- Touch interactions are smooth
- Layout doesn't break on small screens

2.3.5 Accessibility

Ensure:
- Keyboard navigation works
- Screen reader support
- ARIA labels on interactive elements
- Focus management for modals/drawers

---

PHASE 2.4 — Testing & Documentation

Goal: Ensure the features work reliably and are documented for future development.

Tasks

2.4.1 Unit Tests

Write tests for:
- `CartProvider` and `useCart` hook
- AI chat service (mock LLM responses)
- Action parser for extracting chat actions
- Cart calculations
- Add/remove item operations

2.4.2 Integration Tests

Test:
- Full cart flow (add → remove → update quantity → checkout)
- Chat → add item to cart
- Chat → remove item from cart
- Chat → checkout flow
- AI response handling and action extraction
- Multiple restaurant previews
- Error handling for AI API failures

2.4.3 Update Documentation

Update `docs/architecture.md` to include:
- Cart system architecture (add/remove/update operations)
- AI chat system architecture
- LLM integration approach
- Action extraction and parsing
- Integration points between chat and cart
- State management approach
- API key management and security

2.4.4 Demo Playbook Update

Update `docs/demo-playbook.md` with:
- How to demonstrate cart functionality
- How to demonstrate chatbot ordering
- Key talking points for each feature
- Common questions and answers

---

Expected Outcomes

After completing Phase 2, you will have:

✅ Full cart functionality in preview mode
- Users can add items to cart
- Users can remove items from cart
- Cart drawer with item management (add/remove/update quantity)
- Checkout form integration
- Order confirmation flow

✅ AI-powered chatbot-assisted ordering
- Interactive chat interface with real AI
- Natural language understanding
- Menu item discovery via chat
- Add/remove items from cart via chat
- Chat-to-cart integration (add and remove)
- Chat-to-checkout flow
- Intelligent suggestions and recommendations
- Example conversation starters

✅ Polished demo experience
- Seamless interactions
- Professional UI/UX
- Mobile responsive
- Accessible

✅ Ready for restaurant pitches
- Complete ordering simulation
- AI-powered ordering demonstration
- More compelling than competitors like BentoBox or Popmenu

---

Next Steps After Phase 2

Once Phase 2 is complete, you'll have a fully compelling demo that includes:

- Beautiful theme system
- Complete menu display
- Real cart functionality
- Mock ordering system
- Chat-assisted ordering
- AI menu ingestion pipeline
- Site scaffolding engine
- Multiple themes

At this point, you can confidently pitch to restaurants:

"Here is your new website, menu, ordering system, and AI-powered ordering assistant."

This is already more than competitors like BentoBox or Popmenu offer.

Future phases could include:
- Enhanced AI capabilities (multi-language support, dietary restrictions)
- Payment processing integration
- Order management system
- Multi-restaurant admin dashboard
- Real-time order tracking
- SMS/email notifications
- Voice ordering integration

---

Implementation Notes for AI Agents

This phase is designed to be AI-agent friendly:

1. Clear component boundaries
2. Well-defined interfaces
3. Existing hooks and utilities to build upon
4. Real AI integration with structured action extraction
5. Well-defined system prompts for consistent behavior

Each task can be implemented independently, making it suitable for parallel development or sequential agent work.

Key considerations:
- API key management: Use environment variables, never commit keys
- Rate limiting: Implement proper rate limiting for LLM API calls
- Error handling: Graceful degradation when AI is unavailable
- Cost management: Use appropriate models (e.g., gpt-4o-mini) for cost efficiency
- Action extraction: Use function calling or structured output for reliable action parsing
- Context management: Keep conversation history manageable (limit message history)
- Security: Validate all actions before executing (e.g., verify itemId exists in menu)

