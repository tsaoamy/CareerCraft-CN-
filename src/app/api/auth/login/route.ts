/**
 * POST /api/auth/login - 用户登录
 * 支持: email / phone / wechat / qq / admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/db/repositories/user';
import { signToken } from '@/lib/auth/jwt';
import { memUsers } from '@/lib/auth/memory-store';

export const runtime = 'nodejs';

/** 内置管理员（兜底：当 SQLite/CloudBase 均不可用时） */
const BUILTIN_ADMINS: Record<string, { username: string; password: string; nickname: string; role: string }> = {
  '123456': { username: '123456', password: '123456', nickname: '系统管理员', role: 'super_admin' },
};

function makeBuiltinUser(u: typeof BUILTIN_ADMINS[string]) {
  return {
    id: 'admin-001',
    username: u.username,
    email: 'admin@careercraft.cn',
    phone: '',
    wechat_openid: '',
    qq_openid: '',
    auth_provider: 'email' as const,
    nickname: u.nickname,
    avatar_url: '',
    role: u.role as 'super_admin',
    status: 'active' as const,
    created_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method = 'email', login, password, phone, openid, isAdmin = false } = body;

    let user = null;

    switch (method) {
      case 'email': {
        if (!login || !password) {
          return NextResponse.json(
            { success: false, error: '请输入账号和密码' },
            { status: 400 }
          );
        }

        // 兜底：内置管理员
        const builtin = BUILTIN_ADMINS[login];
        if (builtin && builtin.password === password) {
          user = makeBuiltinUser(builtin);
          break;
        }

        // 正常流程
        user = isAdmin
          ? await UserRepository.verifyAdminLogin(login, password)
          : await UserRepository.verifyLogin(login, password);

        if (!user) {
          return NextResponse.json(
            { success: false, error: isAdmin ? '管理员账号或密码错误' : '账号或密码错误' },
            { status: 401 }
          );
        }
        break;
      }

      case 'phone': {
        if (!phone || !password) {
          return NextResponse.json({ success: false, error: '请输入手机号和密码' }, { status: 400 });
        }

        // 兜底：内存用户
        const memUser = memUsers.get(phone);
        if (memUser && memUser.password === password) {
          user = {
            id: `mem-${phone}`, username: memUser.username,
            email: null, phone, wechat_openid: '', qq_openid: '', auth_provider: 'phone' as const,
            nickname: memUser.nickname, avatar_url: '', role: 'user' as const, status: 'active' as const,
            created_at: new Date().toISOString(),
          };
          break;
        }

        // 正常流程
        user = await UserRepository.verifyLoginByPhone(phone, password);
        if (!user) {
          return NextResponse.json(
            { success: false, error: '手机号或密码错误' },
            { status: 401 }
          );
        }
        break;
      }

      case 'wechat': {
        if (!openid) {
          return NextResponse.json(
            { success: false, error: '微信授权失败，请重试' },
            { status: 400 }
          );
        }
        user = await UserRepository.verifyLoginByOAuth('wechat', openid);
        if (!user) {
          user = await UserRepository.createByOAuth({ provider: 'wechat', openid });
          if (!user) {
            return NextResponse.json(
              { success: false, error: '微信登录失败' },
              { status: 500 }
            );
          }
        }
        break;
      }

      case 'qq': {
        if (!openid) {
          return NextResponse.json(
            { success: false, error: 'QQ授权失败，请重试' },
            { status: 400 }
          );
        }
        user = await UserRepository.verifyLoginByOAuth('qq', openid);
        if (!user) {
          user = await UserRepository.createByOAuth({ provider: 'qq', openid });
          if (!user) {
            return NextResponse.json(
              { success: false, error: 'QQ登录失败' },
              { status: 500 }
            );
          }
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: '不支持的登录方式' },
          { status: 400 }
        );
    }

    const token = await signToken(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      isAdmin || user.role === 'super_admin'
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
