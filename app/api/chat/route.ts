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
    
    // Call AI service with robust error handling
    let response;
    try {
      response = await sendChatMessage(messages, menu, cart);
    } catch (aiError) {
      console.error('Error calling sendChatMessage:', aiError);
      
      // Handle specific error types from sendChatMessage
      if (aiError instanceof Error) {
        if (aiError.message.includes('configuration') || aiError.message.includes('API key')) {
          return NextResponse.json(
            { 
              error: 'AI service configuration error',
              response_to_user: 'I\'m currently unavailable due to a configuration issue. Please use the menu to add items to your cart.',
              action: null,
            },
            { status: 500 }
          );
        }
        if (aiError.message.includes('temporarily unavailable') || aiError.message.includes('rate limit')) {
          return NextResponse.json(
            { 
              error: 'AI service is temporarily unavailable',
              response_to_user: 'I\'m temporarily unavailable due to high demand. Please try again in a moment, or use the menu to add items to your cart.',
              action: null,
            },
            { status: 503 }
          );
        }
        if (aiError.message.includes('Failed to get')) {
          return NextResponse.json(
            { 
              error: 'Failed to get AI response',
              response_to_user: 'I encountered an error processing your request. Please try again, or use the menu to add items to your cart.',
              action: null,
            },
            { status: 500 }
          );
        }
        if (aiError.message.includes('Invalid')) {
          return NextResponse.json(
            { 
              error: aiError.message,
              response_to_user: `I encountered an error: ${aiError.message}. Please try again.`,
              action: null,
            },
            { status: 400 }
          );
        }
      }
      
      // Generic AI error fallback
      return NextResponse.json(
        { 
          error: 'AI service error',
          response_to_user: 'I\'m having trouble processing your request right now. Please try again, or use the menu to add items to your cart.',
          action: null,
        },
        { status: 500 }
      );
    }
    
    // Validate response structure
    if (!response || typeof response !== 'object') {
      console.error('Invalid response from sendChatMessage:', response);
      return NextResponse.json(
        { 
          error: 'Invalid response from AI service',
          response_to_user: 'I received an invalid response. Please try again, or use the menu to add items to your cart.',
          action: null,
        },
        { status: 500 }
      );
    }
    
    if (!response.response_to_user || typeof response.response_to_user !== 'string') {
      console.error('Missing or invalid response_to_user in AI response:', response);
      return NextResponse.json(
        { 
          error: 'Invalid response format from AI service',
          response_to_user: 'I received an invalid response format. Please try again, or use the menu to add items to your cart.',
          action: null,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      response_to_user: response.response_to_user,
      action: response.action || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          response_to_user: 'I received an invalid request. Please try again.',
          action: null,
        },
        { status: 400 }
      );
    }
    
    // Handle validation errors from Zod
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { 
          error: 'Invalid menu data',
          response_to_user: 'I received invalid menu data. Please try again.',
          action: null,
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('configuration')) {
        return NextResponse.json(
          { 
            error: 'AI service configuration error',
            response_to_user: 'I\'m currently unavailable due to a configuration issue. Please use the menu to add items to your cart.',
            action: null,
          },
          { status: 500 }
        );
      }
      if (error.message.includes('temporarily unavailable')) {
        return NextResponse.json(
          { 
            error: 'AI service is temporarily unavailable',
            response_to_user: 'I\'m temporarily unavailable. Please try again in a moment, or use the menu to add items to your cart.',
            action: null,
          },
          { status: 503 }
        );
      }
      if (error.message.includes('Failed to get')) {
        return NextResponse.json(
          { 
            error: 'Failed to get AI response',
            response_to_user: 'I encountered an error processing your request. Please try again, or use the menu to add items to your cart.',
            action: null,
          },
          { status: 500 }
        );
      }
      
      // Validation errors
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { 
            error: error.message,
            response_to_user: `I encountered an error: ${error.message}. Please try again.`,
            action: null,
          },
          { status: 400 }
        );
      }
    }
    
    // Generic fallback
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response_to_user: 'I encountered an unexpected error. Please try again, or use the menu to add items to your cart.',
        action: null,
      },
      { status: 500 }
    );
  }
}

