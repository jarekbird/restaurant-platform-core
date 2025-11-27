'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

/**
 * Toast component
 * Displays a single toast notification
 */
function ToastComponent({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'mb-2 rounded-md px-4 py-3 shadow-lg transition-all',
        toast.type === 'success' && 'bg-green-500 text-white',
        toast.type === 'error' && 'bg-red-500 text-white',
        toast.type === 'info' && 'bg-blue-500 text-white'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-4 text-white opacity-70 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

/**
 * ToastContainer component
 * Container for multiple toast notifications
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

