import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  it('should render input and send button', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const input = screen.getByLabelText('Chat message input');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    expect(input).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it('should call onSend when form is submitted', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const input = screen.getByLabelText('Chat message input');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    expect(handleSend).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  it('should call onSend when Enter is pressed', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const input = screen.getByLabelText('Chat message input');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    
    expect(handleSend).toHaveBeenCalledWith('Test message');
    expect(input).toHaveValue('');
  });

  it('should not submit when Shift+Enter is pressed', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const input = screen.getByLabelText('Chat message input');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(handleSend).not.toHaveBeenCalled();
    expect(input).toHaveValue('Test message');
  });

  it('should be disabled when disabled prop is true', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} disabled={true} />);
    
    const input = screen.getByLabelText('Chat message input');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('should not submit empty messages', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.click(sendButton);
    
    expect(handleSend).not.toHaveBeenCalled();
  });

  it('should trim whitespace from messages', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const input = screen.getByLabelText('Chat message input');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: '  Hello World  ' } });
    fireEvent.click(sendButton);
    
    expect(handleSend).toHaveBeenCalledWith('Hello World');
  });
});

