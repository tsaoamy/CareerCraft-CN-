'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    localStorage.setItem('admin_token', 'admin_jwt_mock_token');
    document.cookie = 'admin_session=valid; path=/; max-age=86400';
    router.push('/admin/dashboard');
  }, [router]);
  return null;
}
