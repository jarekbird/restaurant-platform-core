import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';
import { menuSchema } from '@/lib/schemas/menu';
import { ChatMessage } from '@/lib/ai/types';

// Mock the chat service
vi.mock('@/lib/ai/chatService', () => ({
  sendChatMessage: vi.fn().mockResolvedValue('AI response'),
}));

describe('POST /api/chat', () => {
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

  const mockMessages: ChatMessage[] = [
    {
      role: 'user',
      content: 'I want a California Roll',
    },
  ];

  const mockCart = [
    {
      id: 'item-1',
      name: 'California Roll',
      price: 8.99,
      quantity: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return AI response for valid request', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: mockMessages,
        menu: mockMenu,
        cart: mockCart,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('AI response');
    expect(data.timestamp).toBeDefined();
  });

  it('should return 400 if messages are missing', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        menu: mockMenu,
        cart: mockCart,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('messages');
  });

  it('should return 400 if menu is missing', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: mockMessages,
        cart: mockCart,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('menu');
  });

  it('should return 400 if cart is missing', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: mockMessages,
        menu: mockMenu,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('cart');
  });

  it('should handle invalid message format', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ invalid: 'format' }],
        menu: mockMenu,
        cart: mockCart,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});

