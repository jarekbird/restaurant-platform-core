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
  
  return <ChatAssistant menu={menu} cart={items} />;
}

