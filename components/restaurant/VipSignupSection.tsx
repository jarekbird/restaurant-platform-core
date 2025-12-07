'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useToastContext } from '@/components/ui/ToastProvider';

interface VipSignupSectionProps {
  className?: string;
}

/**
 * VipSignupSection component
 * Section-style component for capturing email/phone for VIP/loyalty program
 * Uses mock submit handler (logs to console and shows toast)
 */
export function VipSignupSection({ className }: VipSignupSectionProps) {
  const theme = useTheme();
  const { success } = useToastContext();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePhone = (phoneValue: string): boolean => {
    // Basic phone validation - at least 10 digits
    const digitsOnly = phoneValue.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; phone?: string } = {};

    // Validate email if provided
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Require at least one field
    if (!email && !phone) {
      newErrors.email = 'Please provide either email or phone';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock submit - log to console and show toast
    console.log('VIP Signup:', { email: email || undefined, phone: phone || undefined });
    success('Thank you for signing up! You\'ll receive exclusive offers soon.');

    // Clear form
    setEmail('');
    setPhone('');
    setErrors({});
  };

  return (
    <section className={cn('container mx-auto px-4 py-12', theme.colors.background, className)}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', theme.colors.text, theme.typography.heading)}>
          Join Our VIP Program
        </h2>
        <p className={cn('text-lg mb-8', theme.colors.textMuted, theme.typography.body)}>
          Get exclusive offers, early access to new menu items, and special discounts delivered to your inbox
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="Email address"
            className={cn(
              'flex-1 px-4 py-3 rounded-md border',
              theme.colors.background,
              theme.colors.border,
              theme.colors.text,
              errors.email && 'border-red-500'
            )}
            aria-label="Email address"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            placeholder="Phone number"
            className={cn(
              'flex-1 px-4 py-3 rounded-md border',
              theme.colors.background,
              theme.colors.border,
              theme.colors.text,
              errors.phone && 'border-red-500'
            )}
            aria-label="Phone number"
          />
          <button
            type="submit"
            className={cn('px-8 py-3 rounded-md font-semibold', theme.colors.primary, theme.typography.heading)}
          >
            Sign Up
          </button>
        </form>
        {errors.email && (
          <p className={cn('text-sm mt-2', 'text-red-500')} role="alert">
            {errors.email}
          </p>
        )}
        {errors.phone && (
          <p className={cn('text-sm mt-2', 'text-red-500')} role="alert">
            {errors.phone}
          </p>
        )}
      </div>
    </section>
  );
}

