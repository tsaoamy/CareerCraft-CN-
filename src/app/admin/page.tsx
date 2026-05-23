'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    router.push(token ? '/admin/dashboard' : '/admin/login');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="w-8 h-8 border-2 border-[#0071e3]/30 border-t-[#0071e3] rounded-full animate-spin" />
    </div>
  );
}
