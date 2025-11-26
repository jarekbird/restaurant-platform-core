import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { cn } from '@/lib/utils';

interface HoursAndLocationProps {
  config: RestaurantConfig;
  className?: string;
}

/**
 * HoursAndLocation component
 * Formats and displays hours and address from restaurant config
 */
export function HoursAndLocation({ config, className }: HoursAndLocationProps) {
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
    <section className={cn('container mx-auto px-4 py-12', className)}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Location */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Location</h2>
          <address className="not-italic">
            <p className="text-gray-700 dark:text-gray-300">
              {config.address}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {config.city}, {config.state} {config.zip}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {config.phone}
            </p>
            {config.email && (
              <p className="text-gray-700 dark:text-gray-300">
                {config.email}
              </p>
            )}
          </address>
        </div>

        {/* Hours */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Hours</h2>
          <dl className="space-y-2">
            {Object.entries(config.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <dt className="font-semibold text-gray-700 dark:text-gray-300">
                  {dayNames[day]}:
                </dt>
                <dd className="text-gray-600 dark:text-gray-400">{hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

