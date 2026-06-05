/**
 * GET/PUT /api/user-data/materials — 用户素材库云端持久化（CloudBase + SQLite）
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/middleware';
import { UserDataRepository } from '@/lib/db/repositories/user-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const materials = await UserDataRepository.getMaterials(auth.userId);
    return NextResponse.json({
      success: true,
      data: { materials, syncedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('GET materials error:', error);
    return NextResponse.json({ success: false, error: '读取素材库失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const materials = Array.isArray(body.materials) ? body.materials : [];

    await UserDataRepository.setMaterials(auth.userId, materials, {
      username: auth.username,
    });

    return NextResponse.json({
      success: true,
      data: { count: materials.length, syncedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('PUT materials error:', error);
    return NextResponse.json({ success: false, error: '保存素材库失败' }, { status: 500 });
  }
}
