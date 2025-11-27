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
        /* Move TanStack Query Devtools button to top left */
        [data-react-query-devtools-button] {
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

