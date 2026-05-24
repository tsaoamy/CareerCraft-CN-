/**
 * GET /api/talent - 获取人才画像 (Phase 4)
 * POST /api/talent - 创建/更新人才画像
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/api/middleware';
import { TalentRepository } from '@/lib/db/repositories/talent';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const listAll = url.searchParams.get('all') === 'true';

    if (listAll) {
      // 管理员查看所有人
      const adminAuth = await requireAdmin(request);
      if (adminAuth instanceof NextResponse) return adminAuth;

      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
      const result = await TalentRepository.listAll(page, pageSize);
      return NextResponse.json({ success: true, data: result });
    }

    // 查看自己的画像
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const profile = await TalentRepository.getByUserId(auth.userId);
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get talent error:', error);
    return NextResponse.json(
      { success: false, error: '获取人才画像失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const id = await TalentRepository.upsert(auth.userId, body);

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Save talent error:', error);
    return NextResponse.json(
      { success: false, error: '保存人才画像失败' },
      { status: 500 }
    );
  }
}
