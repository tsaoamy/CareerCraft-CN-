/**
 * API 请求认证中间件
 * 用于 Next.js Route Handler 的 JWT 验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken, JwtPayload } from '@/lib/auth/jwt';
import { isAdminRole } from '@/lib/auth/rbac';

export interface AuthContext {
  userId: string;
  username: string;
  role: string;
}

/**
 * 验证用户身份（可选 - 不强制登录）
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const token = extractToken(request.headers.get('authorization'));
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    username: payload.username,
    role: payload.role,
  };
}

/**
 * 要求用户已登录
 */
export async function requireAuth(request: NextRequest): Promise<AuthContext | NextResponse> {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json(
      { success: false, error: '请先登录', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  return auth;
}

/**
 * 要求管理员权限
 */
export async function requireAdmin(request: NextRequest): Promise<AuthContext | NextResponse> {
  const result = await requireAuth(request);
  if (result instanceof NextResponse) return result;

  if (!isAdminRole(result.role)) {
    return NextResponse.json(
      { success: false, error: '需要管理员权限', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  return result;
}

/**
 * 要求超级管理员权限
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AuthContext | NextResponse> {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;

  if (result.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: '需要超级管理员权限', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  return result;
}
