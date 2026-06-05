/**
 * GET/PUT /api/user-data/applications — 投递记录云端持久化
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { UserDataRepository } from '@/lib/db/repositories/user-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const applications = await UserDataRepository.getApplications(auth.userId);
    return NextResponse.json({
      success: true,
      data: { applications, syncedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('GET applications error:', error);
    return NextResponse.json({ success: false, error: '读取投递记录失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const applications = Array.isArray(body.applications) ? body.applications : [];

    await UserDataRepository.setApplications(auth.userId, applications, {
      username: auth.username,
    });

    return NextResponse.json({
      success: true,
      data: { count: applications.length, syncedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('PUT applications error:', error);
    return NextResponse.json({ success: false, error: '保存投递记录失败' }, { status: 500 });
  }
}
