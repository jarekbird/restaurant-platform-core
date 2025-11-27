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
        /* Move TanStack Query Devtools button to top left - target all possible selectors */
        button[aria-label*="Tanstack query devtools"],
        button[aria-label*="TanStack query devtools"],
        button[aria-label*="Open Tanstack query devtools"],
        button[aria-label*="Open TanStack query devtools"],
        button[aria-label*="tanstack query devtools"],
        button[aria-label*="open tanstack query devtools"],
        [data-react-query-devtools-button],
        [data-testid*="devtools"],
        .tsqd-button,
        button[class*="tsqd"],
        /* Target the floating action button container */
        div[style*="position: fixed"][style*="bottom"] button,
        div[style*="position:fixed"][style*="bottom"] button {
          position: fixed !important;
          top: 1rem !important;
          left: 1rem !important;
          bottom: auto !important;
          right: auto !important;
          z-index: 9999 !important;
        }
      `}</style>
    </QueryClientProvider>
  );
}

