import { ReactNode } from 'react';
import Image from 'next/image';
import { RestaurantConfig } from '@/lib/schemas/restaurant';
import { RestaurantThemeProvider } from '@/components/theme/ThemeProvider';

interface RestaurantLayoutProps {
  config: RestaurantConfig;
  children: ReactNode;
}

/**
 * RestaurantLayout component
 * Renders a restaurant-specific layout with header, main content, and footer
 * Accepts restaurantConfig to display restaurant-specific information
 */
export function RestaurantLayout({ config, children }: RestaurantLayoutProps) {
  const formatHours = (hours: RestaurantConfig['hours']) => {
    const dayNames: Record<string, string> = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    };
    
    return Object.entries(hours)
      .map(([day, time]) => `${dayNames[day]}: ${time}`)
      .join(', ');
  };

  return (
    <RestaurantThemeProvider themeKey={config.theme}>
      <div className="flex min-h-screen flex-col">
      {/* Header with logo or restaurant name + navigation stub */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            {config.logo ? (
              <Image
                src={config.logo}
                alt={`${config.name} logo`}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <h1 className="text-xl font-semibold">{config.name}</h1>
            )}
          </div>
          <nav className="flex items-center gap-4">
            {/* Navigation stub */}
            <span className="text-sm text-gray-600 dark:text-gray-400">Menu</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">About</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Contact</span>
          </nav>
        </div>
      </header>

      {/* Main area that renders children */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer with address, hours, and phone */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Address */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Address</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.address}
                <br />
                {config.city}, {config.state} {config.zip}
              </p>
            </div>

            {/* Hours */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatHours(config.hours)}
              </p>
            </div>

            {/* Phone */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.phone}
              </p>
              {config.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
    </RestaurantThemeProvider>
  );
}

