import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderConfirmationModal } from '@/components/order/OrderConfirmationModal';

describe('OrderConfirmationModal', () => {
  const mockOrderSummary = {
    items: [
      { id: 'item1', name: 'Item 1', price: 10.99, quantity: 2 },
      { id: 'item2', name: 'Item 2', price: 5.50, quantity: 1 },
    ],
    total: 27.48,
    customerName: 'John Doe',
  };

  it('should not render when isOpen is false', () => {
    render(
      <OrderConfirmationModal
        isOpen={false}
        onClose={vi.fn()}
        orderSummary={mockOrderSummary}
      />
    );
    
    expect(screen.queryByText('Order Confirmed!')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        orderSummary={mockOrderSummary}
      />
    );
    
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText(/Thank you/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('should display order summary correctly', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        orderSummary={mockOrderSummary}
      />
    );
    
    expect(screen.getByText('Item 1 × 2')).toBeInTheDocument();
    expect(screen.getByText('Item 2 × 1')).toBeInTheDocument();
    expect(screen.getByText('$27.48')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={handleClose}
        orderSummary={mockOrderSummary}
      />
    );
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={handleClose}
        orderSummary={mockOrderSummary}
      />
    );
    
    const backdrop = screen.getByRole('dialog').previousElementSibling;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should have proper ARIA attributes', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        orderSummary={mockOrderSummary}
      />
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'order-confirmation-title');
    expect(modal).toHaveAttribute('aria-describedby', 'order-confirmation-description');
  });
});

