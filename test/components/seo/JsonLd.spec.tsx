/**
 * JsonLd Component Tests
 * 
 * Verifies that JsonLd component renders JSON-LD script tag correctly.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLd } from '@/components/seo/JsonLd';

const mockJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Test Restaurant',
};

describe('JsonLd', () => {
  it('should render script tag with application/ld+json type', () => {
    const { container } = render(<JsonLd data={mockJsonLd} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('should render valid JSON string', () => {
    const { container } = render(<JsonLd data={mockJsonLd} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    
    const content = script?.textContent;
    expect(content).toBeTruthy();
    
    // Verify JSON is valid
    const parsed = JSON.parse(content || '{}');
    expect(parsed['@type']).toBe('Restaurant');
    expect(parsed.name).toBe('Test Restaurant');
  });

  it('should handle complex JSON-LD objects', () => {
    const complexData = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Test',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Test St',
      },
    };
    
    const { container } = render(<JsonLd data={complexData} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    const content = script?.textContent;
    const parsed = JSON.parse(content || '{}');
    
    expect(parsed.address).toBeDefined();
    expect(parsed.address['@type']).toBe('PostalAddress');
  });
});

