import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';
import { menuSchema } from '@/lib/schemas/menu';
import { ChatMessage } from '@/lib/ai/types';
import { sendChatMessage } from '@/lib/ai/chatService';

// Mock the chat service
vi.mock('@/lib/ai/chatService', () => ({
  sendChatMessage: vi.fn(),
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
    // Default mock implementation
    vi.mocked(sendChatMessage).mockResolvedValue({
      response_to_user: 'AI response',
      action: null,
    });
  });

  it('should return AI response for valid request', async () => {
    vi.mocked(sendChatMessage).mockResolvedValue({
      response_to_user: 'I\'ve added a California Roll to your cart!',
      action: { type: 'ADD_ITEM', itemId: 'item-1', quantity: 1 },
    });

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
    expect(data.response_to_user).toBe('I\'ve added a California Roll to your cart!');
    expect(data.action).toEqual({ type: 'ADD_ITEM', itemId: 'item-1', quantity: 1 });
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
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.response_to_user).toBeDefined();
  });

  it('should handle AI service configuration error', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(
      new Error('AI service configuration error')
    );

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

    expect(response.status).toBe(500);
    expect(data.error).toContain('configuration');
    expect(data.response_to_user).toContain('unavailable');
    expect(data.action).toBeNull();
  });

  it('should handle AI service temporarily unavailable', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(
      new Error('AI service is temporarily unavailable due to high demand')
    );

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

    expect(response.status).toBe(503);
    expect(data.error).toContain('temporarily unavailable');
    expect(data.response_to_user).toContain('temporarily unavailable');
    expect(data.action).toBeNull();
  });

  it('should handle rate limit errors', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(
      new Error('rate limit exceeded')
    );

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

    expect(response.status).toBe(503);
    expect(data.error).toContain('temporarily unavailable');
    expect(data.response_to_user).toContain('high demand');
    expect(data.action).toBeNull();
  });

  it('should handle failed to get AI response', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(
      new Error('Failed to get AI response')
    );

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

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to get');
    expect(data.response_to_user).toContain('error processing');
    expect(data.action).toBeNull();
  });

  it('should handle invalid response from sendChatMessage', async () => {
    vi.mocked(sendChatMessage).mockResolvedValue(null as unknown as { response_to_user: string; action: null });

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

    expect(response.status).toBe(500);
    expect(data.error).toContain('Invalid response');
    expect(data.response_to_user).toContain('invalid response');
    expect(data.action).toBeNull();
  });

  it('should handle missing response_to_user in response', async () => {
    vi.mocked(sendChatMessage).mockResolvedValue({
      action: null,
    } as unknown as { response_to_user: string; action: null });

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

    expect(response.status).toBe(500);
    expect(data.error).toContain('Invalid response format');
    expect(data.response_to_user).toContain('invalid response format');
    expect(data.action).toBeNull();
  });

  it('should handle invalid JSON in request body', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    // Invalid JSON should return 400 (bad request) or 500 (server error) depending on implementation
    expect([400, 500]).toContain(response.status);
    expect(data.error).toBeDefined();
    expect(data.response_to_user).toBeDefined();
  });

  it('should handle generic errors gracefully', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(
      new Error('Unexpected error')
    );

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

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.response_to_user).toContain('trouble processing');
    expect(data.action).toBeNull();
  });
});

