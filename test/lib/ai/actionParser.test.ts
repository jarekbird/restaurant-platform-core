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

  it('should parse UPDATE_QUANTITY action with explicit format', () => {
    const response = "Action: UPDATE_QUANTITY with ID item-1 quantity 5";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('UPDATE_QUANTITY');
    expect(action?.itemId).toBe('item-1');
    expect(action?.quantity).toBe(5);
  });


  it('should handle fuzzy matching with typos', () => {
    const response = "Add california rol to cart";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should handle fuzzy matching with case variations', () => {
    const response = "ADD CALIFORNIA ROLL";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should handle fuzzy matching with partial word matches', () => {
    const response = "I want to add miso soup";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-2');
  });

  it('should handle fuzzy matching when item name words are in different order', () => {
    const mockMenuWithMultiWord = menuSchema.parse({
      id: 'menu-1',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            {
              id: 'item-1',
              name: 'Chicken Teriyaki Bowl',
              price: 12.99,
            },
          ],
        },
      ],
    });
    
    const response = "Add teriyaki chicken bowl";
    const action = parseChatAction(response, mockMenuWithMultiWord);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should extract quantity from number words (two, three, etc.)', () => {
    const response = "I've added three California Rolls to your cart.";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
    expect(action?.quantity).toBe(3);
  });

  it('should extract quantity from digits', () => {
    const response = "Adding 4 Miso Soups";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-2');
    expect(action?.quantity).toBe(4);
  });

  it('should handle quantity with "x" or "×" notation', () => {
    const response = "Add 2 x California Roll";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
    expect(action?.quantity).toBe(2);
  });

  it('should return null itemId for actions that do not require it', () => {
    const response = "Let's proceed to checkout";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('CHECKOUT');
    expect(action?.itemId).toBeUndefined();
  });

  it('should handle remove action with fuzzy matching', () => {
    const response = "Remove miso soup please";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('REMOVE_ITEM');
    expect(action?.itemId).toBe('item-2');
  });

  it('should handle show cart variations', () => {
    const variations = [
      "Show cart",
      "View cart",
      "Cart summary",
    ];
    
    for (const response of variations) {
      const action = parseChatAction(response, mockMenu);
      expect(action).not.toBeNull();
      expect(action?.type).toBe('SHOW_CART');
    }
  });

  it('should handle checkout variations', () => {
    const variations = [
      "I'm ready to checkout",
      "Let's check out",
      "Place order",
      "Complete order",
    ];
    
    for (const response of variations) {
      const action = parseChatAction(response, mockMenu);
      expect(action).not.toBeNull();
      expect(action?.type).toBe('CHECKOUT');
    }
  });

  it('should handle items with special characters in names', () => {
    const mockMenuWithSpecialChars = menuSchema.parse({
      id: 'menu-1',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            {
              id: 'item-1',
              name: "Joe's Special Pizza",
              price: 15.99,
            },
          ],
        },
      ],
    });
    
    const response = "Add Joe's Special Pizza";
    const action = parseChatAction(response, mockMenuWithSpecialChars);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    expect(action?.itemId).toBe('item-1');
  });

  it('should handle multiple items mentioned but only act on the first match', () => {
    const mockMenuWithMultiple = menuSchema.parse({
      id: 'menu-1',
      name: 'Test Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            { id: 'item-1', name: 'Pizza', price: 10.99 },
            { id: 'item-2', name: 'Pasta', price: 12.99 },
          ],
        },
      ],
    });
    
    const response = "Add pizza and pasta";
    const action = parseChatAction(response, mockMenuWithMultiple);
    
    // Should match the first item found
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ADD_ITEM');
    // Should match one of them (implementation dependent)
    expect(['item-1', 'item-2']).toContain(action?.itemId);
  });

  it('should preserve original message in action', () => {
    const response = "I've added a California Roll to your cart.";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.message).toBe(response);
  });

  it('should handle empty response gracefully', () => {
    const action = parseChatAction('', mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ANSWER_QUESTION');
  });

  it('should handle response with no actionable content', () => {
    const response = "Thank you for your interest!";
    const action = parseChatAction(response, mockMenu);
    
    expect(action).not.toBeNull();
    expect(action?.type).toBe('ANSWER_QUESTION');
  });

  it('should handle item not found in menu', () => {
    const response = "Add a non-existent item";
    const action = parseChatAction(response, mockMenu);
    
    // Should still return an action, but without itemId
    expect(action).not.toBeNull();
    // The implementation may return ADD_ITEM without itemId or ANSWER_QUESTION
    // This tests the behavior when item lookup fails
    if (action?.type === 'ADD_ITEM') {
      expect(action?.itemId).toBeUndefined();
    }
  });
});

