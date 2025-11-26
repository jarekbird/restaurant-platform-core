/**
 * Integration test for preview layout with AppShell
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreviewLayout from '@/app/(preview)/layout';

describe('Preview Layout', () => {
  it('should render AppShell elements when using preview layout', () => {
    const TestPage = () => <div>Test Page Content</div>;
    
    render(
      <PreviewLayout>
        <TestPage />
      </PreviewLayout>
    );
    
    // Verify AppShell elements are present
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Verify children are rendered in main area
    expect(screen.getByText('Test Page Content')).toBeInTheDocument();
  });

  it('should render preview page content correctly', () => {
    render(
      <PreviewLayout>
        <div>Preview Content</div>
      </PreviewLayout>
    );
    
    expect(screen.getByText('Preview Content')).toBeInTheDocument();
  });
});

