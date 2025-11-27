import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderButton } from '@/components/order/OrderButton';

describe('OrderButton - Badge', () => {
  it('should display badge when itemCount > 0', () => {
    render(<OrderButton itemCount={3} />);
    
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-500');
  });

  it('should not display badge when itemCount is 0', () => {
    render(<OrderButton itemCount={0} />);
    
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('should not display badge when itemCount is undefined', () => {
    render(<OrderButton />);
    
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).not.toBeInTheDocument();
  });

  it('should have proper ARIA label when itemCount > 0', () => {
    render(<OrderButton label="Cart" itemCount={5} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cart (5 items)');
  });

  it('should have proper ARIA label when itemCount is 0', () => {
    render(<OrderButton label="Cart" itemCount={0} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cart');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<OrderButton onClick={handleClick} itemCount={2} />);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

