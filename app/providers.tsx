"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

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

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false}
        buttonPosition="bottom-right"
      />
      <style jsx global>{`
        /* Move TanStack Query Devtools toggle button (open) to top left */
        button[aria-label*="Open Tanstack query devtools"],
        button[aria-label*="Open TanStack query devtools"],
        button[aria-label*="open tanstack query devtools"],
        [data-react-query-devtools-button] {
          position: fixed !important;
          top: 1rem !important;
          left: 1rem !important;
          bottom: auto !important;
          right: auto !important;
          z-index: 9999 !important;
        }
        
        /* Keep close button in bottom right */
        button[aria-label*="Close tanstack query devtools"],
        button[aria-label*="Close TanStack query devtools"],
        button[aria-label*="close tanstack query devtools"] {
          position: fixed !important;
          bottom: 1rem !important;
          right: 1rem !important;
          top: auto !important;
          left: auto !important;
          z-index: 9999 !important;
        }
      `}</style>
    </QueryClientProvider>
  );
}

