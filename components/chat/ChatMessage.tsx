'use client';

import { cn } from '@/lib/utils';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp?: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
  className?: string;
}

/**
 * ChatMessage component
 * Renders a single chat message with styling differences for user vs. assistant
 */
export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'mb-4 flex',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-black text-white dark:bg-white dark:text-black'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        )}
      >
        <p className="text-sm">{message.content}</p>
        {message.timestamp && (
          <p className="mt-1 text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}














