/**
 * GET /api/admin/users - 获取用户列表（管理员）
 * PUT /api/admin/users - 更新用户信息（管理员）
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api/middleware';
import { UserRepository } from '@/lib/db/repositories/user';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const role = url.searchParams.get('role') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const result = await UserRepository.listAll(page, pageSize, { role, status, search });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { userId, role, status, nickname } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const success = await UserRepository.updateByAdmin(userId, { role, status, nickname });
    if (!success) {
      return NextResponse.json(
        { success: false, error: '更新失败，用户不存在或没有变更' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json(
      { success: false, error: '更新用户失败' },
      { status: 500 }
    );
  }
}
