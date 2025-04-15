"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = {
  children: ReactNode;
};
const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>


    <SessionProvider>
      {children}
    </SessionProvider>
    </QueryClientProvider>
  );
}

