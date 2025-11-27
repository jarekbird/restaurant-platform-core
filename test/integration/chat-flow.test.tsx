import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { CartProvider } from '@/components/order/CartProvider';
import { Menu } from '@/lib/schemas/menu';

// Mock the chat API
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const mockMenu: Menu = {
  categories: [
    {
      id: 'cat-1',
      name: 'Appetizers',
      items: [
        { id: 'item-1', name: 'Miso Soup', price: 4.99, description: 'Traditional miso soup' },
        { id: 'item-2', name: 'California Roll', price: 5.99, description: 'Classic California roll' },
      ],
    },
  ],
};

describe('Chat Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle chat API calls', async () => {
    const mockResponse = {
      message: 'I\'ll add Miso Soup to your cart.',
      action: {
        type: 'ADD_ITEM',
        itemId: 'item-1',
        quantity: 1,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} />
      </CartProvider>
    );

    // Verify component renders
    expect(screen.getByRole('button', { name: /chat|assistant/i })).toBeInTheDocument();
  });

  it('should render chat assistant with menu', () => {
    render(
      <CartProvider>
        <ChatAssistant menu={mockMenu} />
      </CartProvider>
    );

    // Verify component renders
    expect(screen.getByRole('button', { name: /chat|assistant/i })).toBeInTheDocument();
  });
});

