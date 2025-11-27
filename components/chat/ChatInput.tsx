'use client';

import { FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ChatInput component
 * Text input with send button for chat messages
 * Supports Enter key to submit and disabled state
 */
export function ChatInput({ onSend, disabled = false, className }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Shift+Enter for new lines, Enter alone submits
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !disabled) {
        onSend(message.trim());
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your message..."
        rows={1}
        className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white disabled:opacity-50"
        aria-label="Chat message input"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="touch-manipulation rounded-md bg-black px-4 py-3 text-base font-semibold text-white transition-colors active:bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:active:bg-gray-300 dark:hover:bg-gray-200"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}

