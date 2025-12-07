/**
 * VipSignupSection Tests
 * 
 * Verifies that VipSignupSection renders correctly and handles form submission.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VipSignupSection } from '@/components/restaurant/VipSignupSection';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

describe('VipSignupSection', () => {
  it('should render heading and form', () => {
    render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupSection />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    expect(screen.getByText('Join Our VIP Program')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { container } = render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupSection />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Wait for error to appear - check for role="alert" elements
    await waitFor(() => {
      const errorElements = container.querySelectorAll('p[role="alert"]');
      expect(errorElements.length).toBeGreaterThan(0);
    });
    
    // Verify error message content
    const errorElements = container.querySelectorAll('p[role="alert"]');
    const hasEmailError = Array.from(errorElements).some(el => 
      el.textContent?.includes('valid email') || 
      el.textContent?.includes('provide either')
    );
    expect(hasEmailError).toBe(true);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should submit form with valid email', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(
      <ToastProvider>
        <RestaurantThemeProvider themeKey="warm-pizza">
          <VipSignupSection />
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
          <VipSignupSection />
        </RestaurantThemeProvider>
      </ToastProvider>
    );

    const section = container.querySelector('section');
    const button = screen.getByText('Sign Up');

    expect(section?.className).toContain('bg-');
    expect(button.className).toContain('bg-');
  });
});

