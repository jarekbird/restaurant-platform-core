import { describe, it, expect } from 'vitest';
import { parseChatAction } from '@/lib/ai/actionParser';
import { menuSchema } from '@/lib/schemas/menu';

describe('parseChatAction', () => {
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
          {
            id: 'item-2',
            name: 'Miso Soup',
            price: 4.50,
          },
        ],
      },
    ],
  });

  it('should parse ADD_ITEM action from response', () => {
    const response = 'I\'ve added a California Roll to your cart.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should parse REMOVE_ITEM action from response', () => {
    const response = 'I\'ve removed the California Roll from your cart.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('REMOVE_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should parse CHECKOUT action from response', () => {
    const response = 'Ready to checkout? Let me help you complete your order.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('CHECKOUT');
  });

  it('should parse SHOW_CART action from response', () => {
    const response = 'Here is your cart summary.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('SHOW_CART');
  });

  it('should default to ANSWER_QUESTION for general responses', () => {
    const response = 'Our California Roll is made with fresh ingredients.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ANSWER_QUESTION');
  });

  it('should extract quantity from response', () => {
    const response = 'I\'ve added 2 California Rolls to your cart.';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.quantity).toBe(2);
  });

  it('should find items using fuzzy matching', () => {
    const response = 'Adding miso soup';
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-2');
  });

  it('should parse action with "with ID" format', () => {
    const response = "I've added two Coconut Shrimp to your cart! Action: ADD_ITEM with ID coconut-shrimp";
    const mockMenuWithCoconut = menuSchema.parse({
      id: 'menu-1',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Appetizers',
          items: [
            {
              id: 'coconut-shrimp',
              name: 'Coconut Shrimp',
              price: 6.99,
            },
          ],
        },
      ],
    });
    const action = parseChatAction(response, mockMenuWithCoconut);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('coconut-shrimp');
  });
});

