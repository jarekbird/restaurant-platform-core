import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/components/order/CartProvider';

describe('CartProvider', () => {
  describe('CartProvider component', () => {
    it('should render children successfully', () => {
      const TestChild = () => <div>Test Child</div>;
      
      render(
        <CartProvider>
          <TestChild />
        </CartProvider>
      );
      
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should accept and render multiple children', () => {
      render(
        <CartProvider>
          <div>Child 1</div>
          <div>Child 2</div>
        </CartProvider>
      );
      
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('useCartContext hook', () => {
    it('should throw error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = () => {};
      
      const TestComponent = () => {
        useCartContext();
        return <div>Test</div>;
      };
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCartContext must be used within CartProvider');
      
      console.error = consoleError;
    });

    it('should throw descriptive error message', () => {
      const consoleError = console.error;
      console.error = () => {};
      
      const TestComponent = () => {
        useCartContext();
        return <div>Test</div>;
      };
      
      try {
        render(<TestComponent />);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        if (error instanceof Error) {
          expect(error.message).toBe('useCartContext must be used within CartProvider');
        }
      }
      
      console.error = consoleError;
    });
  });
});

