import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Base AppShell layout component
 * Provides a consistent layout structure with header, main content area, and footer
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header region */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Restaurant Platform</h1>
          </div>
          <nav className="flex items-center gap-4">
            {/* Navigation area placeholder */}
            <span className="text-sm text-gray-600 dark:text-gray-400">Nav</span>
          </nav>
        </div>
      </header>

      {/* Main container area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer region */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Restaurant Platform Core
          </p>
        </div>
      </footer>
    </div>
  );
}

