/**
 * Tests for order components (CartDrawer, OrderButton, CheckoutForm)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '@/components/order/CartDrawer';
import { OrderButton } from '@/components/order/OrderButton';
import { CheckoutForm } from '@/components/order/CheckoutForm';

describe('Order Components', () => {
  describe('CartDrawer', () => {
    const mockItems = [
      { id: '1', name: 'Pizza', price: 15.99, quantity: 1 },
      { id: '2', name: 'Pasta', price: 14.99, quantity: 2 },
    ];

    it('should not render when isOpen is false', () => {
      const { container } = render(
        <CartDrawer isOpen={false} onClose={() => {}} items={[]} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} items={[]} />);
      expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    it('should render empty cart message when items array is empty', () => {
      render(<CartDrawer isOpen={true} onClose={() => {}} items={[]} />);
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should render cart items when provided', () => {
      render(
        <CartDrawer isOpen={true} onClose={() => {}} items={mockItems} />
      );
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Pasta')).toBeInTheDocument();
    });

    it('should calculate and display total correctly', () => {
      render(
        <CartDrawer isOpen={true} onClose={() => {}} items={mockItems} />
      );
      // Total: 15.99 + (14.99 * 2) = 45.97
      expect(screen.getByText('$45.97')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(
        <CartDrawer isOpen={true} onClose={handleClose} items={[]} />
      );
      const closeButton = screen.getByLabelText('Close cart');
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const handleClose = vi.fn();
      render(
        <CartDrawer isOpen={true} onClose={handleClose} items={[]} />
      );
      const backdrop = screen.getByRole('dialog').previousElementSibling;
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('OrderButton', () => {
    it('should render with default label', () => {
      render(<OrderButton onClick={() => {}} />);
      expect(screen.getByText('Order Now')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      render(<OrderButton onClick={() => {}} label="Add to Cart" />);
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<OrderButton onClick={handleClick} />);
      const button = screen.getByText('Order Now');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should accept and apply className prop', () => {
      const { container } = render(
        <OrderButton onClick={() => {}} className="custom-class" />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('CheckoutForm', () => {
    it('should render form fields', () => {
      render(<CheckoutForm onSubmit={() => {}} />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
    });

    it('should call onSubmit with form data when submitted', () => {
      const handleSubmit = vi.fn();
      render(<CheckoutForm onSubmit={handleSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const phoneInput = screen.getByLabelText('Phone');
      const notesInput = screen.getByLabelText('Notes (optional)');
      const submitButton = screen.getByText('Submit Order');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '555-1234' } });
      fireEvent.change(notesInput, { target: { value: 'Extra sauce' } });
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '555-1234',
        notes: 'Extra sauce',
      });
    });

    it('should handle optional notes field', () => {
      const handleSubmit = vi.fn();
      render(<CheckoutForm onSubmit={handleSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const phoneInput = screen.getByLabelText('Phone');
      const submitButton = screen.getByText('Submit Order');

      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(phoneInput, { target: { value: '555-5678' } });
      fireEvent.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        phone: '555-5678',
        notes: undefined,
      });
    });

    it('should require name and phone fields', () => {
      render(<CheckoutForm onSubmit={() => {}} />);
      const nameInput = screen.getByLabelText('Name');
      const phoneInput = screen.getByLabelText('Phone');
      expect(nameInput).toBeRequired();
      expect(phoneInput).toBeRequired();
    });
  });
});

