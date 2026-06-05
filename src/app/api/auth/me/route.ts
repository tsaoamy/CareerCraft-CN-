/**
 * GET /api/auth/me - 获取当前用户信息
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { UserRepository } from '@/lib/db/repositories/user';

export const runtime = 'nodejs';

const BUILTIN_ADMIN = {
  id: 'admin-001',
  username: '123456',
  email: 'admin@careercraft.cn',
  phone: '',
  wechat_openid: '',
  qq_openid: '',
  auth_provider: 'email' as const,
  nickname: '系统管理员',
  avatar_url: '',
  role: 'super_admin' as const,
  status: 'active' as const,
  created_at: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // 兜底：内置管理员
    if (auth.userId === 'admin-001' || auth.username === '123456') {
      return NextResponse.json({
        success: true,
        data: { user: BUILTIN_ADMIN },
      });
    }

    const user = await UserRepository.getById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
