'use client';

import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

interface HoursAndLocationProps {
  config: RestaurantConfig;
  className?: string;
}

/**
 * HoursAndLocation component
 * Formats and displays hours and address from restaurant config
 */
export function HoursAndLocation({ config, className }: HoursAndLocationProps) {
  const theme = useTheme();
  const dayNames: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  return (
    <section className={cn('container mx-auto px-4 py-12', theme.colors.background, className)}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Location */}
        <div>
          <h2 className={cn('mb-4 text-2xl font-bold', theme.colors.text, theme.typography.heading)}>Location</h2>
          <address className="not-italic">
            <p className={theme.colors.text}>
              {config.address}
            </p>
            <p className={theme.colors.text}>
              {config.city}, {config.state} {config.zip}
            </p>
            <p className={cn('mt-2', theme.colors.text)}>
              {config.phone}
            </p>
            {config.email && (
              <p className={theme.colors.text}>
                {config.email}
              </p>
            )}
          </address>
        </div>

        {/* Hours */}
        <div>
          <h2 className={cn('mb-4 text-2xl font-bold', theme.colors.text, theme.typography.heading)}>Hours</h2>
          <dl className="space-y-2">
            {Object.entries(config.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <dt className={cn('font-semibold', theme.colors.text)}>
                  {dayNames[day]}:
                </dt>
                <dd className={theme.colors.textMuted}>{hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

