'use client';

import { useToastContext } from '@/components/ui/ToastProvider';

/**
 * useOptionalToast hook
 * Returns toast functions if ToastProvider is available, otherwise returns no-ops
 * This allows components to use toast without requiring ToastProvider
 */
export function useOptionalToast() {
  try {
    return useToastContext();
  } catch {
    // Return no-op functions if ToastProvider is not available
    return {
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
}














