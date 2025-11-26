/**
 * Minimal sanity test for the app root
 * Renders the default app/page.tsx and asserts known text is present
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('App Root', () => {
  it('should render the home page with known text', () => {
    render(<Home />);
    
    // Assert that known text from the page is present
    const heading = screen.getByText(/To get started, edit the page.tsx file./i);
    expect(heading).toBeInTheDocument();
  });

  it('should render the Deploy Now button', () => {
    render(<Home />);
    
    const deployButton = screen.getByText(/Deploy Now/i);
    expect(deployButton).toBeInTheDocument();
  });

  it('should render the Documentation link', () => {
    render(<Home />);
    
    const docLink = screen.getByText(/Documentation/i);
    expect(docLink).toBeInTheDocument();
  });
});

