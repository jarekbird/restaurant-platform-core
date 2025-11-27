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
      
      // Call API
      const response = await fetch('/api/chat', {
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
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Extract response and action from JSON structure
      const responseToUser = data.response_to_user || data.message || 'Sorry, I encountered an error. Please try again.';
      const action = data.action;
      
      // Execute cart action if found
      if (action && action.type && (action.type === 'ADD_ITEM' || action.type === 'REMOVE_ITEM' || action.type === 'UPDATE_QUANTITY' || action.type === 'CHECKOUT')) {
        try {
          switch (action.type) {
            case 'ADD_ITEM':
              if (action.itemId) {
                // Validate item exists in menu
                const menuItem = menu.categories
                  .flatMap((cat) => cat.items)
                  .find((item) => item.id === action.itemId);
                
                if (!menuItem) {
                  // Try to find by name as fallback
                  const itemByName = menu.categories
                    .flatMap((cat) => cat.items)
                    .find((item) => 
                      item.name.toLowerCase().includes(action.itemId.toLowerCase()) ||
                      action.itemId.toLowerCase().includes(item.name.toLowerCase())
                    );
                  
                  if (itemByName) {
                    const quantity = action.quantity || 1;
                    if (quantity > 0 && quantity <= 100) {
                      for (let i = 0; i < quantity; i++) {
                        cartContext.addItem({
                          id: itemByName.id,
                          name: itemByName.name,
                          price: itemByName.price,
                        });
                      }
                    }
                  }
                } else {
                  const quantity = action.quantity || 1;
                  if (quantity > 0 && quantity <= 100) {
                    for (let i = 0; i < quantity; i++) {
                      cartContext.addItem({
                        id: menuItem.id,
                        name: menuItem.name,
                        price: menuItem.price,
                      });
                    }
                  }
                }
              }
              break;
            case 'REMOVE_ITEM':
              if (action.itemId) {
                const itemToRemove = cart.find((item) => item.id === action.itemId);
                if (itemToRemove) {
                  cartContext.removeItem(action.itemId);
                }
              }
              break;
            case 'UPDATE_QUANTITY':
              if (action.itemId && action.quantity !== undefined) {
                const itemToUpdate = cart.find((item) => item.id === action.itemId);
                if (itemToUpdate && action.quantity > 0 && action.quantity <= 100) {
                  cartContext.updateQuantity(action.itemId, action.quantity);
                }
              }
              break;
            case 'CHECKOUT':
              if (cart.length > 0 && onCartAction) {
                onCartAction('Opening checkout');
              }
              break;
          }
        } catch (error) {
          console.error('Error executing cart action:', error);
          toast.error('Failed to process cart action');
        }
      }
      
      // Show the LLM's response to the user (response_to_user field)
      // The LLM calculates and includes the updated cart total in its response
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: responseToUser,
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Add error message
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // Show error toast
      toast.error('Failed to get AI response. Please try again.');
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

