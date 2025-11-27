'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatMessage as ChatMessageType } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Menu } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';
import { ChatMessage as ChatMessageTypeLib } from '@/lib/ai/types';

interface ChatAssistantProps {
  menu: Menu;
  cart: CartItem[];
  className?: string;
}

/**
 * ChatAssistant component
 * Collapsible sidebar (desktop) or bottom drawer (mobile) for AI-powered ordering assistance
 */
export function ChatAssistant({ menu, cart, className }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          role: 'user',
          content: message,
        },
      ].map((msg) => ({
        role: msg.role,
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
      
      // Add assistant response
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: data.message,
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
            // Desktop: right sidebar
            'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl dark:bg-gray-900',
            // Mobile: bottom drawer (will be adjusted with media queries if needed)
            'md:max-w-md',
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
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Start a conversation with the ordering assistant
                </p>
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
          aria-hidden="true"
        />
      )}
    </>
  );
}

