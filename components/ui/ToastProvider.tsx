'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from './Toast';

interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * ToastProvider component
 * Provides toast functionality to all child components
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, dismissToast, success, error, info } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

/**
 * useToastContext hook
 * Provides access to toast functions
 */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  
  return context;
}














