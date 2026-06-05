'use client';

import { useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-context';
import { MaterialProvider } from '@/lib/material-context';
import { ApplicationProvider } from '@/lib/application-context';
import { NotificationProvider } from '@/lib/notification-context';
import { UserProfileProvider } from '@/lib/user-profile-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { LocaleProvider } from '@/lib/i18n/locale-context';
import { AICopilotWidget } from '@/components/ai-copilot/copilot-widget';
import { SmoothScrollProvider } from '@/components/system/smooth-scroll';
import { ToastProvider } from '@/components/system/toast';
import { PageTransition } from '@/components/system/page-transition';
import { ThemeTransitionInit } from '@/lib/theme/use-theme-transition';
import { getCloudBaseAuth } from '@/lib/cloudbase/web-client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const ResumeProgressFloat = dynamic(
  () =>
    import('@/components/dashboard/resume-progress-float').then(
      (m) => m.ResumeProgressFloat
    ),
  { ssr: false }
);

/** CloudBase Auth 惰性初始化（首次调用 getCloudBaseAuth 时自动 init） */
function CloudBaseInit() {
  useEffect(() => {
    try {
      getCloudBaseAuth();
      console.info('[cloudbase-web] ✅ Auth 实例已就绪');
    } catch (err) {
      console.error('[cloudbase-web] ❌ Auth 初始化失败:', err);
    }
  }, []);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme={false}
      >
        <ThemeTransitionInit />
        <LocaleProvider>
          <AuthProvider>
          <MaterialProvider>
            <ApplicationProvider>
              <NotificationProvider>
                <UserProfileProvider>
                  <CloudBaseInit />
                  <SmoothScrollProvider>
                    <ToastProvider>
                      <Header />
                      <PageTransition>
                        {children}
                      </PageTransition>
                      <Footer />
                      <AICopilotWidget />
                      <ResumeProgressFloat />
                    </ToastProvider>
                  </SmoothScrollProvider>
                </UserProfileProvider>
              </NotificationProvider>
            </ApplicationProvider>
          </MaterialProvider>
        </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
