'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN_KEY, ADMIN_SESSION_COOKIE } from '@/lib/auth/constants';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const hasCookie = document.cookie.includes(`${ADMIN_SESSION_COOKIE}=`);
    if (token && hasCookie) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return null;
}
