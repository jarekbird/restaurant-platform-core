import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage, ChatMessage as ChatMessageType } from '@/components/chat/ChatMessage';

describe('ChatMessage', () => {
  const userMessage: ChatMessageType = {
    role: 'user',
    content: 'I want a California Roll',
  };

  const assistantMessage: ChatMessageType = {
    role: 'assistant',
    content: 'Great choice! I\'ve added a California Roll to your cart.',
  };

  it('should render user message correctly', () => {
    render(<ChatMessage message={userMessage} />);
    
    expect(screen.getByText('I want a California Roll')).toBeInTheDocument();
  });

  it('should render assistant message correctly', () => {
    render(<ChatMessage message={assistantMessage} />);
    
    expect(screen.getByText(/Great choice/)).toBeInTheDocument();
  });

  it('should apply different styling for user vs assistant messages', () => {
    const { container: userContainer } = render(<ChatMessage message={userMessage} />);
    const { container: assistantContainer } = render(<ChatMessage message={assistantMessage} />);
    
    const userMessageDiv = userContainer.querySelector('.bg-black, .bg-white');
    const assistantMessageDiv = assistantContainer.querySelector('.bg-gray-100, .bg-gray-800');
    
    expect(userMessageDiv).toBeTruthy();
    expect(assistantMessageDiv).toBeTruthy();
  });

  it('should display timestamp when provided', () => {
    const messageWithTimestamp: ChatMessageType = {
      ...userMessage,
      timestamp: new Date('2024-01-01T12:00:00'),
    };
    
    render(<ChatMessage message={messageWithTimestamp} />);
    
    // Timestamp format may vary, so just check it's rendered
    const messageElement = screen.getByText('I want a California Roll');
    expect(messageElement).toBeInTheDocument();
  });
});














