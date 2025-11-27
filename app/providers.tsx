"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);

  useEffect(() => {
    // Handle toggle from header button
    const toggleButton = document.getElementById('tanstack-devtools-toggle');
    const handleClick = () => {
      setIsDevtoolsOpen((prev) => !prev);
    };

    if (toggleButton) {
      toggleButton.addEventListener('click', handleClick);
      return () => {
        toggleButton.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={isDevtoolsOpen}
        buttonPosition="bottom-right"
      />
      <style jsx global>{`
        /* Hide the default devtools floating button */
        [data-react-query-devtools-button] {
          display: none !important;
        }
      `}</style>
    </QueryClientProvider>
  );
}

