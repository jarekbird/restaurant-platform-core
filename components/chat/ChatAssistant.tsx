'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatMessage as ChatMessageType } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Menu } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';
import { ChatMessage as ChatMessageTypeLib, ChatRole } from '@/lib/ai/types';
import { useCartContext } from '@/components/order/CartProvider';
import { useOptionalToast } from '@/lib/hooks/useOptionalToast';

interface ChatAssistantProps {
  menu: Menu;
  cart: CartItem[];
  onCartAction?: (action: string) => void;
  className?: string;
}

/**
 * ChatAssistant component
 * Collapsible sidebar (desktop) or bottom drawer (mobile) for AI-powered ordering assistance
 */
export function ChatAssistant({ menu, cart, onCartAction, className }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cartContext = useCartContext();
  const toast = useOptionalToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (message: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Set loading state
    setIsLoading(true);
    
    try {
      // Convert messages to API format
      const apiMessages: ChatMessageTypeLib[] = [
        ...messages,
        {
          role: 'user' as ChatRole,
          content: message,
        },
      ].map((msg) => ({
        role: msg.role as ChatRole,
        content: msg.content,
      }));
      
      // Call API with robust error handling
      let response: Response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
            menu,
            cart,
          }),
        });
      } catch (fetchError) {
        // Network error or fetch failed
        console.error('Network error calling /api/chat:', fetchError);
        const errorMessage: ChatMessageType = {
          role: 'assistant',
          content: 'I\'m having trouble connecting right now. Please check your internet connection and try again, or use the menu to add items to your cart.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast.error('Connection error. Please try again.');
        return;
      }
      
      // Handle HTTP error responses
      if (!response.ok) {
        let errorMessageText = 'I\'m temporarily unavailable. Please use the menu to add items to your cart.';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            // Use server-provided error message if available
            if (response.status === 503) {
              errorMessageText = 'I\'m temporarily unavailable due to high demand. Please try again in a moment, or use the menu to add items to your cart.';
            } else if (response.status === 500) {
              errorMessageText = 'I encountered an error processing your request. Please try again, or use the menu to add items to your cart.';
            } else {
              errorMessageText = `I'm having trouble: ${errorData.error}. Please try again, or use the menu to add items to your cart.`;
            }
          }
        } catch (parseError) {
          // If we can't parse the error response, use default message
          console.error('Error parsing error response:', parseError);
        }
        
        const errorMessage: ChatMessageType = {
          role: 'assistant',
          content: errorMessageText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast.error('AI assistant is unavailable. Please use the menu.');
        return;
      }
      
      // Parse successful response
      let data: { response_to_user?: string; message?: string; action?: unknown; timestamp?: string };
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        const errorMessage: ChatMessageType = {
          role: 'assistant',
          content: 'I received an invalid response. Please try again, or use the menu to add items to your cart.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast.error('Invalid response from server. Please try again.');
        return;
      }
      
      // Extract response and action from JSON structure
      const responseToUser = data.response_to_user || data.message || 'I\'m having trouble processing that. Please try again, or use the menu to add items to your cart.';
      const action = data.action;
      
      // Execute cart action if found - with validation
      if (action && typeof action === 'object' && action !== null && 'type' in action) {
        const actionType = (action as { type: string }).type;
        
        if (actionType === 'ADD_ITEM' || actionType === 'REMOVE_ITEM' || actionType === 'UPDATE_QUANTITY' || actionType === 'CHECKOUT') {
          try {
            switch (actionType) {
              case 'ADD_ITEM': {
                const addAction = action as { itemId?: string; quantity?: number };
                if (!addAction.itemId) {
                  console.warn('ADD_ITEM action missing itemId');
                  break;
                }
                
                // Validate item exists in menu before adding
                const menuItem = menu.categories
                  .flatMap((cat) => cat.items)
                  .find((item) => item.id === addAction.itemId);
                
                if (!menuItem) {
                  // Item not found in menu - don't add to cart
                  console.warn(`Item with ID "${addAction.itemId}" not found in menu`);
                  const errorMessage: ChatMessageType = {
                    role: 'assistant',
                    content: `I couldn't find that item in the menu. Please check the menu and try again, or tell me the name of the item you'd like to add.`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break;
                }
                
                // Validate quantity
                const quantity = addAction.quantity || 1;
                if (quantity <= 0 || quantity > 100) {
                  console.warn(`Invalid quantity: ${quantity}`);
                  const errorMessage: ChatMessageType = {
                    role: 'assistant',
                    content: `I can only add between 1 and 100 items at a time. Please specify a valid quantity.`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break;
                }
                
                // Add item to cart
                try {
                  for (let i = 0; i < quantity; i++) {
                    cartContext.addItem({
                      id: menuItem.id,
                      name: menuItem.name,
                      price: menuItem.price,
                    });
                  }
                } catch (cartError) {
                  console.error('Error adding item to cart:', cartError);
                  toast.error('Failed to add item to cart');
                }
                break;
              }
              case 'REMOVE_ITEM': {
                const removeAction = action as { itemId?: string };
                if (!removeAction.itemId) {
                  console.warn('REMOVE_ITEM action missing itemId');
                  break;
                }
                
                // Validate item exists in cart before removing
                const itemToRemove = cart.find((item) => item.id === removeAction.itemId);
                if (!itemToRemove) {
                  console.warn(`Item with ID "${removeAction.itemId}" not found in cart`);
                  const errorMessage: ChatMessageType = {
                    role: 'assistant',
                    content: `I couldn't find that item in your cart. Please check your cart and try again.`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break;
                }
                
                try {
                  cartContext.removeItem(removeAction.itemId);
                } catch (cartError) {
                  console.error('Error removing item from cart:', cartError);
                  toast.error('Failed to remove item from cart');
                }
                break;
              }
              case 'UPDATE_QUANTITY': {
                const updateAction = action as { itemId?: string; quantity?: number };
                if (!updateAction.itemId || updateAction.quantity === undefined) {
                  console.warn('UPDATE_QUANTITY action missing itemId or quantity');
                  break;
                }
                
                // Validate item exists in cart
                const itemToUpdate = cart.find((item) => item.id === updateAction.itemId);
                if (!itemToUpdate) {
                  console.warn(`Item with ID "${updateAction.itemId}" not found in cart`);
                  const errorMessage: ChatMessageType = {
                    role: 'assistant',
                    content: `I couldn't find that item in your cart. Please check your cart and try again.`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break;
                }
                
                // Validate quantity
                if (updateAction.quantity <= 0 || updateAction.quantity > 100) {
                  console.warn(`Invalid quantity: ${updateAction.quantity}`);
                  const errorMessage: ChatMessageType = {
                    role: 'assistant',
                    content: `I can only set quantities between 1 and 100. Please specify a valid quantity.`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break;
                }
                
                try {
                  cartContext.updateQuantity(updateAction.itemId, updateAction.quantity);
                } catch (cartError) {
                  console.error('Error updating item quantity:', cartError);
                  toast.error('Failed to update item quantity');
                }
                break;
              }
              case 'CHECKOUT':
                if (cart.length > 0 && onCartAction) {
                  try {
                    onCartAction('Opening checkout');
                  } catch (checkoutError) {
                    console.error('Error opening checkout:', checkoutError);
                    toast.error('Failed to open checkout');
                  }
                }
                break;
            }
          } catch (error) {
            console.error('Error executing cart action:', error);
            toast.error('Failed to process cart action');
          }
        }
      }
      
      // Show the LLM's response to the user (response_to_user field)
      // The LLM calculates and includes the updated cart total in its response
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: responseToUser,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Catch-all for any unexpected errors
      console.error('Unexpected error in chat:', error);
      
      // Add friendly error message
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: 'I encountered an unexpected error. Please try again, or use the menu to add items to your cart.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // Show error toast
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
          className
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            // Mobile: bottom sheet
            'fixed bottom-0 left-0 right-0 z-50 h-[85vh] max-h-[85vh] w-full rounded-t-lg bg-white shadow-xl dark:bg-gray-900',
            // Desktop: right sidebar
            'md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:max-h-full md:max-w-md md:rounded-t-none',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Chat assistant"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Ordering Assistant</h2>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Start a conversation with the ordering assistant
                  </p>
                  {/* Conversation Starter Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSend('What can I get?')}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      What can I get?
                    </button>
                    {menu.categories[0]?.items[0] && (
                      <button
                        onClick={() => handleSend(`Order a ${menu.categories[0].items[0].name.toLowerCase()}`)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        Order a {menu.categories[0].items[0].name.toLowerCase()}
                      </button>
                    )}
                    {menu.categories[0]?.items[0] && (
                      <button
                        onClick={() => handleSend(`Add two ${menu.categories[0].items[0].name}`)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        Add two {menu.categories[0].items[0].name}
                      </button>
                    )}
                    <button
                      onClick={() => handleSend('Checkout')}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {isLoading && (
                    <div className="mb-4 flex justify-start">
                      <div className="rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Thinking...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <ChatInput onSend={handleSend} disabled={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleChat}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              toggleChat();
            }
          }}
          aria-hidden="true"
          role="button"
          tabIndex={-1}
        />
      )}
    </>
  );
}

