/**
 * POST /api/auth/login - 用户登录
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/db/repositories/user';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, password, isAdmin = false } = body;

    if (!login || !password) {
      return NextResponse.json(
        { success: false, error: '请输入账号和密码' },
        { status: 400 }
      );
    }

    const user = isAdmin
      ? await UserRepository.verifyAdminLogin(login, password)
      : await UserRepository.verifyLogin(login, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: isAdmin ? '管理员账号或密码错误' : '账号或密码错误' },
        { status: 401 }
      );
    }

    const token = await signToken(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      isAdmin
    );

    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
