/**
 * POST /api/auth/create-profile - 在 cv_users 中创建/更新用户档案
 * CloudBase Auth 注册/登录成功后调用，使用 Node SDK admin 权限写入
 */
import { NextRequest, NextResponse } from 'next/server';
import { isCloudBaseEnabled, COLLECTIONS, upsertDoc } from '@/lib/cloudbase/client';
import { getDb, execute } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, username, nickname, email, phone } = body;

    if (!uid || !username) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数 (uid, username)' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (isCloudBaseEnabled()) {
      // CloudBase NoSQL 写入
      const ok = await upsertDoc(COLLECTIONS.users, uid, {
        username,
        email: email || '',
        phone: phone || '',
        auth_provider: phone ? 'phone' : 'email',
        nickname: nickname || username,
        wechat_openid: '',
        qq_openid: '',
        role: 'user',
        status: 'active',
        created_at: now,
        // 注意：不覆盖已有的 password_hash、wechat_openid、qq_openid
      });
      return NextResponse.json({ success: ok, data: { uid, username } });
    }

    // SQLite 回退
    await getDb();
    execute(
      `INSERT OR IGNORE INTO users (id, username, email, phone, auth_provider, nickname, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'user', 'active', ?)`,
      [uid, username, email || null, phone || '', phone ? 'phone' : 'cloud_base', nickname || username, now]
    );

    return NextResponse.json({ success: true, data: { uid, username } });
  } catch (error) {
    console.error('[create-profile] ERROR:', error);
    return NextResponse.json(
      { success: false, error: '创建用户档案失败' },
      { status: 500 }
    );
  }
}
