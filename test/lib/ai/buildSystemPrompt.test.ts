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

  it('should handle menu with single category and single item', () => {
    const minimalMenu = menuSchema.parse({
      id: 'menu-minimal',
      name: 'Minimal Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            {
              id: 'item-1',
              name: 'Single Item',
              price: 5.99,
            },
          ],
        },
      ],
    });
    
    const prompt = buildSystemPrompt(minimalMenu, []);
    
    expect(prompt).toContain('Minimal Menu');
    expect(prompt).toContain('Single Item');
    expect(prompt).toContain('Cart is empty');
  });

  it('should handle menu with items that have no descriptions', () => {
    const menuWithoutDescriptions = menuSchema.parse({
      id: 'menu-2',
      name: 'Menu Without Descriptions',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            {
              id: 'item-no-desc',
              name: 'Item Without Description',
              price: 5.99,
            },
          ],
        },
      ],
    });
    
    const prompt = buildSystemPrompt(menuWithoutDescriptions, []);
    
    expect(prompt).toContain('Item Without Description');
    expect(prompt).toContain('$5.99');
    // Should not have description separator if no description
    expect(prompt).not.toContain('Item Without Description: $5.99 -');
  });

  it('should handle multiple categories correctly', () => {
    const multiCategoryMenu = menuSchema.parse({
      id: 'menu-3',
      name: 'Multi-Category Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Category 1',
          items: [
            { id: 'item-1', name: 'Item 1', price: 1.00 },
          ],
        },
        {
          id: 'cat-2',
          name: 'Category 2',
          items: [
            { id: 'item-2', name: 'Item 2', price: 2.00 },
          ],
        },
        {
          id: 'cat-3',
          name: 'Category 3',
          items: [
            { id: 'item-3', name: 'Item 3', price: 3.00 },
          ],
        },
      ],
    });
    
    const prompt = buildSystemPrompt(multiCategoryMenu, []);
    
    expect(prompt).toContain('Item 1');
    expect(prompt).toContain('Item 2');
    expect(prompt).toContain('Item 3');
    expect(prompt).toContain('$1.00');
    expect(prompt).toContain('$2.00');
    expect(prompt).toContain('$3.00');
  });

  it('should handle cart with large quantities', () => {
    const cart: CartItem[] = [
      {
        id: 'item-1',
        name: 'California Roll',
        price: 8.99,
        quantity: 100,
      },
    ];
    
    const prompt = buildSystemPrompt(mockMenu, cart);
    
    expect(prompt).toContain('× 100');
    expect(prompt).toContain('Total: $899.00');
  });

  it('should handle cart with decimal prices correctly', () => {
    const cart: CartItem[] = [
      {
        id: 'item-1',
        name: 'Item',
        price: 9.99,
        quantity: 2,
      },
      {
        id: 'item-2',
        name: 'Another Item',
        price: 4.50,
        quantity: 3,
      },
    ];
    
    const prompt = buildSystemPrompt(mockMenu, cart);
    
    // 9.99 * 2 = 19.98, 4.50 * 3 = 13.50, total = 33.48
    expect(prompt).toContain('Total: $33.48');
  });

  it('should include currency symbol in prices', () => {
    const prompt = buildSystemPrompt(mockMenu, []);
    
    expect(prompt).toMatch(/\$[\d.]+/); // Should contain dollar signs with prices
  });

  it('should format item prices with exactly 2 decimal places', () => {
    const menuWithDecimalPrices = menuSchema.parse({
      id: 'menu-4',
      name: 'Menu',
      currency: 'USD',
      categories: [
        {
          id: 'cat-1',
          name: 'Items',
          items: [
            { id: 'item-1', name: 'Item', price: 5.5 },
            { id: 'item-2', name: 'Item 2', price: 10 },
          ],
        },
      ],
    });
    
    const prompt = buildSystemPrompt(menuWithDecimalPrices, []);
    
    expect(prompt).toContain('$5.50');
    expect(prompt).toContain('$10.00');
  });

  it('should handle cart items that are not in the menu', () => {
    const cart: CartItem[] = [
      {
        id: 'item-not-in-menu',
        name: 'Item Not in Menu',
        price: 15.99,
        quantity: 1,
      },
    ];
    
    const prompt = buildSystemPrompt(mockMenu, cart);
    
    // Should still include the cart item even if not in menu
    expect(prompt).toContain('Item Not in Menu');
    expect(prompt).toContain('Total: $15.99');
  });
});

