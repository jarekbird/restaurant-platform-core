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

2.1.4 Connect Checkout Form to Cart

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

2.1.5 Add Order Confirmation Modal

Create `components/order/OrderConfirmationModal.tsx`:

- Simple modal component showing order confirmation
- Display order summary (items, total, customer name)
- "Close" button to dismiss
- Can replace the simple `alert()` from step 2.1.4

This provides a polished completion experience for the demo.

---

PHASE 2.2 — Add Chatbot-Assisted Ordering Demo

Goal: Show a chatbot that can ask for menu items, confirm selections, add items to cart, suggest sides or popular dishes, and complete a mock order.

Why This Matters

Restaurant owners hate phone orders because of:
- Chaos in the kitchen
- Missed calls
- Wrong orders
- Upsell opportunities missed
- Language barriers

A chatbot ordering assistant demonstrates: "This could replace 50% of your phone orders."

For the demo, you do NOT need real AI inference running in the client yet. You only need:
- A chatbot UI
- Some scripted responses
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

2.2.3 Create Simplified Chat Logic (Finite State Machine)

Create `components/chat/conversationLogic.ts`:

This acts as a tiny AI emulator that:
- Receives user input
- Returns response + next action
- Handles:
  - Keywords ("roll", "soup", "spicy tuna")
  - Category requests ("show me appetizers")
  - Quantity ("two California Rolls")
  - Checkout ("yes, let's checkout")

State machine states:
- `greeting` — Initial welcome message
- `browsing` — User is exploring menu
- `ordering` — User is selecting items
- `confirming` — Confirming item details
- `checkout` — Ready to checkout
- `completed` — Order placed

Create `components/chat/demoConversationStates.ts`:

Contains static prompts/responses for pitch mode. This can evolve into actual LLM prompts in Phase 3.

Example structure:
```typescript
export const conversationStates = {
  greeting: {
    message: "Hi! I'm here to help you order. What would you like today?",
    suggestions: ["What can I get?", "Show me the menu", "What's popular?"],
  },
  // ... more states
};
```

2.2.4 Implement Menu Keyword Matching

In `conversationLogic.ts`, implement:

- Menu item name matching (fuzzy or exact)
- Category matching
- Price queries
- Description keyword matching

The logic should:
- Read menu from context (passed from preview page)
- Match user input to menu items
- Return matched items with confidence
- Ask for clarification if ambiguous

2.2.5 Implement Chat → Cart Integration

When user says "I want a California Roll":

- Chat logic identifies the menu item
- Calls `addToCart(menuItem)` from cart context
- Confirms addition to cart
- Shows cart summary
- Asks if they want anything else

Integration points:
- Import `useCartContext` in chat components
- When chatbot reaches "order item" state, call `addItem()`
- Update chat UI to show cart updates

2.2.6 Implement Chat → Checkout

When user says "Yes, let's checkout" or "Checkout":

- Show cart summary in chat
- Ask for confirmation
- Trigger checkout form modal
- Complete order flow

This can either:
- Open the existing cart drawer with checkout form, OR
- Show checkout form inline in chat, OR
- Show a modal with checkout form

2.2.7 Add Example Conversation Starter Buttons

Display example prompts at the top of the chat panel:

- "What can I get?"
- "Order a miso soup"
- "Add two California Rolls"
- "Checkout"

These help restaurant owners try the chatbot during demos.

2.2.8 Integrate ChatAssistant into Preview Route

Update `app/preview/[slug]/page.tsx`:

- Import `ChatAssistant` component
- Pass menu data to chat component (via props or context)
- Include `<ChatAssistant />` in the layout

The chat should have access to:
- Menu data (for keyword matching)
- Cart context (for adding items)

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
- Invalid menu item requests in chat
- Cart operations failures
- Checkout form validation
- Network errors (if applicable)

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
- Chat conversation logic
- Menu keyword matching
- Cart calculations

2.4.2 Integration Tests

Test:
- Full cart flow (add → view → checkout)
- Chat → cart integration
- Chat → checkout flow
- Multiple restaurant previews

2.4.3 Update Documentation

Update `docs/architecture.md` to include:
- Cart system architecture
- Chat system architecture
- Integration points
- State management approach

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
- Cart drawer with item management
- Checkout form integration
- Order confirmation flow

✅ Chatbot-assisted ordering demo
- Interactive chat interface
- Menu item discovery via chat
- Chat-to-cart integration
- Chat-to-checkout flow
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
- Real LLM integration for chatbot (Phase 3)
- Payment processing integration
- Order management system
- Multi-restaurant admin dashboard
- Real-time order tracking
- SMS/email notifications

---

Implementation Notes for AI Agents

This phase is designed to be AI-agent friendly:

1. Clear component boundaries
2. Well-defined interfaces
3. Existing hooks and utilities to build upon
4. No external API dependencies (for demo)
5. Scripted responses (no real AI needed yet)

Each task can be implemented independently, making it suitable for parallel development or sequential agent work.

The chat system is intentionally simplified for Phase 2, with a clear path to upgrade to real LLM integration in Phase 3.

