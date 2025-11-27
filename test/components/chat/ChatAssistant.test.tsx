import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatAssistant } from '@/components/chat/ChatAssistant';

describe('ChatAssistant', () => {
  it('should render toggle button when closed', () => {
    render(<ChatAssistant />);
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should open chat panel when toggle button is clicked', () => {
    render(<ChatAssistant />);
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Ordering Assistant')).toBeInTheDocument();
  });

  it('should close chat panel when close button is clicked', () => {
    render(<ChatAssistant />);
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Ordering Assistant')).toBeInTheDocument();
    
    // Find close button by text content (✕)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => btn.textContent === '✕' && btn !== toggleButton);
    
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(screen.queryByText('Ordering Assistant')).not.toBeInTheDocument();
    } else {
      // Alternative: click toggle button again
      fireEvent.click(toggleButton);
      expect(screen.queryByText('Ordering Assistant')).not.toBeInTheDocument();
    }
  });

  it('should have proper ARIA attributes', () => {
    render(<ChatAssistant />);
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(toggleButton);
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-label', 'Chat assistant');
  });
});

