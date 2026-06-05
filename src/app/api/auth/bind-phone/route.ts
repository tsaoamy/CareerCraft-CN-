/**
 * POST /api/auth/bind-phone — 验证并换绑手机号
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import {
  checkVerificationCode,
  validatePhone,
} from '@/lib/auth/verification';
import { UserRepository } from '@/lib/db/repositories/user';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码为必填项' },
        { status: 400 }
      );
    }

    const trimmed = String(phone).trim();
    if (!validatePhone(trimmed)) {
      return NextResponse.json(
        { success: false, error: '请输入正确的手机号' },
        { status: 400 }
      );
    }

    if (!checkVerificationCode(auth.userId, 'bind_phone', trimmed, String(code).trim())) {
      return NextResponse.json(
        { success: false, error: '验证码错误或已过期（演示环境验证码为 123456）' },
        { status: 400 }
      );
    }

    const updated = await UserRepository.updatePhone(auth.userId, trimmed);
    if (!updated.ok) {
      return NextResponse.json(
        { success: false, error: updated.error },
        { status: 409 }
      );
    }

    const user = await UserRepository.getById(auth.userId);
    return NextResponse.json({
      success: true,
      message: '手机号换绑成功',
      data: { user },
    });
  } catch (error) {
    console.error('Bind phone error:', error);
    return NextResponse.json(
      { success: false, error: '换绑失败，请稍后重试' },
      { status: 500 }
    );
  }
}
