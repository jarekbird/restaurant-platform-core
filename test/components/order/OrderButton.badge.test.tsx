import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderButton } from '@/components/order/OrderButton';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';

describe('OrderButton - Badge', () => {
  it('should display badge when itemCount > 0', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton itemCount={3} />
      </RestaurantThemeProvider>
    );
    
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    // Badge should have background color (theme accent color)
    expect(badge.className).toMatch(/bg-/);
  });

  it('should not display badge when itemCount is 0', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton itemCount={0} />
      </RestaurantThemeProvider>
    );
    
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('should not display badge when itemCount is undefined', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton />
      </RestaurantThemeProvider>
    );
    
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).not.toBeInTheDocument();
  });

  it('should have proper ARIA label when itemCount > 0', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton label="Cart" itemCount={5} />
      </RestaurantThemeProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cart (5 items)');
  });

  it('should have proper ARIA label when itemCount is 0', () => {
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton label="Cart" itemCount={0} />
      </RestaurantThemeProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cart');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <RestaurantThemeProvider themeKey="warm-pizza">
        <OrderButton onClick={handleClick} itemCount={2} />
      </RestaurantThemeProvider>
    );
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

