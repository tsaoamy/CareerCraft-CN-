/**
 * API 客户端工具函数
 * 统一处理认证和错误
 */

import { SafeUser } from '@/lib/db/schema';

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
    ? localStorage.getItem('careercraft_token_v2')
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
        localStorage.removeItem('careercraft_token_v2');
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
