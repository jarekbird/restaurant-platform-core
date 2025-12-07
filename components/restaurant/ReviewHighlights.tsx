'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface ReviewHighlightsProps {
  className?: string;
}

/**
 * ReviewHighlights component
 * Renders aggregate rating, review count, and review quotes for social proof
 * Uses mock/demo data for now (can be wired to real data later)
 */
export function ReviewHighlights({ className }: ReviewHighlightsProps) {
  const theme = useTheme();

  // Mock review data
  const rating = 4.8;
  const reviewCount = 127;
  const reviews = [
    {
      quote: 'Absolutely amazing food! The best pizza I\'ve had in years. Highly recommend!',
      reviewer: 'Sarah M.',
    },
    {
      quote: 'Great atmosphere and friendly staff. Will definitely be back soon!',
      reviewer: 'John D.',
    },
    {
      quote: 'The quality and freshness of ingredients really shows. Five stars!',
      reviewer: 'Emily R.',
    },
  ];

  return (
    <section className={cn('container mx-auto px-4 py-12', theme.colors.background, className)}>
      <div className="max-w-4xl mx-auto">
        {/* Rating and review count */}
        <div className="text-center mb-8">
          <div className={cn('text-5xl font-bold mb-2', theme.colors.text, theme.typography.heading)}>
            {rating} / 5
          </div>
          <p className={cn('text-lg', theme.colors.textMuted, theme.typography.body)}>
            Based on {reviewCount} reviews
          </p>
        </div>

        {/* Review quotes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={cn('p-6 rounded-lg border', theme.colors.surface, theme.colors.border)}
            >
              <p className={cn('text-sm mb-4', theme.colors.textMuted, theme.typography.body)}>
                &ldquo;{review.quote}&rdquo;
              </p>
              <p className={cn('text-sm font-semibold', theme.colors.text, theme.typography.heading)}>
                — {review.reviewer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

