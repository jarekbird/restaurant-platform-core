/**
 * AI Chat Service
 * Handles communication with LLM for chat-based ordering
 */

import { Menu } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';
import { ChatMessage } from './types';

/**
 * Build system prompt for AI chat assistant
 * Encodes menu and cart context into instructions for the LLM
 */
export function buildSystemPrompt(menu: Menu, cart: CartItem[]): string {
  // Format menu items for prompt
  const menuItemsText = menu.categories
    .flatMap((category) =>
      category.items.map(
        (item) =>
          `- ${item.name} (ID: ${item.id}): $${item.price.toFixed(2)}${item.description ? ` - ${item.description}` : ''}`
      )
    )
    .join('\n');

  // Format cart items for prompt
  const cartItemsText =
    cart.length === 0
      ? 'Cart is empty'
      : cart
          .map(
            (item) =>
              `- ${item.name} (ID: ${item.id}): $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
          )
          .join('\n');

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `You are a helpful restaurant ordering assistant for ${menu.name}.

Your role is to help customers place orders by:
1. Answering questions about menu items
2. Adding items to the cart when customers request them
3. Removing items from the cart when requested
4. Suggesting popular or recommended items
5. Helping with checkout when ready

AVAILABLE MENU ITEMS:
${menuItemsText}

CURRENT CART:
${cartItemsText}
Total: $${cartTotal.toFixed(2)}

INSTRUCTIONS:
- When a customer asks to add an item, identify it from the menu and respond with action: ADD_ITEM with the item ID
- When a customer asks to remove an item, identify it and respond with action: REMOVE_ITEM with the item ID
- When a customer asks to update quantity, respond with action: UPDATE_QUANTITY with item ID and new quantity
- When a customer asks about the cart, respond with action: SHOW_CART
- When a customer is ready to checkout, respond with action: CHECKOUT
- Be friendly, helpful, and confirm actions clearly
- If an item is not found, politely let the customer know and suggest similar items

Format your responses naturally, but include structured actions when needed.`;
}

/**
 * Send chat message to LLM
 * This is a placeholder - will be implemented with actual LLM API in next task
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  menu: Menu,
  cart: CartItem[]
): Promise<string> {
  // Placeholder implementation - will be replaced with actual LLM API call
  // System prompt will be used when LLM integration is added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _systemPrompt = buildSystemPrompt(menu, cart);
  
  // For now, return a simple response
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user') {
    return `I understand you said: "${lastMessage.content}". AI integration will be implemented in the next task.`;
  }
  
  return 'How can I help you with your order?';
}

