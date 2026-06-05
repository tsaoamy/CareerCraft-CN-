/**
 * POST /api/auth/send-code — 发送换绑验证码
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import {
  issueVerificationCode,
  validatePhone,
  validateEmail,
  type VerifyPurpose,
} from '@/lib/auth/verification';
import { UserRepository } from '@/lib/db/repositories/user';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { type, target, purpose } = body as {
      type?: 'phone' | 'email';
      target?: string;
      purpose?: VerifyPurpose;
    };

    if (!type || !target || !purpose) {
      return NextResponse.json(
        { success: false, error: '参数不完整' },
        { status: 400 }
      );
    }

    if (purpose !== 'bind_phone' && purpose !== 'bind_email') {
      return NextResponse.json(
        { success: false, error: '无效的验证用途' },
        { status: 400 }
      );
    }

    const trimmed = type === 'email' ? target.trim().toLowerCase() : target.trim();

    if (type === 'phone') {
      if (!validatePhone(trimmed)) {
        return NextResponse.json(
          { success: false, error: '请输入正确的手机号' },
          { status: 400 }
        );
      }
    } else if (!validateEmail(trimmed)) {
      return NextResponse.json(
        { success: false, error: '请输入正确的邮箱地址' },
        { status: 400 }
      );
    }

    const user = await UserRepository.getById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    if (type === 'phone' && user.phone === trimmed) {
      return NextResponse.json(
        { success: false, error: '新手机号不能与当前绑定相同' },
        { status: 400 }
      );
    }
    if (type === 'email' && user.email === trimmed) {
      return NextResponse.json(
        { success: false, error: '新邮箱不能与当前绑定相同' },
        { status: 400 }
      );
    }

    const result = issueVerificationCode(auth.userId, purpose, trimmed);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, retryAfter: result.retryAfter },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      demoHint: '演示环境验证码为 123456',
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { success: false, error: '发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
