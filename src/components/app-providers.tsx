'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-context';
import { MaterialProvider } from '@/lib/material-context';
import { ErrorBoundary } from '@/components/error-boundary';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme={false}
      >
        <AuthProvider>
          <MaterialProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </MaterialProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
