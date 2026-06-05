/**
 * API 客户端工具函数
 * 统一处理认证和错误
 */

import { SafeUser } from '@/lib/db/schema';
import { AUTH_TOKEN_KEY } from '@/lib/auth/constants';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

/**
 * 通用 API 请求函数
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return { success: false, error: '登录已过期，请重新登录' };
    }

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch {
    return { success: false, error: '网络错误' };
  }
}

/**
 * 追踪用户行为事件
 */
export async function trackEvent(
  eventType: string,
  eventData: Record<string, unknown> = {},
  eventCategory = 'general'
) {
  try {
    await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType,
        event_category: eventCategory,
        event_data: eventData,
        page_url: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    });
  } catch {
    // 静默失败，不影响主流程
  }
}

/**
 * 带鉴权的 FormData 上传（不设置 Content-Type，由浏览器自动附加 boundary）
 */
export async function apiFetchFormData<T = unknown>(
  url: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { method: 'POST', headers, body: formData });

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return { success: false, error: '请先登录后再上传简历' };
    }

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || '请求过于频繁，请稍后再试' };
    }

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch {
    return { success: false, error: '网络错误' };
  }
}
