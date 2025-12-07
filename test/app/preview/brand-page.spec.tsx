import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BrandPreviewPage from '@/app/preview/brand/[slug]/page';
import { CartProvider } from '@/components/order/CartProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; width?: number; height?: number; fill?: boolean; priority?: boolean; className?: string }) => {
    const { fill, priority, ...imgProps } = props;
    // Suppress unused variable warnings for test mock
    void fill;
    void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} alt={props.alt || ''} />;
  },
}));

describe('BrandPreviewPage', () => {
  it('should render brand page with brand name and description', async () => {
    const page = await BrandPreviewPage({
      params: Promise.resolve({ slug: 'so-delicious' }),
    });

    render(
      <ToastProvider>
        <CartProvider>
          {page}
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText('So Delicious Sushi')).toBeInTheDocument();
    expect(screen.getByText(/Authentic Japanese cuisine with fresh ingredients/)).toBeInTheDocument();
  });

  it('should render location cards for each location', async () => {
    const page = await BrandPreviewPage({
      params: Promise.resolve({ slug: 'so-delicious' }),
    });

    render(
      <ToastProvider>
        <CartProvider>
          {page}
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText('So Delicious Sushi - San Francisco')).toBeInTheDocument();
    expect(screen.getByText('So Delicious Sushi - Oakland')).toBeInTheDocument();
  });

  it('should render "Order from this location" buttons with correct links', async () => {
    const page = await BrandPreviewPage({
      params: Promise.resolve({ slug: 'so-delicious' }),
    });

    render(
      <ToastProvider>
        <CartProvider>
          {page}
        </CartProvider>
      </ToastProvider>
    );

    const orderButtons = screen.getAllByText('Order from this location');
    expect(orderButtons.length).toBe(2);

    // Check that buttons are links
    const links = orderButtons.map((btn) => btn.closest('a'));
    expect(links[0]?.getAttribute('href')).toBe('/preview/so-delicious-sushi');
    expect(links[1]?.getAttribute('href')).toBe('/preview/tataki');
  });

  it('should render location addresses and hours', async () => {
    const page = await BrandPreviewPage({
      params: Promise.resolve({ slug: 'so-delicious' }),
    });

    render(
      <ToastProvider>
        <CartProvider>
          {page}
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText('123 Sushi Street')).toBeInTheDocument();
    expect(screen.getByText('456 Main Street')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA 94102')).toBeInTheDocument();
    expect(screen.getByText('Oakland, CA 94601')).toBeInTheDocument();
  });

  it('should call notFound for unknown brand slug', async () => {
    const { notFound } = await import('next/navigation');
    const notFoundMock = vi.mocked(notFound);
    notFoundMock.mockClear();

    try {
      await BrandPreviewPage({
        params: Promise.resolve({ slug: 'unknown-brand' }),
      });
    } catch {
      // notFound throws, which is expected
    }

    expect(notFoundMock).toHaveBeenCalled();
  });

  it('should render "Our Locations" heading', async () => {
    const page = await BrandPreviewPage({
      params: Promise.resolve({ slug: 'so-delicious' }),
    });

    render(
      <ToastProvider>
        <CartProvider>
          {page}
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText('Our Locations')).toBeInTheDocument();
  });
});

