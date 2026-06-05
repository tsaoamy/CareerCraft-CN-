/**
 * GET/PUT /api/user-data/profile — 用户资料云端持久化
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { UserDataRepository } from '@/lib/db/repositories/user-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const profile = await UserDataRepository.getProfile(auth.userId);
    return NextResponse.json({
      success: true,
      data: { profile, syncedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ success: false, error: '读取用户资料失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const profile = body.profile && typeof body.profile === 'object' ? body.profile : {};

    await UserDataRepository.setProfile(auth.userId, profile);

    return NextResponse.json({ success: true, data: { syncedAt: new Date().toISOString() } });
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ success: false, error: '保存用户资料失败' }, { status: 500 });
  }
}
