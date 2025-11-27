PHASE 2 — EXECUTION ORDER

This file breaks the Phase 2 master plan into a concrete, dependency-aware execution order.  
Each numbered item is intended to be a focused unit of work for an AI agent, with automated tests added once the relevant code exists.

1. Review existing cart-related code
   - Open `components/order/useCart.ts` and understand the current API (`addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total`, `itemCount`).
   - Open `components/order/CartDrawer.tsx`, `components/order/OrderButton.tsx`, and `components/order/CheckoutForm.tsx` to understand current props and responsibilities.

2. Create `CartProvider` context shell
   - Add `components/order/CartProvider.tsx` with a React context typed to the `useCart` return value.
   - Export `CartProvider` and `useCartContext` (throwing if used outside provider).

3. Wire `CartProvider` to `useCart`
   - Inside `CartProvider`, call `useCart()` and pass its value to the context provider.
   - Ensure `CartProvider` is a client component (`'use client'`).

4. Wrap preview route with `CartProvider`
   - Update `app/preview/[slug]/page.tsx` to wrap the existing layout/content in `<CartProvider>`.
   - Verify that preview page remains server-compatible (client components only where needed).

5. Update `RestaurantLayout` (or create a client wrapper) to be cart-aware
   - Decide whether to make `components/layout/RestaurantLayout.tsx` a client component or introduce a `RestaurantLayoutClientWrapper`.
   - Ensure whichever component is client-side can consume `useCartContext`.

6. Integrate `OrderButton` into layout
   - Import `OrderButton` into the chosen client layout component.
   - Add a cart drawer open/close state (`isCartOpen`, `setIsCartOpen`) and wire it to the button click.
   - Pass the cart `itemCount` from `useCartContext` to `OrderButton` so it can display the badge.

7. Integrate `CartDrawer` into layout
   - Import `CartDrawer` into the same component that manages the open/close state.
   - Pass `isOpen`, `onClose`, and `items` from `useCartContext` into `CartDrawer`.
   - Ensure basic drawer open/close behavior works with static cart data.

8. Convert `MenuItemCard` to a client component
   - Add `'use client'` to `components/menu/MenuItemCard.tsx`.
   - Ensure props and imports still compile after this change.

9. Wire "Add to Cart" button in `MenuItemCard`
   - Import `useCartContext` into `MenuItemCard`.
   - Add an "Add to Cart" button that calls `addItem` with `{ id, name, price, modifiers: [] }`.
   - Confirm that clicking the button adds items to the cart and updates `itemCount` and total.

10. Extend `CartDrawer` props to support remove and quantity updates
    - Update `CartDrawer` props to accept callbacks for `onRemoveItem(itemId: string)` and `onUpdateQuantity(itemId: string, quantity: number)`.
    - Update all usages of `CartDrawer` in the codebase to pass these callbacks (initially as no-ops if needed).

11. Implement remove-from-cart behavior in layout using `useCartContext`
    - In the layout that renders `CartDrawer`, use `useCartContext` to derive `removeItem` and `updateQuantity`.
    - Implement `handleRemoveItem` and `handleUpdateQuantity` wrappers that call the hook functions.
    - Pass these handlers down as `onRemoveItem` and `onUpdateQuantity` props to `CartDrawer`.

12. Implement remove and quantity UI controls in `CartDrawer`
    - For each cart line item, add a "Remove" button or trash icon that calls `onRemoveItem(item.id)`.
    - Add +/- quantity buttons (or a numeric input) that call `onUpdateQuantity(item.id, newQuantity)`.
    - Ensure total recalculates correctly when quantities change or items are removed.

13. Integrate `CheckoutForm` into `CartDrawer`
    - Import `CheckoutForm` into `CartDrawer`.
    - Add local state to toggle showing the checkout form vs. the cart items list.
    - Render a "Checkout" button that toggles the form visible.

14. Implement `placeOrder` logic in `CartDrawer`
    - Define a `handleCheckout(formData)` function that:
      - Builds an order payload from `cart.items`, `cart.total`, and checkout form data.
      - Logs the order to the console.
      - Shows a simple success notification (temporarily `alert`).
      - Calls `clearCart` and `onClose`.
    - Wire `handleCheckout` as the `onSubmit` handler for `CheckoutForm`.

15. Create `OrderConfirmationModal` component
    - Add `components/order/OrderConfirmationModal.tsx` with a basic modal.
    - Accept props for order summary (items, total, customer name) and `onClose`.
    - Ensure keyboard and screen-reader-friendly semantics (focus trap, `role="dialog"`, ARIA labels).

16. Replace `alert` with `OrderConfirmationModal`
    - Refactor `handleCheckout` to set state to show `OrderConfirmationModal` instead of calling `alert`.
    - Pass the order summary into the modal.
    - Ensure closing the modal clears the cart and closes the drawer.

17. Verify full cart flow manually
    - From `/preview/[slug]`, add items, open cart, adjust quantities, remove items, and complete checkout.
    - Confirm totals, counts, and clearing behavior all work end-to-end.

18. Scaffold chat UI container (`ChatAssistant`)
    - Create `components/chat/ChatAssistant.tsx` as a client component.
    - Add layout for a collapsible sidebar (desktop) or bottom drawer (mobile).
    - Implement toggle button to open/close the chat panel.

19. Implement chat message display component
    - Create `components/chat/ChatMessage.tsx` to render a single message.
    - Support styling differences for user vs. assistant messages.
    - Optionally include timestamps and a simple typing indicator hook-in.

20. Implement chat input component
    - Create `components/chat/ChatInput.tsx` with a text input and send button.
    - Support `Enter` to submit and disabled state while a message is in-flight.
    - Expose an `onSend(message: string)` callback.

21. Integrate `ChatMessage` and `ChatInput` into `ChatAssistant`
    - Inside `ChatAssistant`, manage local chat history state (array of messages).
    - Render the history using `ChatMessage` and the input using `ChatInput`.
    - Wire `onSend` to append a user message and trigger an AI call (to be implemented).

22. Define shared chat types
    - Add a small types module (e.g., `lib/ai/types.ts`) defining `ChatMessage`, `ChatRole`, and `ChatAction`.
    - Ensure types align with how `chatService` and `actionParser` will be implemented.

23. Implement `buildSystemPrompt` helper
    - Add a `buildSystemPrompt` function in `lib/ai/chatService.ts` (or a nearby helper).
    - Accept `menu` and `cart` and encode them into a concise system prompt, including role and capabilities.

24. Implement basic `sendChatMessage` wrapper (server-side)
    - In `lib/ai/chatService.ts`, implement `sendChatMessage(messages, menu, cart)` using the chosen LLM SDK.
    - Ensure this module is server-only (no direct use in client components).
    - Handle core error cases (network errors, API errors) and throw structured errors.

25. Create `/app/api/chat/route.ts` API handler
    - Implement a Next.js route handler that:
      - Validates the incoming request body (messages, menuId or menu data, cart snapshot).
      - Calls `sendChatMessage` with appropriate context.
      - Returns the raw AI response and any structured data if available.
    - Ensure secrets are read from environment variables in this route (never from client).

26. Implement `actionParser` to extract actions from AI responses
    - Create `lib/ai/actionParser.ts` and implement `parseChatAction(aiResponse, menu)`.
    - Support action types: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `SHOW_CART`, `CHECKOUT`, `SUGGEST_ITEMS`, `ANSWER_QUESTION`.
    - Initially implement a simple parsing strategy (e.g., JSON mode or function calling contract).

27. Add menu lookup helpers for chat
    - Implement helper functions (e.g., `findMenuItemByName(menu, name)`) for fuzzy/exact matching.
    - Ensure helpers consider categories, item names, and synonyms where possible.

28. Implement client-side chat service wrapper
    - Create a small client-side helper (e.g., `lib/ai/chatClient.ts`) that posts to `/api/chat`.
    - Handle loading state, basic retries, and mapping of response shape to frontend types.

29. Integrate AI call into `ChatAssistant`
    - On `onSend` in `ChatAssistant`, call the client chat helper with:
      - Current conversation history.
      - Current menu (or a menu identifier the server can use).
      - Current cart snapshot from `useCartContext`.
    - Append an assistant "typing…" placeholder while waiting, then replace it with the real AI message.

30. Wire `actionParser` results to cart operations
    - After receiving an AI response from `/api/chat`, run it through `parseChatAction`.
    - Based on the parsed `ChatAction`, call `addItem`, `removeItem`, or `updateQuantity` from `useCartContext`.
    - Append system/assistant confirmation messages reflecting what changed in the cart.

31. Implement chat-driven add-to-cart flow
    - Ensure phrases like "Add two California Rolls" result in correct cart updates via `ADD_ITEM` and `UPDATE_QUANTITY`.
    - Update chat history with a confirmation and a brief cart summary.

32. Implement chat-driven remove-from-cart flow
    - Ensure phrases like "Remove the California Roll" result in item removal via `REMOVE_ITEM`.
    - Handle ambiguous matches by having the AI ask clarifying questions.
    - Update chat history with confirmation of removal and updated cart summary.

33. Implement chat-driven checkout flow
    - Map a `CHECKOUT` action from chat to opening the existing cart drawer and/or checkout form.
    - Have the assistant message explain that the checkout form is now open.
    - Confirm order completion in chat after the user submits the checkout form.

34. Add example conversation starter buttons
    - In `ChatAssistant`, render buttons such as "What can I get?", "Order a miso soup", "Add two California Rolls", and "Checkout".
    - On click, pre-fill or send these messages through the same flow as typed input.

35. Integrate `ChatAssistant` into preview layout
    - Import `ChatAssistant` into `app/preview/[slug]/page.tsx` or a layout wrapper.
    - Pass menu data (or an identifier) and ensure `ChatAssistant` is within `CartProvider` so it can use `useCartContext`.
    - Verify cart changes initiated from chat are reflected in the UI cart drawer and badge.

36. Implement toast notification system
    - Introduce a simple toast solution (third-party or custom) at the app root or layout level.
    - Expose a hook (e.g., `useToast`) to trigger messages from cart and chat components.

37. Add toasts for cart and chat events
    - Show "Item added to cart" when `addItem` is called (from button or chat).
    - Show "Item removed from cart" when `removeItem` is called.
    - Show "Order placed successfully" after checkout completes.
    - Optionally show brief notifications for important chatbot events or errors.

38. Implement cart persistence (optional)
    - Persist cart state to `localStorage` (or similar) in `useCart`.
    - Restore persisted cart on app load.
    - Ensure hydration logic avoids mismatches between server and client.

39. Harden error handling for AI and cart operations
    - Add robust try/catch around calls to `/api/chat` and `sendChatMessage`.
    - Implement fallbacks when AI is unavailable (e.g., friendly error message in chat).
    - Validate all parsed actions (e.g., verify `itemId` exists in the menu before mutating cart).

40. Ensure mobile responsiveness for cart and chat
    - Test cart drawer on small screens and adjust layout as needed.
    - Ensure `ChatAssistant` behaves as a bottom sheet or otherwise mobile-friendly panel.
    - Verify touch targets are accessible and scroll behaviors are smooth.

41. Audit accessibility for cart and chat
    - Verify keyboard navigation support for cart drawer, checkout form, and chat.
    - Add ARIA labels and roles to interactive elements (buttons, drawers, modals, chat input).
    - Ensure focus management is correct for modals and drawers (focus trap and return to trigger).

42. Implement unit tests for cart logic
    - Add tests for `useCart` to cover add, remove, update quantity, clear, and total/itemCount calculation.
    - Add tests for `CartProvider` to ensure context provides correct values and throws outside provider.

43. Implement unit tests for cart UI components
    - Test `CartDrawer` rendering of items, totals, and remove/quantity controls.
    - Test `OrderButton` badge behavior and click handling.
    - Test `OrderConfirmationModal` visibility and dismissal behavior.

44. Implement unit tests for AI helpers
    - Add tests for `buildSystemPrompt` to ensure it encodes menu and cart context correctly.
    - Add tests for `actionParser` to verify it maps representative AI responses to correct `ChatAction` structures.
    - Add tests for menu lookup helpers (e.g., fuzzy matching behavior).

45. Implement integration tests for chat flow
    - Write tests that simulate user chat messages and mock AI responses to:
      - Add items to cart.
      - Remove items from cart.
      - Trigger checkout.
    - Assert cart state changes and UI updates match expectations.

46. Implement integration tests for full cart flow
    - Simulate adding items via UI, adjusting quantities, removing items, and completing checkout.
    - Assert that order confirmation and cart-clearing behavior is correct.

47. Update architecture documentation
    - In `docs/architecture.md`, document:
      - Cart system architecture (including add/remove/update operations and persistence).
      - AI chat system architecture and LLM integration approach.
      - Action extraction and integration points between chat and cart.
      - State management overview and API key handling.

48. Update demo playbook
    - In `docs/demo-playbook.md`, add step-by-step instructions to demo:
      - The cart flow (add, remove, adjust, checkout).
      - The AI chatbot ordering flow (add/remove items, checkout via chat).
      - Key talking points and answers to likely questions.

49. Final manual QA pass across multiple restaurants
    - Run through the full flow for multiple `preview/[slug]` restaurants.
    - Confirm menu-specific behavior, cart behavior, and chat behavior are consistent across configurations.

50. Prepare for deployment and performance checks
    - Verify environment variables for the LLM provider are correctly configured in all environments.
    - Run linting and tests.
    - Sanity check AI latency and cost (model choice, prompt size) and adjust configuration if needed.


