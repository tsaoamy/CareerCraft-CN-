/**
 * POST /api/auth/register - 用户注册
 * 支持: email / phone / wechat / qq
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/db/repositories/user';
import { signToken } from '@/lib/auth/jwt';
import { memUsers } from '@/lib/auth/memory-store';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method = 'email', username, email, password, nickname, phone, openid } = body;

    let user = null;

    switch (method) {
      case 'email': {
        if (!username || !email || !password) {
          return NextResponse.json({ success: false, error: '用户名、邮箱和密码为必填项' }, { status: 400 });
        }
        if (password.length < 6) {
          return NextResponse.json({ success: false, error: '密码至少需要6位' }, { status: 400 });
        }
        try { user = await UserRepository.createByEmail({ username, email, password, nickname }); } catch {}
        if (!user) { return NextResponse.json({ success: false, error: '该邮箱已被注册' }, { status: 409 }); }
        break;
      }

      case 'phone': {
        if (!phone || !password) {
          return NextResponse.json({ success: false, error: '手机号和密码为必填项' }, { status: 400 });
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          return NextResponse.json({ success: false, error: '请输入正确的手机号' }, { status: 400 });
        }
        if (password.length < 6) {
          return NextResponse.json({ success: false, error: '密码至少需要6位' }, { status: 400 });
        }

        // 主路径：数据库注册
        try { user = await UserRepository.createByPhone({ phone, password, nickname }); } catch {}
        
        // 兜底：内存注册（数据库不可用时）
        if (!user) {
          if (memUsers.has(phone)) {
            return NextResponse.json({ success: false, error: '该手机号已被注册' }, { status: 409 });
          }
          const displayNickname = nickname || `用户${phone.slice(-4)}`;
          const uid = uuidv4();
          memUsers.set(phone, { username: phone, phone, password, nickname: displayNickname });
          user = {
            id: uid, username: phone,
            email: null, phone, wechat_openid: '', qq_openid: '', auth_provider: 'phone' as const,
            nickname: displayNickname, avatar_url: '', role: 'user' as const, status: 'active' as const,
            created_at: new Date().toISOString(),
          };
        }
        break;
      }

      case 'wechat': {
        if (!openid) return NextResponse.json({ success: false, error: '微信授权失败，请重试' }, { status: 400 });
        try { user = await UserRepository.createByOAuth({ provider: 'wechat', openid, nickname }); } catch {}
        if (!user) return NextResponse.json({ success: false, error: '微信注册失败，请重试' }, { status: 500 });
        break;
      }

      case 'qq': {
        if (!openid) return NextResponse.json({ success: false, error: 'QQ授权失败，请重试' }, { status: 400 });
        try { user = await UserRepository.createByOAuth({ provider: 'qq', openid, nickname }); } catch {}
        if (!user) return NextResponse.json({ success: false, error: 'QQ注册失败，请重试' }, { status: 500 });
        break;
      }

      default:
        return NextResponse.json({ success: false, error: '不支持的注册方式' }, { status: 400 });
    }

    const token = await signToken({ userId: user.id, username: user.username, role: user.role });
    return NextResponse.json({ success: true, data: { user, token } });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: '注册失败，请稍后重试' }, { status: 500 });
  }
}


