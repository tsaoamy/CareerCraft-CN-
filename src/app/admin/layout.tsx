'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin/admin-auth-context';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin';

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, isLoading, isAuthenticated, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="w-8 h-8 border-2 border-[#0071e3]/30 border-t-[#0071e3] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <div className="p-8 pt-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
