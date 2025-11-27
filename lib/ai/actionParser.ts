/**
 * Action Parser
 * Extracts structured actions from AI chat responses
 */

import { Menu } from '@/lib/schemas/menu';
import { ChatAction, ChatActionType } from './types';

/**
 * Parse AI response to extract structured actions
 * Looks for action patterns in the response text
 * 
 * @param aiResponse - Raw AI response text
 * @param menu - Menu data for item lookup
 * @returns Parsed ChatAction or null if no action found
 */
export function parseChatAction(
  aiResponse: string,
  menu: Menu
): ChatAction | null {
  const response = aiResponse.toLowerCase().trim();

  // Pattern 1: Explicit action format (e.g., "ACTION: ADD_ITEM item-1" or "Action: ADD_ITEM with ID coconut-shrimp")
  // Try multiple patterns to catch different formats
  const explicitActionPatterns = [
    // "Action: ADD_ITEM with ID coconut-shrimp" or "Action: ADD_ITEM with ID coconut-shrimp quantity 2"
    /action:\s*(\w+)\s+with\s+id\s+([a-z0-9-]+)(?:\s+quantity\s+(\d+))?/i,
    // "Action: ADD_ITEM coconut-shrimp" or "Action: ADD_ITEM coconut-shrimp 2"
    /action:\s*(\w+)\s+([a-z0-9-]+)(?:\s+(\d+))?/i,
    // "Action: ADD_ITEM" followed by item ID somewhere in the text (look for kebab-case IDs)
    /action:\s*(\w+).*?\b([a-z0-9]+(?:-[a-z0-9]+)+)\b/i,
  ];
  
  for (const pattern of explicitActionPatterns) {
    const match = response.match(pattern);
    if (match) {
      const actionType = match[1].toUpperCase() as ChatActionType;
      let itemId = match[2];
      const quantity = match[3] ? parseInt(match[3], 10) : undefined;

      // If itemId wasn't captured but we have an action type that needs it, try to find it
      if (actionType && (actionType === 'ADD_ITEM' || actionType === 'REMOVE_ITEM' || actionType === 'UPDATE_QUANTITY')) {
        // If itemId is missing or looks like part of the action type, try to extract from response
        if (!itemId || itemId.length < 3 || itemId === actionType.toLowerCase()) {
          // Look for item ID pattern (kebab-case) in the response
          const itemIdMatch = response.match(/\b([a-z0-9]+(?:-[a-z0-9]+)+)\b/);
          if (itemIdMatch) {
            itemId = itemIdMatch[1];
          } else {
            // Fall back to finding item by name
            const item = findMenuItemInResponse(response, menu);
            if (item) {
              itemId = item.id;
            }
          }
        }

        if (itemId) {
          return {
            type: actionType,
            itemId,
            quantity,
            message: aiResponse,
          };
        }
      } else if (actionType) {
        // Action types that don't need itemId
        return {
          type: actionType,
          message: aiResponse,
        };
      }
    }
  }

  // Pattern 2: Look for item names in response and infer action
  // Check for "add" patterns
  if (response.includes('add') || response.includes('added') || response.includes('adding')) {
    const item = findMenuItemInResponse(response, menu);
    if (item) {
      // Extract quantity if mentioned
      const quantityMatch = response.match(/(\d+)\s*(?:x|×)?\s*(?:of|times)?/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

      return {
        type: 'ADD_ITEM',
        itemId: item.id,
        quantity,
        message: aiResponse,
      };
    }
  }

  // Check for "remove" patterns
  if (response.includes('remove') || response.includes('removed') || response.includes('removing')) {
    const item = findMenuItemInResponse(response, menu);
    if (item) {
      return {
        type: 'REMOVE_ITEM',
        itemId: item.id,
        message: aiResponse,
      };
    }
  }

  // Check for "checkout" patterns
  if (
    response.includes('checkout') ||
    response.includes('check out') ||
    response.includes('place order') ||
    response.includes('complete order')
  ) {
    return {
      type: 'CHECKOUT',
      message: aiResponse,
    };
  }

  // Check for "show cart" patterns
  if (
    response.includes('show cart') ||
    response.includes('view cart') ||
    response.includes('cart summary')
  ) {
    return {
      type: 'SHOW_CART',
      message: aiResponse,
    };
  }

  // Default: answer question
  return {
    type: 'ANSWER_QUESTION',
    message: aiResponse,
  };
}

/**
 * Find menu item mentioned in response text
 * Uses fuzzy matching to find items by name
 */
function findMenuItemInResponse(
  response: string,
  menu: Menu
): { id: string; name: string } | null {
  const responseLower = response.toLowerCase();

  // Try exact match first
  for (const category of menu.categories) {
    for (const item of category.items) {
      const itemNameLower = item.name.toLowerCase();
      if (responseLower.includes(itemNameLower)) {
        return { id: item.id, name: item.name };
      }
    }
  }

  // Try partial match (words)
  const responseWords = responseLower.split(/\s+/);
  for (const category of menu.categories) {
    for (const item of category.items) {
      const itemWords = item.name.toLowerCase().split(/\s+/);
      // Check if all words in item name appear in response
      if (itemWords.every((word) => responseWords.some((rw) => rw.includes(word) || word.includes(rw)))) {
        return { id: item.id, name: item.name };
      }
    }
  }

  return null;
}

