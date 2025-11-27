/**
 * Shared types for AI chat functionality
 */

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp?: Date;
}

export type ChatActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'SHOW_CART'
  | 'CHECKOUT'
  | 'SUGGEST_ITEMS'
  | 'ANSWER_QUESTION';

export interface ChatAction {
  type: ChatActionType;
  itemId?: string;
  quantity?: number;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * LLM JSON response format
 */
export interface LLMChatResponse {
  response_to_user: string;
  action?: {
    type: ChatActionType;
    itemId?: string;
    quantity?: number;
  } | null;
}

