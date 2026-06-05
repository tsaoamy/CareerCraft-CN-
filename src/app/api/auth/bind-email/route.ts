/**
 * POST /api/auth/bind-email — 验证并换绑邮箱
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import {
  checkVerificationCode,
  validateEmail,
} from '@/lib/auth/verification';
import { UserRepository } from '@/lib/db/repositories/user';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: '邮箱和验证码为必填项' },
        { status: 400 }
      );
    }

    const trimmed = String(email).trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      return NextResponse.json(
        { success: false, error: '请输入正确的邮箱地址' },
        { status: 400 }
      );
    }

    if (!checkVerificationCode(auth.userId, 'bind_email', trimmed, String(code).trim())) {
      return NextResponse.json(
        { success: false, error: '验证码错误或已过期（演示环境验证码为 123456）' },
        { status: 400 }
      );
    }

    const updated = await UserRepository.updateEmail(auth.userId, trimmed);
    if (!updated.ok) {
      return NextResponse.json(
        { success: false, error: updated.error },
        { status: 409 }
      );
    }

    const user = await UserRepository.getById(auth.userId);
    return NextResponse.json({
      success: true,
      message: '邮箱换绑成功',
      data: { user },
    });
  } catch (error) {
    console.error('Bind email error:', error);
    return NextResponse.json(
      { success: false, error: '换绑失败，请稍后重试' },
      { status: 500 }
    );
  }
}
