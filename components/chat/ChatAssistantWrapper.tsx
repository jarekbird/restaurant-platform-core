'use client';

import { ChatAssistant } from './ChatAssistant';
import { Menu } from '@/lib/schemas/menu';
import { useCartContext } from '@/components/order/CartProvider';

interface ChatAssistantWrapperProps {
  menu: Menu;
}

/**
 * ChatAssistantWrapper component
 * Wraps ChatAssistant to provide cart context
 */
export function ChatAssistantWrapper({ menu }: ChatAssistantWrapperProps) {
  const { items } = useCartContext();
  
  // Optional callback for cart actions (can be used for notifications)
  const handleCartAction = (action: string) => {
    // Could show a toast notification here
    console.log('Cart action:', action);
  };
  
  return <ChatAssistant menu={menu} cart={items} onCartAction={handleCartAction} />;
}

