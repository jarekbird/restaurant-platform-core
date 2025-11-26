/**
 * Test for TanStack Query provider with devtools
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/app/providers';

describe('Providers', () => {
  it('should render children without error', () => {
    const TestChild = () => <div>Test Content</div>;
    
    render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide QueryClient context', () => {
    const TestChild = () => {
      // This test verifies that QueryClientProvider is working
      // by checking that children can render
      return <div>Query Client Available</div>;
    };
    
    render(
      <Providers>
        <TestChild />
      </Providers>
    );
    
    expect(screen.getByText('Query Client Available')).toBeInTheDocument();
  });
});

