import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '@/lib/ai/chatService';
import { menuSchema } from '@/lib/schemas/menu';
import { CartItem } from '@/components/order/useCart';

describe('buildSystemPrompt', () => {
  const mockMenu = menuSchema.parse({
    id: 'menu-1',
    name: 'Test Restaurant Menu',
    currency: 'USD',
    categories: [
      {
        id: 'cat-1',
        name: 'Appetizers',
        items: [
          {
            id: 'item-1',
            name: 'California Roll',
            description: 'Fresh California roll',
            price: 8.99,
          },
          {
            id: 'item-2',
            name: 'Miso Soup',
            price: 4.50,
          },
        ],
      },
      {
        id: 'cat-2',
        name: 'Main Courses',
        items: [
          {
            id: 'item-3',
            name: 'Sushi Platter',
            description: 'Assorted sushi',
            price: 24.99,
          },
        ],
      },
    ],
  });

  it('should include menu name in prompt', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('Test Restaurant Menu');
  });

  it('should include all menu items in prompt', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('California Roll');
    expect(prompt).toContain('Miso Soup');
    expect(prompt).toContain('Sushi Platter');
    expect(prompt).toContain('$8.99');
    expect(prompt).toContain('$4.50');
    expect(prompt).toContain('$24.99');
  });

  it('should include item descriptions when available', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('Fresh California roll');
    expect(prompt).toContain('Assorted sushi');
  });

  it('should include item IDs in prompt', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('ID: item-1');
    expect(prompt).toContain('ID: item-2');
    expect(prompt).toContain('ID: item-3');
  });

  it('should show empty cart when cart is empty', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('Cart is empty');
    expect(prompt).toContain('Total: $0.00');
  });

  it('should include cart items when cart has items', () => {
    const cart: CartItem[] = [
      {
        id: 'item-1',
        name: 'California Roll',
        price: 8.99,
        quantity: 2,
      },
      {
        id: 'item-2',
        name: 'Miso Soup',
        price: 4.50,
        quantity: 1,
      },
    ];
    
    const prompt = buildSystemPrompt(mockMenu, cart);
    
    expect(prompt).toContain('California Roll');
    expect(prompt).toContain('× 2');
    expect(prompt).toContain('Miso Soup');
    expect(prompt).toContain('× 1');
    expect(prompt).toContain('Total: $22.48');
  });

  it('should include instructions for actions', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toContain('ADD_ITEM');
    expect(prompt).toContain('REMOVE_ITEM');
    expect(prompt).toContain('UPDATE_QUANTITY');
    expect(prompt).toContain('SHOW_CART');
    expect(prompt).toContain('CHECKOUT');
  });

  it('should calculate cart total correctly', () => {
    const cart: CartItem[] = [
      {
        id: 'item-1',
        name: 'Item 1',
        price: 10.50,
        quantity: 3,
      },
    ];
    
    const prompt = buildSystemPrompt(mockMenu, cart);
    
    expect(prompt).toContain('Total: $31.50');
  });
});

