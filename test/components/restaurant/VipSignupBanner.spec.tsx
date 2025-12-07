/**
 * VipSignupBanner Tests
 * 
 * Verifies that VipSignupBanner renders correctly and handles form submission.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VipSignupBanner } from '@/components/restaurant/VipSignupBanner';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

describe('VipSignupBanner', () => {
  it('should render heading and form', () => {
    render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupBanner />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    expect(screen.getByText('Join Our VIP Program')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should validate email format', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupBanner />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should submit form with valid email', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupBanner />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('VIP Signup:', { email: 'test@example.com' });
    consoleSpy.mockRestore();
  });

  it('should use theme tokens for styling', () => {
    const { container } = render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupBanner />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    const section = container.querySelector('section');
    const button = screen.getByText('Sign Up');

    expect(section?.className).toContain('bg-');
    expect(button.className).toContain('bg-');
  });
});

