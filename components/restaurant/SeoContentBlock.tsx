'use client';

import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SeoContentBlockProps {
  config: RestaurantConfig;
  className?: string;
}

/**
 * SeoContentBlock component
 * Renders descriptive content about the restaurant for SEO and AI search
 * Uses mock content tuned to cuisine type
 */
export function SeoContentBlock({ config, className }: SeoContentBlockProps) {
  const theme = useTheme();

  // Mock content - can be tuned to cuisine type
  const getContent = (cuisine?: string) => {
    if (cuisine?.toLowerCase().includes('pizza')) {
      return [
        `${config.name} is a premier pizza restaurant serving authentic Italian-style pizzas made with fresh ingredients and traditional techniques. Our menu features a wide variety of classic and specialty pizzas, all baked to perfection in our wood-fired oven.`,
        `Located in ${config.city || 'the heart of the city'}, we pride ourselves on using only the finest ingredients, from our house-made dough to our premium toppings. Whether you're dining in, taking out, or ordering for delivery, ${config.name} delivers exceptional quality and flavor in every bite.`,
      ];
    }
    if (cuisine?.toLowerCase().includes('sushi')) {
      return [
        `${config.name} brings you an authentic Japanese dining experience with expertly crafted sushi and traditional Japanese cuisine. Our skilled chefs prepare each dish with precision and care, using the freshest fish and highest quality ingredients.`,
        `Experience the art of Japanese cuisine at ${config.name} in ${config.city || 'the city'}. From classic nigiri and sashimi to creative specialty rolls, our menu offers something for every palate. We're committed to providing an exceptional dining experience that honors Japanese culinary traditions.`,
      ];
    }
    // Default generic content
    return [
      `${config.name} is a beloved local restaurant known for serving delicious, high-quality food in a welcoming atmosphere. Our menu features a diverse selection of dishes made with fresh, locally-sourced ingredients whenever possible.`,
      `Located in ${config.city || 'the community'}, ${config.name} has been serving customers with dedication to quality and exceptional service. Whether you're joining us for a casual meal or a special occasion, we're committed to making your dining experience memorable.`,
    ];
  };

  const paragraphs = getContent(config.cuisine);

  return (
    <section className={cn('container mx-auto px-4 py-8', theme.colors.background, className)}>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={cn('text-base md:text-lg leading-relaxed', theme.colors.textMuted, theme.typography.body)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

