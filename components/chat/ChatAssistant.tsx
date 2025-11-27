'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatAssistantProps {
  className?: string;
}

/**
 * ChatAssistant component
 * Collapsible sidebar (desktop) or bottom drawer (mobile) for AI-powered ordering assistance
 */
export function ChatAssistant({ className }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
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

            {/* Chat Messages Area - Placeholder */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-center text-gray-500 dark:text-gray-400">
                Chat functionality will be implemented in next tasks
              </p>
            </div>

            {/* Input Area - Placeholder */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Input will be implemented in next tasks
              </p>
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

