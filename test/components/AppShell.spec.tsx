/**
 * Test for AppShell layout component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/layout/AppShell';

describe('AppShell', () => {
  it('should render header region', () => {
    render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Restaurant Platform')).toBeInTheDocument();
  });

  it('should render main container area with children', () => {
    render(
      <AppShell>
        <div>Main Content</div>
      </AppShell>
    );
    
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('should render footer region', () => {
    render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getByText(/Restaurant Platform Core/i)).toBeInTheDocument();
  });

  it('should render all three regions together', () => {
    render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

