'use client';

import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface AboutSectionProps {
  config: RestaurantConfig;
  className?: string;
}

/**
 * AboutSection component
 * Renders "Our Story" section with descriptive text about the restaurant
 * Uses theme tokens for styling and can be customized based on cuisine
 */
export function AboutSection({ config, className }: AboutSectionProps) {
  const theme = useTheme();

  // Mock content - can be tuned to cuisine type
  const getStoryContent = (cuisine?: string) => {
    if (cuisine?.toLowerCase().includes('pizza')) {
      return {
        heading: 'Our Story',
        paragraphs: [
          'For over a decade, we\'ve been crafting authentic Italian-style pizzas using traditional recipes passed down through generations. Our commitment to quality ingredients and time-honored techniques has made us a beloved neighborhood favorite.',
          'Every pizza is made fresh to order, with hand-tossed dough, house-made sauce, and premium toppings. We believe that great food brings people together, and we\'re proud to be part of your family\'s special moments.',
        ],
      };
    }
    if (cuisine?.toLowerCase().includes('sushi')) {
      return {
        heading: 'Our Story',
        paragraphs: [
          'Inspired by the art of Japanese cuisine, we bring you an authentic sushi experience that honors traditional techniques while embracing modern innovation. Our master chefs have trained in Japan and bring decades of expertise to every dish.',
          'We source the finest, freshest ingredients daily, ensuring that every piece of sushi meets our exacting standards. From classic nigiri to creative rolls, we invite you to discover the perfect balance of flavor, texture, and presentation.',
        ],
      };
    }
    // Default generic story
    return {
      heading: 'Our Story',
      paragraphs: [
        'We are passionate about creating exceptional dining experiences that bring people together. Our journey began with a simple mission: to serve delicious, high-quality food made with care and attention to detail.',
        'Every dish we create is crafted with fresh, locally-sourced ingredients whenever possible. We believe that great food should be accessible, enjoyable, and memorable. Whether you\'re joining us for a quick lunch or a special celebration, we\'re here to make your experience unforgettable.',
      ],
    };
  };

  const content = getStoryContent(config.cuisine);

  return (
    <section className={cn('container mx-auto px-4 py-12', theme.colors.background, className)}>
      <div className="max-w-3xl mx-auto">
        <h2 className={cn('text-3xl md:text-4xl font-bold mb-6', theme.colors.text, theme.typography.heading)}>
          {content.heading}
        </h2>
        <div className="space-y-4">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className={cn('text-base md:text-lg leading-relaxed', theme.colors.textMuted, theme.typography.body)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

