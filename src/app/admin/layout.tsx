'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 登录页面不需要侧边栏
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin';

  // 简单的登录守卫（生产环境替换为真实 JWT 验证）
  useEffect(() => {
    if (!isLoginPage) {
      const token = localStorage.getItem('admin_token');
      const cookie = document.cookie.includes('admin_session=valid');
      if (!token && !cookie) {
        router.push('/admin/login');
      }
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
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
