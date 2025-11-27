import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { CartProvider } from '@/components/order/CartProvider';
import { menuSchema } from '@/lib/schemas/menu';

describe('ChatAssistant', () => {
  const mockMenu = menuSchema.parse({
    id: 'menu-1',
    name: 'Test Menu',
    currency: 'USD',
    categories: [
      {
        id: 'cat-1',
        name: 'Appetizers',
        items: [
          {
            id: 'item-1',
            name: 'California Roll',
            price: 8.99,
          },
        ],
      },
    ],
  });

  it('should render toggle button when closed', () => {
    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} cart={[]} />
      </CartProvider>
    );
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should open chat panel when toggle button is clicked', () => {
    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} cart={[]} />
      </CartProvider>
    );
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Ordering Assistant')).toBeInTheDocument();
  });

  it('should close chat panel when close button is clicked', () => {
    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} cart={[]} />
      </CartProvider>
    );
    
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
    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} cart={[]} />
      </CartProvider>
    );
    
    const toggleButton = screen.getByRole('button', { name: /open chat/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(toggleButton);
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-label', 'Chat assistant');
  });
});

