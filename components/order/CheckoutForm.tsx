'use client';

import { FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface CheckoutFormData {
  name: string;
  phone: string;
  notes?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  className?: string;
}

/**
 * CheckoutForm component
 * Basic form with name, phone, notes fields and onSubmit callback
 * No backend - just calls the provided callback
 */
export function CheckoutForm({ onSubmit, className }: CheckoutFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CheckoutFormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      notes: (formData.get('notes') as string) || undefined,
    };
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      aria-label="Checkout form"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        aria-label="Submit order"
      >
        Submit Order
      </button>
    </form>
  );
}

