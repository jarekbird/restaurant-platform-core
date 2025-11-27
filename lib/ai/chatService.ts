/**
 * AI Chat Service
 * Handles communication with LLM for chat-based ordering
 * 
 * NOTE: This is a server-only module. Do not import directly in client components.
 */

import { Menu } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';
import { ChatMessage, ChatRole } from './types';
import OpenAI from 'openai';

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
- When a customer asks to add an item, identify it from the menu and respond with: "Action: ADD_ITEM with ID [item-id]"
- When a customer asks to remove an item, identify it and respond with: "Action: REMOVE_ITEM with ID [item-id]"
- When a customer asks to update quantity, respond with: "Action: UPDATE_QUANTITY with ID [item-id] quantity [number]"
- When a customer asks about the cart, respond with: "Action: SHOW_CART"
- When a customer is ready to checkout, respond with: "Action: CHECKOUT"
- Be friendly, helpful, and confirm actions clearly
- Always use the exact item ID from the menu (e.g., "coconut-shrimp", not "Coconut Shrimp")
- If an item is not found, politely let the customer know and suggest similar items

IMPORTANT: Always include the action in the format "Action: [ACTION_TYPE] with ID [item-id]" when performing cart operations.`;
}

/**
 * Send chat message to LLM
 * This is a placeholder - will be implemented with actual LLM API in next task
 */
/**
 * Initialize OpenAI client
 * Reads API key from environment variables
 */
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not found in environment variables');
    return null;
  }
  
  return new OpenAI({ apiKey });
}

/**
 * Send chat message to LLM
 * Server-side only - must be called from API route
 * 
 * @param messages - Conversation history
 * @param menu - Current menu data
 * @param cart - Current cart state
 * @returns AI response text
 * @throws Error if API call fails or API key is missing
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  menu: Menu,
  cart: CartItem[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(menu, cart);
  const client = getOpenAIClient();
  
  // If no API key, return fallback response
  if (!client) {
    return 'AI assistant is currently unavailable. Please use the menu to add items to your cart.';
  }
  
  try {
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages array');
    }
    
    // Convert ChatMessage format to OpenAI format
    const openAIMessages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }> = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter((msg) => msg.role !== 'system') // Filter out any system messages from history
        .map((msg) => {
          if (!msg.content || typeof msg.content !== 'string') {
            throw new Error('Invalid message content');
          }
          return {
            role: (msg.role === 'user' ? 'user' : 'assistant') as ChatRole,
            content: msg.content,
          };
        }),
    ];
    
    // Validate menu and cart
    if (!menu || !menu.categories || menu.categories.length === 0) {
      throw new Error('Invalid menu data');
    }
    
    if (!Array.isArray(cart)) {
      throw new Error('Invalid cart data');
    }
    
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: openAIMessages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }
    
    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Return friendly error message
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('configuration')) {
        throw new Error('AI service configuration error');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('AI service is temporarily unavailable due to high demand');
      }
      if (error.message.includes('Invalid')) {
        throw error; // Re-throw validation errors
      }
    }
    
    throw new Error('Failed to get AI response');
  }
}

