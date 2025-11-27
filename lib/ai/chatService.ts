/**
 * AI Chat Service
 * Handles communication with LLM for chat-based ordering
 * 
 * NOTE: This is a server-only module. Do not import directly in client components.
 */

import { Menu } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';
import { ChatMessage, ChatRole, LLMChatResponse } from './types';
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
- You must respond with valid JSON in this exact format:
  {
    "response_to_user": "Your friendly, natural response to the customer",
    "action": {
      "type": "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "SHOW_CART" | "CHECKOUT" | "ANSWER_QUESTION",
      "itemId": "item-id-from-menu" (required for ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY),
      "quantity": number (required for ADD_ITEM and UPDATE_QUANTITY)
    }
  }

- When a customer asks to add an item, identify it from the menu and set action.type to "ADD_ITEM"
- When adding items, calculate the new cart total and include it in your response_to_user (e.g., "I've added 2 Coconut Shrimp to your cart! Your cart total is now $13.98.")
- When a customer asks to remove an item, set action.type to "REMOVE_ITEM"
- When a customer asks to update quantity, set action.type to "UPDATE_QUANTITY"
- When a customer asks about the cart, set action.type to "SHOW_CART"
- When a customer is ready to checkout, set action.type to "CHECKOUT"
- For general questions, set action.type to "ANSWER_QUESTION" or set action to null
- Be friendly, helpful, and confirm actions clearly with natural language in response_to_user
- Always use the exact item ID from the menu (e.g., "coconut-shrimp", not "Coconut Shrimp")
- If an item is not found, politely let the customer know and suggest similar items
- When calculating new cart totals after adding items, add the item price × quantity to the current cart total
- If no action is needed (just answering a question), set action to null

IMPORTANT: 
- Always return valid JSON with response_to_user and action fields
- Include the updated cart total in response_to_user when adding, removing, or updating items`;
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
 * @returns LLM response with response_to_user and action
 * @throws Error if API call fails or API key is missing
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  menu: Menu,
  cart: CartItem[]
): Promise<LLMChatResponse> {
  const systemPrompt = buildSystemPrompt(menu, cart);
  const client = getOpenAIClient();
  
  // If no API key, return fallback response
  if (!client) {
    return {
      response_to_user: 'AI assistant is currently unavailable. Please use the menu to add items to your cart.',
      action: null,
    };
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
      response_format: { type: 'json_object' }, // Request JSON response
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(content) as LLMChatResponse;
      
      // Validate structure
      if (!parsed.response_to_user || typeof parsed.response_to_user !== 'string') {
        throw new Error('Invalid response format: missing response_to_user');
      }
      
      return parsed;
    } catch (parseError) {
      console.error('Error parsing LLM JSON response:', parseError);
      console.error('Raw response:', content);
      // Fallback: return the raw content as response_to_user
      return {
        response_to_user: content,
        action: null,
      };
    }
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

