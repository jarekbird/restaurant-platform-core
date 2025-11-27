import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/ai/chatService';
import { menuSchema } from '@/lib/schemas/menu';
import { ChatMessage } from '@/lib/ai/types';
import { CartItem } from '@/components/order/useCart';

/**
 * POST /api/chat
 * Handles chat messages and returns AI responses
 * 
 * Request body:
 * {
 *   messages: ChatMessage[],
 *   menu: Menu (or menuId to load menu),
 *   cart: CartItem[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }
    
    if (!body.menu) {
      return NextResponse.json(
        { error: 'menu is required' },
        { status: 400 }
      );
    }
    
    if (!body.cart || !Array.isArray(body.cart)) {
      return NextResponse.json(
        { error: 'cart array is required' },
        { status: 400 }
      );
    }
    
    // Parse and validate menu
    const menu = menuSchema.parse(body.menu);
    
    // Parse messages
    const messages: ChatMessage[] = body.messages.map((msg: unknown) => {
      if (
        typeof msg === 'object' &&
        msg !== null &&
        'role' in msg &&
        'content' in msg
      ) {
        return {
          role: msg.role as ChatMessage['role'],
          content: String(msg.content),
        };
      }
      throw new Error('Invalid message format');
    });
    
    // Parse cart items
    const cart: CartItem[] = body.cart.map((item: unknown) => {
      if (
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        'price' in item &&
        'quantity' in item
      ) {
        return {
          id: String(item.id),
          name: String(item.name),
          price: Number(item.price),
          quantity: Number(item.quantity),
          modifiers: 'modifiers' in item && Array.isArray(item.modifiers)
            ? item.modifiers
            : undefined,
        };
      }
      throw new Error('Invalid cart item format');
    });
    
    // Call AI service
    const response = await sendChatMessage(messages, menu, cart);
    
    return NextResponse.json({
      response_to_user: response.response_to_user,
      action: response.action,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('configuration')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('temporarily unavailable')) {
        return NextResponse.json(
          { error: 'AI service is temporarily unavailable' },
          { status: 503 }
        );
      }
      if (error.message.includes('Failed to get')) {
        return NextResponse.json(
          { error: 'Failed to get AI response' },
          { status: 500 }
        );
      }
    }
    
    // Validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

