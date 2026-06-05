/**
 * 简易内存限流（按 key 固定窗口计数，适用于单实例开发/演示环境）
 */

import { NextResponse } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }

  entry.count += 1;
  return { ok: true };
}

/** 超限则返回 429 Response，否则返回 null */
export function rateLimitOrResponse(
  key: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const result = checkRateLimit(key, limit, windowMs);
  if (result.ok) return null;

  return NextResponse.json(
    {
      success: false,
      error: '请求过于频繁，请稍后再试',
      code: 'RATE_LIMITED',
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfter) },
    }
  );
}
